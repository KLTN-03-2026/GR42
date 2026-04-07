<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý tài khoản - TestCrawl</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root { --primary: #4f46e5; --bg: #f3f4f6; --text: #1f2937; }
        body { background: var(--bg); font-family: 'Inter', sans-serif; display: flex; height: 100vh; margin: 0; }
        
        /* --- SIDEBAR STYLES --- */
        .sidebar { width: 260px; background: #fff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 50; }
        .brand { height: 64px; display: flex; align-items: center; padding: 0 24px; font-weight: 800; color: var(--primary); font-size: 20px; border-bottom: 1px solid #e5e7eb; }
        .menu { flex: 1; padding: 20px 0; overflow-y: auto; }
        
        .nav-item { display: flex; align-items: center; padding: 12px 24px; color: #6b7280; text-decoration: none; font-weight: 500; transition: 0.2s; cursor: pointer; }
        .nav-item:hover { background: #f9fafb; color: var(--primary); }
        .nav-item.active { background: #eef2ff; color: var(--primary); border-left: 3px solid var(--primary); }
        .nav-item i { width: 24px; margin-right: 10px; font-size: 18px; text-align: center; }

        /* --- DROPDOWN MENU --- */
        .nav-group { overflow: hidden; } 
        .nav-parent { justify-content: space-between; user-select: none; }
        .nav-parent .arrow { font-size: 12px; transition: transform 0.3s; }
        .nav-sub { display: none; background: #fff; padding: 5px 0; }
        
        .sub-item { display: flex; align-items: center; padding: 10px 10px 10px 58px; font-size: 13px; color: #6b7280; text-decoration: none; transition: 0.2s; }
        .sub-item:hover { color: var(--primary); background: #f9fafb; }
        .sub-item.active { color: var(--primary); font-weight: 600; background: #f3f4f6; }
        .sub-item i { font-size: 12px; margin-right: 8px; width: 16px; }

        .nav-group.open .nav-sub { display: block; }
        .nav-group.open .nav-parent { color: var(--primary); background: #f9fafb; font-weight: 600; }
        .nav-group.open .arrow { transform: rotate(180deg); }

        /* --- MAIN CONTENT --- */
        .main { margin-left: 260px; flex: 1; padding: 30px; overflow-y: auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-add { background: var(--primary); color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; }
        
        .card { background: #fff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 16px; background: #f9fafb; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; }
        td { padding: 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .badge.admin { background: #e0e7ff; color: #4338ca; }
        .badge.user { background: #f3f4f6; color: #4b5563; }
        .action-btn { margin-right: 10px; color: #6b7280; }
        .action-btn:hover { color: var(--primary); }

        /* --- LOGOUT MODAL STYLES --- */
        .modal-overlay {
            display: none; /* Ẩn mặc định */
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); /* Nền đen mờ */
            z-index: 999;
            justify-content: center; align-items: center;
        }
        .modal-overlay.show { display: flex; animation: fadeIn 0.2s ease-out; }

        .modal-box {
            background: #fff; width: 400px; padding: 25px;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            text-align: left;
        }
        .modal-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 10px; }
        .modal-desc { font-size: 14px; color: #666; margin-bottom: 25px; line-height: 1.5; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
        
        .btn-modal { padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; }
        .btn-cancel { background: #e5e7eb; color: #374151; }
        .btn-confirm { background: var(--primary); color: white; text-decoration: none; display: inline-flex; align-items: center; }
        
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="brand"><i class="fa-brands fa-slack"></i> TESTCRAWL</div>
        <div class="menu">
            <a href="?module=admin&action=dashboard" class="nav-item">
                <i class="fa-solid fa-chart-pie"></i> Dashboard
            </a>
            
            <div style="padding: 15px 24px 5px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase;">QUẢN LÝ</div>

            <div class="nav-group <?php echo ($module == 'user') ? 'open' : ''; ?>">
                <div class="nav-item nav-parent" onclick="toggleMenu(this)">
                    <div style="display:flex; align-items:center;">
                        <i class="fa-solid fa-users"></i> Tài khoản
                    </div>
                    <i class="fa-solid fa-chevron-down arrow"></i>
                </div>
                <div class="nav-sub">
                    <a href="?module=user&action=list" class="sub-item <?php echo ($action == 'list') ? 'active' : ''; ?>">
                        <i class="fa-solid fa-list-ul"></i> Danh sách
                    </a>
                    <a href="?module=user&action=add" class="sub-item <?php echo ($action == 'add') ? 'active' : ''; ?>">
                        <i class="fa-solid fa-user-plus"></i> Thêm tài khoản
                    </a>
                </div>
            </div>

            <a href="?module=news&action=list" class="nav-item">
                <i class="fa-regular fa-newspaper"></i> Tin tức
            </a>
            
             <div style="margin-top: auto; border-top: 1px solid #e5e7eb;">
                 <a href="#" onclick="showLogoutModal(event)" class="nav-item" style="color: #ef4444;">
                    <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                 </a>
            </div>
        </div>
    </div>

    <div class="main">
        <div class="page-header">
            <div>
                <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">Danh sách tài khoản</h1>
                <div style="color: #6b7280; font-size: 14px;">Quản lý thành viên hệ thống</div>
            </div>
            <a href="?module=user&action=add" class="btn-add">
                <i class="fa-solid fa-plus"></i> Thêm mới
            </a>
        </div>

        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Quyền hạn</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result->num_rows > 0): ?>
                        <?php while($row = $result->fetch_assoc()): ?>
                            <tr>
                                <td>#<?php echo $row['id']; ?></td>
                                <td><div style="font-weight: 600;"><?php echo htmlspecialchars($row['fullname']); ?></div></td>
                                <td><?php echo htmlspecialchars($row['email']); ?></td>
                                <td>
                                    <?php if($row['role'] == 'admin'): ?>
                                        <span class="badge admin">Quản trị viên</span>
                                    <?php else: ?>
                                        <span class="badge user">Người dùng</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <a href="#" class="action-btn"><i class="fa-solid fa-pen"></i></a>
                                    <a href="#" class="action-btn" style="color: #ef4444;" onclick="return confirm('Xóa tài khoản này?');"><i class="fa-solid fa-trash"></i></a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="5" style="text-align: center; padding: 30px;">Chưa có dữ liệu</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal-overlay" id="logoutModal">
        <div class="modal-box">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 class="modal-title">Bạn muốn đăng xuất?</h3>
                <i class="fa-solid fa-xmark" style="cursor: pointer; color: #999;" onclick="closeLogoutModal()"></i>
            </div>
            
            <p class="modal-desc">
                Nhấn vào nút "Đăng xuất" bên dưới nếu bạn đã sẵn sàng kết thúc phiên làm việc.
            </p>
            
            <div class="modal-actions">
                <button class="btn-modal btn-cancel" onclick="closeLogoutModal()">Hủy bỏ</button>
                <a href="?module=admin&action=logoutqtv" class="btn-modal btn-confirm">Đăng xuất</a>
            </div>
        </div>
    </div>

    <script>
        // Bật tắt Menu Dropdown
        function toggleMenu(element) {
            element.parentElement.classList.toggle('open');
        }

        // Bật Modal Logout
        function showLogoutModal(e) {
            e.preventDefault();
            document.getElementById('logoutModal').classList.add('show');
        }

        // Tắt Modal Logout
        function closeLogoutModal() {
            document.getElementById('logoutModal').classList.remove('show');
        }

        // Click ra ngoài thì đóng modal
        window.onclick = function(event) {
            var modal = document.getElementById('logoutModal');
            if (event.target == modal) {
                modal.classList.remove('show');
            }
        }
    </script>
</body>
</html>
