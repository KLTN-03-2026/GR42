## Vertex

*Nền Tảng Tin Tức & Tổng Hợp Trí Tuệ Nhân Tạo Hiện Đại*

[**Khám phá tài liệu »**](#-giới-thiệu)

[Xem Tính Năng](#-tính-năng-nổi-bật)
[Cài Đặt](#-hướng-dẫn-cài-đặt)
[Liên Hệ](#-đội-ngũ-phát-triển)

[![React](https://img.shields.io/badge/Frontend-React%2018-000000?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PHP](https://img.shields.io/badge/Backend-PHP%208.x-000000?style=for-the-badge&logo=php&logoColor=777BB4)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-000000?style=for-the-badge&logo=mysql&logoColor=4479A1)](https://www.mysql.com/)
[![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-000000?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/AI_Engine-Gemini_2.5-000000?style=for-the-badge&logo=googlegemini&logoColor=8E75B2)](https://deepmind.google/technologies/gemini/)

---

## Mục lục

1. [Giới Thiệu](#-giới-thiệu)
2. [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
3. [Công Nghệ Sử Dụng](#️-công-nghệ-sử-dụng)
4. [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
5. [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
6. [Đội Ngũ Phát Triển](#-đội-ngũ-phát-triển)

## Giới Thiệu

**Vertex** là một giải pháp toàn diện và đột phá trong việc cập nhật tin tức trong kỷ nguyên số. Hệ thống tự động thu thập tin tức từ các nguồn báo chí uy tín (như VietnamNet, VnExpress...), kết hợp sức mạnh của mô hình ngôn ngữ lớn tiên tiến nhất hiện nay (**Google Gemini 2.5 Flash**) để tóm tắt nội dung cực kỳ nhanh chóng.

Mục tiêu của Vertex là giúp người dùng tiết kiệm tối đa thời gian đọc hiểu mà vẫn nắm bắt được trọn vẹn những thông tin cốt lõi, chuyên sâu nhất từ mọi bài báo. Ngoài ra, trợ lý AI Chatbot tích hợp sẵn sẽ giải đáp mọi thắc mắc xoay quanh nội dung tin tức, mang đến trải nghiệm tương tác chưa từng có.

## Tính Năng Nổi Bật

### Trí Tuệ Nhân Tạo (AI)
- **Tóm Tắt Thông Minh:** Tự động trích xuất các ý chính của bài báo thành danh sách gạch đầu dòng ngắn gọn, súc tích và đầy đủ ngữ cảnh.
- **AI Chatbot (RAG System):** Trợ lý ảo hiểu rõ ngữ cảnh của từng bài báo, sẵn sàng trả lời chuyên sâu mọi câu hỏi của người dùng.

### Trải Nghiệm Tin Tức
- **Hệ Thống Crawler Tự Động:** Quét và cập nhật tin tức theo thời gian thực (Real-time crawler), đảm bảo thông tin luôn mới nhất.
- **Cá Nhân Hóa Người Dùng:** Lưu trữ tin tức yêu thích, lịch sử duyệt tin và tự động đề xuất dựa trên sở thích cá nhân.
- **Tiện Ích Thời Tiết (OpenWeatherMap API):** Tích hợp widget thời tiết trực quan, tự động định vị và cập nhật theo khu vực của người dùng.

### Hệ Thống & Bảo Mật
- **Xác Thực Đa Phương Thức:** Hỗ trợ đăng nhập truyền thống bảo mật cao và tích hợp Đăng nhập bằng Google (OAuth 2.0).
- **Phân Quyền Quản Trị Hệ Thống:** Bảng điều khiển Admin chuyên nghiệp để quản lý người dùng, bài viết, bình luận, và hệ thống báo cáo (Report).
- **Thanh Toán Tự Động (Tài Khoản VIP):** Nâng cấp tài khoản VIP hoàn toàn tự động thông qua mã QR tích hợp với cổng thanh toán SePay. Không cần can thiệp thủ công.

---

## Công Nghệ Sử Dụng

Vertex được xây dựng trên một kiến trúc hiện đại, linh hoạt, phân tách rõ ràng giữa Frontend và Backend.

| Lớp (Layer) | Công nghệ / Framework | Chi tiết tính năng |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript | Giao diện người dùng SPA (Single Page Application) mượt mà. |
| **Styling & UI** | TailwindCSS, Framer Motion | Thiết kế Responsive, Modern UI/Glassmorphism, Hiệu ứng animation siêu mượt. |
| **Backend** | Vanilla PHP (PHP 8.x) | Kiến trúc Smart Routing, RESTful API, cURL xử lý HTTP Request tốc độ cao. |
| **Database** | MySQL | Quản lý quan hệ dữ liệu hiệu quả, cấu trúc chuẩn hóa cho Crawler & Auth. |
| **AI Integration** | Gemini 2.5 Flash API | AI Engine chính xử lý phân tích ngôn ngữ tự nhiên và tóm tắt. |
| **Third-Party** | SePay, OpenWeatherMap, Google OAuth2.0 | Tích hợp cổng thanh toán, thời tiết và xác thực tài khoản. |

---

## Cấu Trúc Dự Án

Dự án áp dụng mô hình phân tách thư mục tối ưu, dễ dàng bảo trì và mở rộng trong tương lai.

```text
GR42/
├── BE/                      # ⚙️ Backend Logic & API (PHP)
│   ├── database/            # Scripts khởi tạo cấu trúc Database (.sql)
│   ├── includes/            # Core libraries, Helper functions & DB Connector
│   ├── modules/             # Business Logic Layer
│   │   ├── api/             # RESTful API Endpoints
│   │   │   ├── auth/        # Xử lý Đăng ký, Đăng nhập, Google OAuth
│   │   │   ├── news/        # Hệ thống tải tin, AI Summarize, Quản lý Comment
│   │   │   ├── user/        # Quản lý Profile, Bookmark, Lịch sử xem tin
│   │   │   ├── payment/     # Webhook xử lý thanh toán VIP tự động (SePay)
│   │   │   └── tools/       # Widget Thời tiết, Service Crawler báo chí
│   │   └── ssr/             # Legacy PHP UI Modules (nếu còn sử dụng)
│   └── index.php            # Master Router điều hướng toàn bộ API request
│
├── react/                   # Frontend Application (React SPA)
│   ├── public/              # Static assets (Logos, Icons)
│   ├── src/
│   │   ├── components/      # Reusable UI Components (Button, Modal, Header...)
│   │   ├── modules/         # Các Feature Modules chuyên biệt
│   │   └── constants/       # Global constants, Configs & Environment variables
│   └── package.json         # Khai báo và quản lý NPM dependencies
│
└── .env                     # Tập tin cấu hình môi trường (API Keys, DB Credentials)
```

---

## Hướng Dẫn Cài Đặt

Làm theo các bước sau để chạy dự án trong môi trường phát triển (Local).

### Yêu Cầu Hệ Thống
- **Môi trường Web Server:** [Laragon](https://laragon.org/) hoặc XAMPP (khuyến khích dùng Laragon).
- **Backend:** PHP >= 8.1 và MySQL >= 8.0.
- **Frontend (Môi trường phát triển):** [Node.js](https://nodejs.org/) >= 18.x và `npm` 

### Bước 1: Cấu hình Backend
1. Clone dự án và đặt thư mục `GR42` vào thư mục `www` của Laragon (VD: `C:\laragon\www\GR42`).
2. Khởi động dịch vụ **Apache** và **MySQL** trên Laragon.
3. Tạo một database mới tên là `crawl_news` (Collation: `utf8mb4_general_ci`).
4. Import file SQL cấu trúc mẫu vào DB: `BE/database/crawl_news.sql`.
5. Tạo tệp `.env` ở thư mục gốc (hoặc copy từ `.env.example`) và cấu hình lại thông số:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=crawl_news
   
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   WEATHER_API_KEY=your_openweathermap_api_key
   
   #JSON URL GGSHEET (ex)
   JSON_URL_SHEET="YOUR_JSON_GG_SHEET_HERE"

   #SEPAY (ex)
   SEPAY_TOKEN="SEPAY_TOKEN_HERE"

   #MAILER
   MAIL_HOST="smtp.gmail.com"
   MAIL_USERNAME="GMAIL_USER_HERE"
   MAIL_PASSWORD="GMAIL_PASSWORD_HERE"
   MAIL_PORT=465
   MAIL_FROM_NAME="Vertex"
   ```

### Bước 2: Cấu hình Frontend
1. Mở Terminal / Command Prompt và di chuyển vào thư mục Frontend:
   ```bash
   cd react
   ```
2. Cài đặt toàn bộ các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy máy chủ phát triển React:
   ```bash
   npm start
   ```
4. Giao diện sẽ tự động mở trên trình duyệt tại `http://localhost:3000`. Cấu hình API Backend sẽ tự động trỏ vào `http://localhost/GR42/BE/api/...`.

---

## Đội Ngũ Phát Triển

Dự án Vertex được nghiên cứu, phát triển và tối ưu hóa của nhóm **GR42**. 

Mục tiêu cốt lõi của chúng tôi là kiến tạo nên một trải nghiệm tiêu thụ nội dung số hiện đại, trực quan, loại bỏ các thông tin dư thừa và mang quyền lực tóm tắt tri thức vào tay người dùng thông qua sức mạnh của Trí Tuệ Nhân Tạo.

> *"Đọc ít hơn, hiểu nhiều hơn."*

---

Được làm với sự tâm huyết của các thành viên trong nhóm **GR42**
