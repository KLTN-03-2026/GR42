<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="templates/assets/css/list.css" rel="stylesheet">
    <link href="templates/assets/css/search.css" rel="stylesheet">
    <link href="templates/assets/css/comment.css" rel="stylesheet">
    <style>
    body {
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
    }

    .container {
        max-width: 900px;
        margin: 20px auto;
        background: #fff;
        padding: 40px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
    }

    .btn-back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 8px;
        background: transparent;
        color: #b22222;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        border: 1px solid #b22222;
        transition: all 0.25s ease;
        cursor: pointer;
    }

    .btn-back:hover {
        background: #b22222;
        color: #fff;
        transform: translateX(-3px);
        box-shadow: 0 4px 10px rgba(178, 34, 34, 0.2);
    }

    .btn-back:active {
        transform: scale(0.96);
        box-shadow: none;
    }

    .btn-back:hover {
        text-decoration: underline;
    }

    .article-header {
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }

    .article-category {
        text-transform: uppercase;
        color: #9f224e;
        font-weight: bold;
        font-size: 13px;
        margin-bottom: 10px;
        display: inline-block;
    }

    .article-title {
        font-size: 32px;
        line-height: 1.4;
        color: #222;
        margin: 0 0 15px 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-weight: 700;
    }

    .article-meta {
        font-size: 14px;
        color: #757575;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .article-content {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 19px;
        line-height: 1.7;
        color: #111;
        margin-bottom: 30px;
        letter-spacing: 0.1px;
    }

    .article-content p {
        margin: 0 0 20px 0;
        text-align: justify;
    }

    .article-content img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto 10px auto;
        border-radius: 4px;
    }

    .article-content figure {
        margin: 0 0 25px 0;
        text-align: center;
    }

    .article-content figcaption {
        font-size: 14px;
        color: #757575;
        font-style: italic;
        background-color: #f7f7f7;
        padding: 8px;
        margin-top: 5px;
    }

    .source-link-wrapper {
        text-align: left;
        padding: 15px 0;
        border-top: 1px solid #e5e5e5;
        margin-top: 20px;
    }

    .source-link-wrapper a {
        display: inline-flex;
        align-items: center;
        background: #fdfdfd;
        border: 1px solid #ddd;
        padding: 10px 20px;
        color: #004d80;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .source-link-wrapper a:hover {
        background: #004d80;
        color: #fff;
        border-color: #004d80;
    }

    .add-comment h3,
    .comments h3 {
        font-family: Arial, sans-serif;
        border-bottom: 2px solid #b22222;
        display: inline-block;
        padding-bottom: 8px;
        margin-top: 30px;
    }

    #commentAddForm textarea {
        width: 100%;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        padding: 15px;
        font-size: 15px;
        font-family: inherit;
        margin-bottom: 10px;
        resize: vertical;
        outline: none;
    }

    #commentAddForm textarea:focus {
        border-color: #b22222;
    }

    #commentAddForm button {
        background: #b22222;
        color: #fff;
        border: none;
        padding: 10px 25px;
        border-radius: 4px;
        font-size: 15px;
        cursor: pointer;
        font-weight: bold;
    }

    #commentAddForm button:hover {
        background: #901616;
    }

    .btn-read-paragraph {
        margin-left: 10px;
        padding: 4px 8px;
        font-size: 13px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fdfdfd;
        color: #333;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
        transition: 0.2s;
    }

    .btn-read-paragraph:hover {
        background: #f0f0f0;
        border-color: #b22222;
    }

    .btn-read-paragraph:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-read-article {
        padding: 6px 12px;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #b22222;
        border-radius: 6px;
        background: #fff;
        color: #b22222;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        transition: 0.2s;
    }

    .btn-read-article:hover {
        background: #b22222;
        color: #fff;
    }

    .btn-read-article:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    </style>
</head>

