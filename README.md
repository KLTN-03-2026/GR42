# Vertex - Nền Tảng Tin Tức & Tổng Hợp AI

Vertex là một hệ thống website tổng hợp tin tức tự động thông minh, tích hợp trí tuệ nhân tạo (AI) để tóm tắt bài báo, cùng với các tính năng cá nhân hóa người dùng, dự báo thời tiết và hệ thống tài khoản VIP.

Dự án được chia thành 2 phần chính:
- Frontend: Ứng dụng Single Page Application (SPA) xây dựng bằng React, TypeScript và TailwindCSS.
- Backend: RESTful API được xây dựng bằng PHP thuần (Vanilla PHP), xử lý logic, cào dữ liệu (crawler) và kết nối cơ sở dữ liệu MySQL.

---

## Các Tính Năng Chính
- **Hệ thống Tin Tức Tự Động**: Crawler lấy tin tức tự động từ các nguồn báo lớn (Vietnamnet,...).
- **Trợ Lý AI Tóm Tắt (Gemini)**: Tích hợp AI để tóm tắt bài viết nhanh và Chatbot trả lời câu hỏi dựa trên ngữ cảnh bài báo.
- **Xác Thực Người Dùng**: Đăng nhập bằng tài khoản nội bộ hoặc qua Google OAuth.
- **Phân Quyền (Role-based Access Control)**: Hệ thống tài khoản User bình thường và Admin với trang quản trị riêng.
- **Tài Khoản VIP**: Nâng cấp VIP thông qua thanh toán mã QR code tự động.
- **Tiện ích mở rộng**: Widget dự báo thời tiết thời gian thực (OpenWeatherMap).
- **Giao Diện Hiện Đại**: Tối ưu UI/UX với TailwindCSS, Framer Motion và hỗ trợ Responsive cho mọi thiết bị.

---

## Hướng Dẫn Cài Đặt & Chạy Dự Án (Local Development)

Dự án được thiết kế để chạy trên môi trường **Laragon** (hoặc XAMPP) đối với Backend và **React.js** đối với Frontend.

### Yêu Cầu Hệ Thống
- **Laragon** / XAMPP (chứa PHP >= 8.0, MySQL)
- **React.js** (>= 16.x) & npm
- **Composer** (nếu có sử dụng thư viện ngoài cho PHP)

### 1. Cài đặt Backend (PHP & MySQL)
1. Đảm bảo thư mục dự án `GR42` đang nằm trong thư mục gốc của web server (vd: `d:\laragon\www\GR42`).
2. Khởi động **Apache/Nginx** và **MySQL** trên Laragon.
3. Import cơ sở dữ liệu:
   - Truy cập phpMyAdmin hoặc HeidiSQL.
   - Tạo database mới (vd: `gr42_news`).
   - Import file `BE/crawl_news.sql` của dự án vào database này.
   - *Hoặc*: Chạy file `http://localhost/GR42/BE/init_db.php` để tự động tạo database và các bảng.
4. Cấu hình Môi trường & Database:
   - Sao chép file `.env.example` thành `.env` trong thư mục gốc dự án.
   - Cập nhật thông tin kết nối Database (`DB_NAME`, `DB_USER`, `DB_PASS`) trong file `.env`.
   - Cập nhật các API Key (Gemini, Google, OpenWeatherMap, Sepay) trong file `.env`.
   - Hệ thống sẽ tự động đọc cấu hình này thông qua `BE/config.php`.
5. Kiểm tra API Backend:
   - Mở trình duyệt và truy cập: `http://localhost/GR42/BE/` (Đảm bảo không báo lỗi 500).

### 2. Cài đặt Frontend (React)
1. Mở Terminal (Command Prompt / PowerShell) và di chuyển vào thư mục `react`:
   ```bash
   cd d:\laragon\www\GR42\react
   ```
2. Cài đặt các thư viện (Node Modules):
   ```bash
   npm install
   ```
3. Cấu hình biến môi trường Frontend:
   - Kiểm tra file `src/config.ts` hoặc `.env` trong thư mục `react`.
   - Đảm bảo `API_BASE_URL` đang trỏ đúng về backend (vd: `http://localhost/GR42/BE`).
4. Khởi động Server Frontend:
   ```bash
   npm start
   ```
5. Trình duyệt sẽ tự động mở trang web tại địa chỉ: `http://localhost:3000`.

---

## Hướng Dẫn Sử Dụng (Dành Cho Quản Trị Viên)

### Đăng nhập Admin
1. Truy cập vào trang chủ, nhấn nút **Đăng nhập**.
2. Đăng nhập bằng tài khoản đã được cấp quyền `admin` trong database.
3. Nếu thành công, trên thanh Header sẽ xuất hiện nút **"Quản lý"** (màu vàng). Nhấn vào đó để vào trang Dashboard Quản Trị.

### Chức năng Admin
- **Quản lý người dùng**: Xem danh sách User, khóa/mở khóa tài khoản, phân quyền.
- **Quản lý tin tức**: Xem các tin tức crawler đã lấy về, chỉnh sửa hoặc xóa bài viết vi phạm.
- **Quản lý bình luận**: Kiểm duyệt bình luận của người dùng trên các bài báo.

### Đối với Người Dùng Thường (User)
- Cập nhật hồ sơ (Avatar, tên, số điện thoại) tại trang **Cá nhân**.
- Nhấn vào biểu tượng vương miện hoặc "Nâng cấp VIP" để quét mã QR thanh toán. Sau khi thanh toán thành công, hệ thống tự động xác nhận và cấp thẻ VIP.

---

## Cấu Trúc Thư Mục
```text
GR42/
├── BE/                 # Chứa toàn bộ Backend (PHP)
│   ├── config.php      # File đọc cấu hình từ .env & định nghĩa hằng số
│   ├── init_db.php     # Script khởi tạo Database tự động
│   ├── includes/       # Thư viện core (database, session, functions)
│   ├── modules/        # Các module xử lý API (api/user.php, news.php,...)
│   └── index.php       # Entry point để điều hướng các requests (Router)
│
├── .env                # File chứa API Keys và cấu hình bảo mật (không commit)
├── .env.example        # File mẫu cấu hình môi trường
│
├── react/              # Chứa toàn bộ Frontend (React)
│   ├── public/         # Chứa hình ảnh, logo (logo_vertex.png)
│   ├── src/
│   │   ├── components/ # Các component tái sử dụng (Header, VAvatar, AdminRoute...)
│   │   ├── pages/      # Các trang chính (Trang chủ, Đăng nhập, Profile, Admin...)
│   │   ├── config.ts   # Cấu hình API đường dẫn chung
│   │   └── App.tsx     # Định tuyến (React Router)
│   └── package.json    # Thông tin các thư viện React
│
└── README.md           # Hướng dẫn dự án
```
