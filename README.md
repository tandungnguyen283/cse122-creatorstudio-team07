# CreatorStudio – Quản lý dự án sáng tạo và phản hồi phiên bản

## 1. Thông tin đề tài

- **Tên đề tài:** CreatorStudio – Quản lý dự án sáng tạo và phản hồi phiên bản
- **Học phần:** Phát triển ứng dụng Web cơ bản – CSE122
- **Loại sản phẩm:** Website Frontend mô phỏng quy trình quản lý dự án sáng tạo dành cho khách hàng, nhà thiết kế, Creative Lead và quản trị viên.

## 2. Các trang đã thực hiện

### Trang chung
- `index.html` – Trang giới thiệu và điều hướng vào hệ thống.
- `login.html` – Trang đăng nhập mô phỏng.
- `403.html` – Trang thông báo không có quyền truy cập.
- `404.html` – Trang thông báo không tìm thấy trang.

### Vai trò Khách hàng
- `client-project-overview.html` – Xem tổng quan dự án.
- `client-creative-brief.html` – Tạo và quản lý Creative Brief.
- `client-review-versions.html` – Xem, nhận xét và duyệt phiên bản thiết kế.

### Vai trò Nhà thiết kế
- `designer-dashboard.html` – Theo dõi công việc và dự án.
- `designer-moodboard.html` – Xây dựng bảng cảm hứng thiết kế (Moodboard).
- `designer-version-management.html` – Quản lý các phiên bản thiết kế.

### Vai trò Creative Lead
- `lead-task-board.html` – Theo dõi và quản lý bảng công việc.
- `lead-internal-review.html` – Duyệt thiết kế nội bộ.
- `lead-feedback-summary.html` – Tổng hợp phản hồi.

### Vai trò Quản trị viên
- `admin-brief-template-management.html` – Quản lý mẫu Creative Brief.
- `admin-user-management.html` – Quản lý người dùng.
- `admin-project-settings.html` – Cấu hình dự án.

## 3. Mục đích của website

CreatorStudio được xây dựng nhằm tập trung brief, phiên bản thiết kế, công việc và phản hồi vào một hệ thống thống nhất. Website mô phỏng quy trình phối hợp giữa khách hàng, nhà thiết kế, trưởng nhóm sáng tạo và quản trị viên, giúp hạn chế tình trạng phản hồi phân tán, nhầm lẫn phiên bản và khó theo dõi trạng thái phê duyệt.

## 4. Các chức năng chính

- **Phân chia theo vai trò:** Điều hướng và hiển thị các trang theo Khách hàng, Nhà thiết kế, Creative Lead và Quản trị viên.
- **Quản lý dự án:** Xem thông tin, trạng thái, thời hạn và cài đặt dự án.
- **Creative Brief:** Nhập thông tin yêu cầu sáng tạo và hỗ trợ sắp xếp nội dung brief.
- **Moodboard:** Quản lý bảng cảm hứng phục vụ định hướng thiết kế.
- **Quản lý phiên bản:** Theo dõi các phiên bản thiết kế và trạng thái của chúng.
- **Duyệt và phản hồi:** Mô phỏng nhận xét, duyệt phiên bản và quy trình duyệt nội bộ.
- **Quản lý công việc:** Theo dõi nhiệm vụ và trạng thái thực hiện.
- **Tổng hợp feedback:** Hỗ trợ tổng hợp phản hồi để nhóm sáng tạo dễ theo dõi.
- **Quản trị hệ thống:** Quản lý người dùng, mẫu brief và thiết lập dự án.
- **Tương tác giao diện:** Các thành phần giao diện dùng chung, thông báo, hộp thoại và kiểm tra dữ liệu đầu vào ở những chức năng được triển khai.
- **Tính năng AI mô phỏng:**  
  1. **Brief Structurer** – hỗ trợ chuyển mô tả tự do thành brief có cấu trúc.  
  2. **Feedback Summarizer** – hỗ trợ tổng hợp phản hồi.  
  3. **Mood Keyword Assistant** – hỗ trợ gợi ý từ khóa moodboard.  
  Các tính năng AI trong bản này được mô phỏng ở phía trình duyệt, không phải dịch vụ AI trực tuyến thực tế.


## 5. Công nghệ sử dụng

- **HTML5:** Xây dựng cấu trúc các trang web.
- **CSS3:** Thiết kế giao diện, bố cục và khả năng thích ứng với kích thước màn hình.
- **JavaScript:** Xử lý sự kiện, cập nhật DOM, điều hướng theo vai trò, kiểm tra dữ liệu và các tương tác.
- **LocalStorage:** Lưu dữ liệu mô phỏng trên trình duyệt để duy trì dữ liệu giữa các lần tải trang.
- **Mock API / Promise:** Mô phỏng độ trễ và trạng thái thành công hoặc lỗi khi tải dữ liệu.
- **Dữ liệu mẫu JavaScript:** Khởi tạo dữ liệu người dùng, dự án, brief, phiên bản, bình luận và công việc.

## 6. Cấu trúc thư mục

```text
creatorstudio/
├── index.html
├── login.html
├── 403.html
├── 404.html
├── client-creative-brief.html
├── client-project-overview.html
├── client-review-versions.html
├── designer-dashboard.html
├── designer-moodboard.html
├── designer-version-management.html
├── lead-task-board.html
├── lead-internal-review.html
├── lead-feedback-summary.html
├── admin-brief-template-management.html
├── admin-user-management.html
├── admin-project-settings.html
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── data.js
        ├── store.js
        ├── ui.js
        ├── ai.js
        └── pages/
            └── (JavaScript riêng cho từng trang)
```

## 7. Cách chạy dự án

1. Giải nén `Creatorstudio-CSE122.zip`.
2. Mở thư mục `creatorstudio`.
3. Mở `index.html` bằng trình duyệt hoặc dùng tiện ích **Live Server** trong Visual Studio Code để chạy website.
4. Dùng tài khoản demo trên trang đăng nhập để thử các vai trò nếu trang đăng nhập hiển thị thông tin tài khoản mẫu.
5. Dữ liệu được lưu trong LocalStorage của trình duyệt. Có thể xóa dữ liệu website trong phần cài đặt trình duyệt để làm mới dữ liệu lưu cục bộ.