<body>
    <div class="container">
        <a href="?module=news&action=list" class="btn-back">
            &larr; Trở về trang chủ
        </a>

        <article>
            <header class="article-header">
                <span class="article-category"><?= htmlspecialchars($news['category'] ?? 'Tin tức') ?></span>
                <h1 class="article-title"><?= htmlspecialchars($news['title']) ?></h1>

                <div class="article-meta">
                    <div class="author-time">
                        <strong>Nguồn: <?= htmlspecialchars($news['source'] ?? 'Tổng hợp') ?></strong> &nbsp;|&nbsp;
                        <span><?= htmlspecialchars(date('l, d/m/Y H:i', strtotime($news['pubDate']))) ?></span>
                    </div>
                    <div class="article-actions">
                        <button class="btn-read-article" id="btnReadAll" title="Đọc toàn bộ bài viết">🔊 Đọc bài</button>
                        <button class="btn-report-article" id="btnReportArticle" style="background: #fff; color: #757575; border: 1px solid #ddd; padding: 6px 12px; border-radius: 6px; font-size: 14px; cursor: pointer; margin-left: 10px;">Báo cáo</button>
                    </div>
                </div>
            </header>

            <!-- AI SUMMARY BOX -->
            <div class="ai-summary-box" style="background: #f2f7ff; border: 1px solid #cce0ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin-top: 0; color: #004d80; font-size: 16px; display: flex; align-items: center; gap: 8px; border-bottom: none; padding-bottom: 0;">
                    ✨ Tóm tắt AI
                    <button id="btnAiSummary" class="btn-read-article" style="font-size: 12px; padding: 6px 10px; margin-left: auto;">Tạo tóm tắt</button>
                </h3>
                <div id="aiSummaryContent" style="font-size: 15px; color: #444; line-height: 1.6; font-style: italic; margin-top: 10px;">
                    Nhấn nút "Tạo tóm tắt" để AI phân tích và cô đọng nội dung bài báo này.
                </div>
            </div>

            <!-- ARTICLE CONTENT BODY -->
            <div class="article-content">
                <?php if (!empty($news['image'])): ?>
                <figure>
                    <img src="<?= htmlspecialchars($news['image']) ?>" alt="Ảnh bài báo">
                    <figcaption>Ảnh đại diện bài báo.</figcaption>
                </figure>
                <?php endif; ?>

                <!-- IN RAW HTML CONTENT -->
                <?= $news['content'] ?>
            </div>

            <!-- SOURCE LINK BUTTON -->
            <div class="source-link-wrapper">
                <a href="<?= htmlspecialchars($news['link']) ?>" target="_blank">
                    Đọc bài viết gốc trên <?= htmlspecialchars($news['source'] ?? 'Tòa soạn báo') ?> &rarr;
                </a>
            </div>
        </article>

        <div class="add-comment">
            <h3>Thêm bình luận</h3>
            <form id="commentAddForm">
                <input type="hidden" name="news_id" value="<?= $news_id ?>">
                <textarea name="content" rows="4" placeholder="Nhập bình luận của bạn..." required></textarea>
                <button type="submit">Gửi bình luận</button>
            </form>
            <script>
            document.getElementById('commentAddForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                fetch('index.php?module=api&action=comments&action_type=add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(res => res.json()).then(res => {
                    if (res.status === 'success') location.reload();
                    else alert(res.message);
                });
            });
            </script>
        </div>

        <div class="comments">
            <h3>Bình luận</h3>
            <?php if ($comments->num_rows > 0): ?>
            <?php while ($c = $comments->fetch_assoc()): ?>
            <?php
                $projectPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
                $baseUrl = rtrim($projectPath, '/BE'); 
                $baseDir = $_SERVER['DOCUMENT_ROOT'] . $baseUrl; 
                $defaultAvatar = 'templates/uploads/avatar.jpg'; 
                $avatarToShow = $defaultAvatar;
                if (!empty($c['avatar'])) {
                    
                    $userAvatarPath = $c['avatar'];
                    if (strpos($userAvatarPath, $baseUrl . '/') === 0) {
                        $userAvatarPath = substr($userAvatarPath, strlen($baseUrl . '/'));
                    }
                    $userAvatarPath = ltrim($userAvatarPath, '/');
                    $fullFileSystemPath = $baseDir . '/' . $userAvatarPath;
                    
                    if ($userAvatarPath && file_exists($fullFileSystemPath)) {
                        $avatarToShow = $userAvatarPath;
                    }
                }
            
                $avatarPath = $baseUrl . '/' . $avatarToShow;
                
                
            ?>

            <div class="comment-item" data-comment-id="<?= $c['id'] ?>">
                <img src="<?= htmlspecialchars($avatarPath) ?>" alt="Avatar">
                <div class="comment-body">
                    <p><?= htmlspecialchars($c['fullname']) ?></p>

                    <div class="comment-content-display">
                        <p><?= nl2br(htmlspecialchars($c['content'])) ?></p>
                        <small><?= htmlspecialchars(date('d/m/Y H:i', strtotime($c['created_at']))) ?></small>
                    </div>

                    <div class="comment-content-edit">
                        <textarea rows="3"><?= htmlspecialchars($c['content']) ?></textarea>
                        <button class="btn-save-comment">Lưu</button>
                        <button class="btn-cancel-comment">Hủy</button>
                    </div>

                </div>

                <div class="comment-actions">
                    <?php if ($c['user_id'] == $_SESSION['user_id'] || (isset($_SESSION['role']) && $_SESSION['role'] === 'admin')): ?>
                    <button class="btn-edit-comment">Sửa</button>
                    <button class="btn-delete-comment" data-comment-id="<?= $c['id'] ?>">Xóa</button>
                    <?php endif; ?>
                    
                    <?php if ($c['user_id'] != $_SESSION['user_id']): ?>
                    <button class="btn-report-comment" data-comment-id="<?= $c['id'] ?>" style="color: #757575;">Báo cáo</button>
                    <?php endif; ?>
                </div>

            </div>
            <?php endwhile; ?>
            <?php else: ?>
            <p>Chưa có bình luận nào.</p>
            <?php endif; ?>
        </div>

    </div>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.btn-edit-comment').forEach(button => {
            button.addEventListener('click', () => {
                const commentItem = button.closest('.comment-item');
                const displayBox = commentItem.querySelector('.comment-content-display');
                const editBox = commentItem.querySelector('.comment-content-edit');
                const actions = commentItem.querySelector('.comment-actions');
                const textarea = editBox.querySelector('textarea');

                textarea.value = displayBox.querySelector('p').innerText.trim();
                displayBox.style.display = 'none';
                editBox.style.display = 'block';
                if (actions) actions.style.display = 'none';
                textarea.focus();
            });
        });

        document.querySelectorAll('.btn-cancel-comment').forEach(button => {
            button.addEventListener('click', () => {
                const commentItem = button.closest('.comment-item');
                const displayBox = commentItem.querySelector('.comment-content-display');
                const editBox = commentItem.querySelector('.comment-content-edit');
                const actions = commentItem.querySelector('.comment-actions');

                editBox.style.display = 'none';
                displayBox.style.display = 'block';
                if (actions) actions.style.display = 'flex';
            });
        });

        document.querySelectorAll('.btn-save-comment').forEach(button => {
            button.addEventListener('click', () => {
                const commentItem = button.closest('.comment-item');
                const commentId = commentItem.dataset.commentId;
                const newContent = commentItem.querySelector('.comment-content-edit textarea')
                    .value.trim();

                if (!newContent) {
                    alert('Nội dung bình luận không được để trống.');
                    return;
                }

                button.disabled = true;
                button.innerText = 'Đang lưu...';

                fetch('modules/api/comment_edit.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            comment_id: commentId,
                            content: newContent
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success') {
                            commentItem.querySelector('.comment-content-display p')
                                .innerHTML = data.content.replace(/\n/g, '<br>');
                            commentItem.querySelector('.comment-content-display small')
                                .innerText = 'Vừa chỉnh sửa';

                            commentItem.querySelector('.comment-content-edit').style
                                .display = 'none';
                            commentItem.querySelector('.comment-content-display').style
                                .display = 'block';
                            if (commentItem.querySelector('.comment-actions')) {
                                commentItem.querySelector('.comment-actions').style
                                    .display = 'flex';
                            }
                        } else {
                            alert('Lỗi: ' + data.message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        alert('Không thể lưu bình luận. Vui lòng thử lại.');
                    })
                    .finally(() => {
                        button.disabled = false;
                        button.innerText = 'Lưu';
                    });
            });
        });
        document.querySelectorAll('.btn-delete-comment').forEach(button => {
            button.addEventListener('click', () => {
                if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
                const commentId = button.dataset.commentId;
                fetch('index.php?module=api&action=comments&action_type=delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: commentId
                    })
                }).then(r => r.json()).then(res => {
                    if (res.status === 'success') location.reload();
                    else alert(res.message);
                });
            });
        });

        // Báo cáo bình luận
        document.querySelectorAll('.btn-report-comment').forEach(button => {
            button.addEventListener('click', () => {
                const commentId = button.dataset.commentId;
                const reason = prompt('Lý do báo cáo bình luận này:');
                if (!reason) return;

                fetch('index.php?module=api&action=reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        comment_id: commentId,
                        reason: reason,
                        details: 'Báo cáo từ giao diện PHP Template'
                    })
                }).then(r => r.json()).then(res => {
                    alert(res.message);
                });
            });
        });

        // Báo cáo bài báo
        document.getElementById('btnReportArticle')?.addEventListener('click', () => {
            const newsId = document.querySelector('input[name="news_id"]').value;
            const reason = prompt('Lý do báo cáo bài báo này:');
            if (!reason) return;

            fetch('index.php?module=api&action=reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    news_id: newsId,
                    reason: reason,
                    details: 'Báo cáo từ giao diện PHP Template'
                })
            }).then(r => r.json()).then(res => {
                alert(res.message);
            });
        });
    });
    </script>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const paragraphs = document.querySelectorAll('.article-content p');
        const btnReadAll = document.getElementById('btnReadAll');
        let currentAudio = null;
        let currentButton = null;

        function resetCurrentButton() {
            if (currentButton) {
                if (currentButton === btnReadAll) {
                    currentButton.innerHTML = '🔊 Đọc bài';
                } else {
                    currentButton.innerHTML = '🔊';
                }
            }
        }

        if (btnReadAll) {
            btnReadAll.addEventListener('click', async () => {
                if (currentButton === btnReadAll && currentAudio && !currentAudio.paused) {
                    currentAudio.pause();
                    resetCurrentButton();
                    currentAudio = null;
                    currentButton = null;
                    return;
                }

                if (currentAudio) {
                    currentAudio.pause();
                    resetCurrentButton();
                }

                let fullText = document.querySelector('.article-title').innerText + ". \n";
                // Lọc bỏ text của nút 🔊 khỏi paragraph text
                paragraphs.forEach(p => {
                    let clone = p.cloneNode(true);
                    let btns = clone.querySelectorAll('button');
                    btns.forEach(b => b.remove());
                    let text = clone.innerText.trim();
                    if(text) fullText += text + " \n";
                });
                
                btnReadAll.innerHTML = '⏳';
                btnReadAll.disabled = true;
                currentButton = btnReadAll;

                await playTTS(fullText, btnReadAll, '⏸', '🔊 Đọc bài');
            });
        }

        paragraphs.forEach(p => {
            let clone = p.cloneNode(true);
            let btns = clone.querySelectorAll('button');
            btns.forEach(b => b.remove());
            const textToRead = clone.innerText.trim();
            if (!textToRead) return;
            
            const btn = document.createElement('button');
            btn.className = 'btn-read-paragraph';
            btn.innerHTML = '🔊';

            p.appendChild(btn);

            btn.addEventListener('click', async () => {
                if (currentButton === btn && currentAudio && !currentAudio.paused) {
                    currentAudio.pause();
                    btn.innerHTML = '🔊';
                    currentAudio = null;
                    currentButton = null;
                    return;
                }

                if (currentAudio) {
                    currentAudio.pause();
                    resetCurrentButton();
                }

                btn.innerHTML = '⏳';
                btn.disabled = true;
                currentButton = btn;

                await playTTS(textToRead, btn, '⏸', '🔊');
            });
        });

        async function playTTS(text, btnElement, pauseIcon, playIcon) {
            try {
                const response = await fetch('modules/api/tts.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });

                if (!response.ok) throw new Error('Lỗi fetch TTS API backend');

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                currentAudio = new Audio(url);

                currentAudio.onplay = () => {
                    btnElement.innerHTML = pauseIcon;
                    btnElement.disabled = false;
                };

                currentAudio.onended = () => {
                    btnElement.innerHTML = playIcon;
                    currentAudio = null;
                    currentButton = null;
                };

                currentAudio.play();
            } catch (err) {
                console.warn(err, "- Đang chuyển sang sử dụng giọng đọc mặc định của trình duyệt...");
                
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'vi-VN';
                    
                    utterance.onstart = () => {
                        btnElement.innerHTML = pauseIcon;
                        btnElement.disabled = false;
                    };
                    utterance.onend = () => {
                        btnElement.innerHTML = playIcon;
                        currentAudio = null;
                        currentButton = null;
                    };
                    
                    currentAudio = {
                        paused: false,
                        pause: () => {
                            window.speechSynthesis.cancel();
                        }
                    };
                    
                    window.speechSynthesis.speak(utterance);
                } else {
                    console.error('Không thể kích hoạt API SpeechSynthesis');
                    alert('Không thể tải Server TTS và trình duyệt không hỗ trợ giọng nói.');
                    btnElement.innerHTML = playIcon;
                    btnElement.disabled = false;
                }
            }
        }
    });

    document.getElementById('btnAiSummary')?.addEventListener('click', async function() {
        const btn = this;
        const contentBox = document.getElementById('aiSummaryContent');
        const newsId = document.querySelector('input[name="news_id"]').value;
        
        btn.innerHTML = '⏳ Đang phân tích...';
        btn.disabled = true;
        contentBox.innerHTML = '<span style="color: #666;">AI đang đọc và phân tích bài báo, vui lòng chờ trong giây lát...</span>';
        
        try {
            const response = await fetch(`modules/api/ai_summary.php?news_id=${newsId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                let htmlOutput = data.summary.replace(/```html/g, '').replace(/```/g, '');
                contentBox.innerHTML = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111; line-height: 1.7; font-style: normal; text-align: justify; padding-top: 10px;">
                        <style>
                            #aiSummaryContent p { margin-bottom: 12px; }
                            #aiSummaryContent ul { padding-left: 20px; margin-bottom: 12px; }
                            #aiSummaryContent li { margin-bottom: 6px; }
                            #aiSummaryContent b, #aiSummaryContent strong { color: #004d80; }
                        </style>
                        ${htmlOutput}
                    </div>
                `;
                btn.style.display = 'none';
            } else {
                contentBox.innerHTML = '<span style="color: #b22222;">Lỗi: ' + data.message + '</span>';
                btn.innerHTML = 'Thử lại';
                btn.disabled = false;
            }
        } catch (err) {
            contentBox.innerHTML = '<span style="color: #b22222;">Lỗi kết nối API AI. Vui lòng thử lại sau.</span>';
            btn.innerHTML = 'Thử lại';
            btn.disabled = false;
        }
    });
    </script>
</body>

</html>