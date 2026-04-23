<?php

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$conn->set_charset("utf8mb4");
function fetchUrl($url)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    $data = curl_exec($ch);
    $error = curl_error($ch);
    unset($ch);
    if ($data === false) {
        return false;
    }
    return $data;
}

function cleanText($str)
{
    if (!$str)
        return '';
    $decoded = html_entity_decode($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim($decoded);
}

function cleanContent($html, $source = '')
{
    if (!$html)
        return '';
    $html = trim(str_replace('""', '"', $html));

    if ($source === 'vietnamnet') {
        // Xóa phần đầu bị dính chuỗi thẻ lúc cào
        $html = preg_replace('/^(id="maincontent"|class="content-detail"|class="maincontent main-content")[^>]*>/i', '', $html);
        // Xóa các khối rác, tin liên quan (đây chính là nơi chứa các hình ảnh bị dư thừa)
        $html = preg_replace('/<div[^>]*class="[^"]*(ArticleRelate|article-relate|news-feature|related-news|insert-wiki-content)[^"]*"[^>]*>[\s\S]*?<\/div>/i', '', $html);
        $html = preg_replace('/<table[^>]*class="[^"]*(vnn-quote)[^"]*"[^>]*>[\s\S]*?<\/table>/i', '', $html);
    }

    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
    $xpath = new DOMXPath($dom);

    foreach ($xpath->query('//script|//style|//table|//iframe|//form|//nav|//header|//footer') as $node) {
        $node->parentNode->removeChild($node);
    }

    // Cắt bỏ phần "Xem thêm về:"
    foreach ($xpath->query('//*[contains(text(), "Xem thêm về:")]') as $node) {
        if ($node->parentNode) {
            $node->parentNode->removeChild($node);
        }
    }



    $result = '';

    $body = $dom->getElementsByTagName('body')->item(0);
    if ($body) {
        $result = processNodes($body, $xpath);
    }

    return $result;
}

function processNodes($parentNode, $xpath)
{
    $content = '';
    foreach ($parentNode->childNodes as $node) {
        if ($node->nodeName === 'p') {
            $text = trim($node->textContent);
            if ($text) {
                $content .= "<p>$text</p>";
            }
        } elseif ($node->nodeName === 'figure' || $node->nodeName === 'img' || ($node->nodeName === 'div' && strpos($node->getAttribute('class'), 'image') !== false)) {
            $img = null;
            if ($node->nodeName === 'img') {
                $img = $node;
            } else {
                $img = $xpath->query('.//img', $node)->item(0);
            }

            if ($img) {
                $src = $img->getAttribute('data-original')
                    ?: $img->getAttribute('data-src')
                    ?: $img->getAttribute('src');

                if ($src) {
                    $caption = '';
                    $capNode = $xpath->query('.//figcaption|.//p[contains(@class, "caption")]|.//div[contains(@class, "caption")]', $node)->item(0);
                    if ($capNode) {
                        $caption = trim($capNode->textContent);
                    }

                    $content .= "
                        <figure class='news-image'>
                            <img src='$src' loading='lazy'>
                            " . ($caption ? "<figcaption>$caption</figcaption>" : "") . "
                        </figure>";
                }
            }
        } elseif ($node->hasChildNodes()) {
            $content .= processNodes($node, $xpath);
        }
    }
    return $content;
}

function makeThumbnailUrl($url)
{
    if (!$url)
        return '';

    if (strpos($url, "thanhnien.vn") !== false) {
        return preg_replace('/w=\d+/', 'w=200', $url);
    }

    if (strpos($url, "tuoitre.vn") !== false) {
        if (strpos($url, "zoom=") !== false) {
            return preg_replace('/zoom=\d+/', 'zoom=2', $url);
        }
        return preg_replace('/w=\d+/', 'w=200', $url);
    }
    return $url;
}

$jsonUrl = _JSON_URL_SHEET;
$response = fetchUrl($jsonUrl);

if (!$response || strlen($response) < 50) {
    die(json_encode([
        "status" => "error",
        "message" => "Khong fetch duoc Google Sheet hoac du lieu rong"
    ]));
}

$start = strpos($response, '{');
$end = strrpos($response, '}') + 1;
$json = substr($response, $start, $end - $start);
$data = json_decode($json, true);

if (!$data) {
    die(json_encode([
        "status" => "error",
        "message" => "JSON decode loi tu chuoi Google Sheet"
    ]));
}

// $conn->query("DELETE FROM crawl_news"); // Commented out to preserve favorites and comments
$sql = "INSERT INTO crawl_news (id, title, link, image, pubdate, source, savedtime, category, content) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), link = VALUES(link),
        image = VALUES(image), pubdate = VALUES(pubdate), source = VALUES(source), savedtime = VALUES(savedtime),
        category = VALUES(category), content = VALUES(content)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode([
        "status" => "error",
        "message" => "Prepare loi: " . $conn->error
    ]));
}

$newCount = 0;
$updateCount = 0;
$skipCount = 0;

if (isset($data['table']['rows']) && is_array($data['table']['rows'])) {
    $rows = $data['table']['rows'];

    foreach ($rows as $index => $row) {
        if ($index == 0)
            continue;

        $id = (int) ($row['c'][0]['v'] ?? 0);
        $title = cleanText($row['c'][1]['v'] ?? '');
        $link = $row['c'][2]['v'] ?? '';

        if (!$id || !$title || !$link) {
            $skipCount++;
            continue;
        }

        $imageRaw = $row['c'][3]['v'] ?? '';
        $image = makeThumbnailUrl($imageRaw);
        $pubdate = !empty($row['c'][4]['v']) ? date("Y-m-d H:i:s", strtotime($row['c'][4]['v'])) : null;
        $source = cleanText($row['c'][5]['v'] ?? '');
        $category = cleanText($row['c'][7]['v'] ?? '');
        $contentRaw = isset($row['c'][8]['v']) ? $row['c'][8]['v'] : '';
        $content = cleanContent($contentRaw, $source);
        $savedtime = date("Y-m-d H:i:s");
        $stmt->bind_param("issssssss", $id, $title, $link, $image, $pubdate, $source, $savedtime, $category, $content);

        if ($stmt->execute()) {
            if ($stmt->affected_rows == 1) {
                $newCount++;
            } else {
                $updateCount++;
            }
        } else {
            $skipCount++;
        }
    }
}
$stmt->close();

echo json_encode([
    "status" => "success",
    "new" => $newCount,
    "updated" => $updateCount,
    "skipped" => $skipCount,
    "total" => count($rows) - 1
], JSON_UNESCAPED_UNICODE);
