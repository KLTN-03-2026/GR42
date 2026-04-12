<?php
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "crawl_news";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Kết nối thất bại: " . $conn->connect_error]));
}

function cleanText($str) {
    if (!$str) return '';
    $decoded = html_entity_decode($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $decoded = html_entity_decode($decoded, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim($decoded);
}

function makeThumbnailUrl($url) {
    if (!$url) return '';
    if (strpos($url, "thanhnien.vn") !== false) {
        if (strpos($url, "w=") !== false) {
            return preg_replace('/w=\d+/', 'w=200', $url);
        } else {
            return $url . (strpos($url, '?') !== false ? '&' : '?') . 'w=200';
        }
    }
    if (strpos($url, "tuoitre.vn") !== false) {
        if (strpos($url, "w=") !== false) {
            return preg_replace('/w=\d+/', 'w=200', $url);
        } elseif (strpos($url, "zoom=") !== false) {
            return preg_replace('/zoom=\d+/', 'zoom=2', $url);
        } else {
            return $url . (strpos($url, '?') !== false ? '&' : '?') . 'w=200';
        }
    }
    return $url;
}

$jsonUrl = "https://docs.google.com/spreadsheets/d/1IfVBDmE6XKtFaD4i5smZR17L87TZ3b4RPTdcwCZpQGo/gviz/tq?tqx=out:json&gid=0";
$response = @file_get_contents($jsonUrl);
if ($response === false) {
    die(json_encode(["status" => "error", "message" => "Không thể kết nối Google Sheet"]));
}
$start = strpos($response, '{');
$end   = strrpos($response, '}') + 1;
$json  = substr($response, $start, $end - $start);
$data  = json_decode($json, true);
if (!$data) {
    die(json_encode(["status" => "error", "message" => "Không parse được JSON từ Google Sheet"]));
}

$sql = "INSERT INTO crawl_news (id, title, link, image, pubdate, source, savedtime, category, content) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            link = VALUES(link),
            image = VALUES(image),
            pubdate = VALUES(pubdate),
            source = VALUES(source),
            savedtime = VALUES(savedtime),
            category = VALUES(category),
            content = VALUES(content)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "Lỗi câu lệnh: " . $conn->error]));
}
$stmt->bind_param("issssssss", $id, $title, $link, $image, $pubdate, $source, $savedtime, $category, $content);
$newCount = 0;
$updateCount = 0;
$skipCount = 0;

$rows = $data['table']['rows'];
foreach ($rows as $index => $row) {
    if ($index == 0) continue;

    $id        = isset($row['c'][0]['v']) ? (int)$row['c'][0]['v'] : 0;
    $title     = cleanText($row['c'][1]['v'] ?? '');
    $link      = $row['c'][2]['v'] ?? '';
    $imageRaw  = $row['c'][3]['v'] ?? '';
    $image     = makeThumbnailUrl($imageRaw);
    $pubdate   = !empty($row['c'][4]['v']) ? date("Y-m-d H:i:s", strtotime($row['c'][4]['v'])) : null;
    $source    = cleanText($row['c'][5]['v'] ?? '');
    $savedtime = date("Y-m-d H:i:s");
    $category  = cleanText($row['c'][7]['v'] ?? '');
    $content   = $row['c'][8]['v'] ?? '';
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        if ($stmt->affected_rows === 1) $newCount++;
        else $updateCount++;
    } else {
        $skipCount++;
    }
}

$stmt->close();
$conn->close();

echo json_encode([
    "status"  => "success",
    "new"     => $newCount,
    "updated" => $updateCount,
    "skipped" => $skipCount,
    "total"   => count($rows) - 1
], JSON_UNESCAPED_UNICODE);
