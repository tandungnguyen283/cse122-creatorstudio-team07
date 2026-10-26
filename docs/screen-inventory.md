# Screen Inventory – CreatorStudio

Nguồn: Figma "BTL – CreatorStudio – Quản lý dự án sáng tạo và phản hồi phiên bản" . Gồm 2 trang: Page 1 (node `0:1`: Giao diện chung, Khách hàng, Nhà thiết kế) và Page 2 (node `40:26`: Creative Lead, Quản trị viên).

Ứng dụng: nền tảng quản lý brief, phiên bản thiết kế và phản hồi giữa khách hàng và nhà thiết kế. Bốn vai trò: Khách hàng, Nhà thiết kế, Creative Lead, Quản trị viên (file Figma có màn hình của cả 4 vai trò).

Bố cục chung của các màn hình sau đăng nhập: header (logo CreatorStudio, nút Menu, badge vai trò, tên người dùng, nút Đăng xuất) và sidebar điều hướng theo vai trò.

Xem trang theo Node ID bằng ấn vào ảnh trong file Figma, nhìn vào đường link, Node ID là số phía sau "node-id="

## Tổng quan

| # | Nhóm | Màn hình / trạng thái | Node ID |
|---|------|------------------------|---------|
| 1 | Chung | Giao diện chung (landing) | `40:2` |
| 2 | Khách hàng | Đăng nhập | `40:4` |
| 3 | Khách hàng | Tổng quan dự án | `40:6` |
| 4 | Khách hàng | Tổng quan dự án – modal Tạo dự án | `40:8` |
| 5 | Khách hàng | Creative Brief – mặc định | `40:11` |
| 6 | Khách hàng | Creative Brief – kết quả AI cấu trúc hoá | `40:14` |
| 7 | Khách hàng | Creative Brief – sau khi gửi Brief | `40:16` |
| 8 | Khách hàng | Duyệt phiên bản – mặc định | `40:18` |
| 9 | Khách hàng | Duyệt phiên bản – modal xác nhận duyệt | `40:20` |
| 10 | Khách hàng | Duyệt phiên bản – duyệt thành công | `40:22` |
| 11 | Khách hàng | Duyệt phiên bản – sửa góp ý | `40:24` |
| 12 | Nhà thiết kế | Đăng nhập | `40:30` |
| 13 | Nhà thiết kế | Bảng điều khiển | `40:32` |
| 14 | Nhà thiết kế | Moodboard | `40:35` |
| 15 | Nhà thiết kế | Moodboard – gợi ý từ khoá AI | `40:37` |
| 16 | Nhà thiết kế | Quản lý phiên bản | `40:39` |
| 17 | Nhà thiết kế | Quản lý phiên bản – phiên bản mới | `40:41` |
| 18 | Creative Lead | Đăng nhập | `40:43` |
| 19 | Creative Lead | Bảng công việc | `40:45` |
| 20 | Creative Lead | Bảng công việc – modal Giao việc | `40:48` |
| 21 | Creative Lead | Hàng chờ review | `40:50` |
| 22 | Creative Lead | Hàng chờ review – sau khi giao cho khách | `40:52` |
| 23 | Creative Lead | Tổng hợp feedback | `40:54` |
| 24 | Creative Lead | Tổng hợp feedback – tổng hợp action items | `40:56` |
| 25 | Creative Lead | Tổng hợp feedback – sau khi chấp nhận | `40:58` |
| 26 | Quản trị viên | Đăng nhập | `40:60` |
| 27 | Quản trị viên | Template brief | `40:62` |
| 28 | Quản trị viên | Template brief – modal Template mới | `40:64` |
| 29 | Quản trị viên | Người dùng | `40:66` |
| 30 | Quản trị viên | Người dùng – modal Thêm người dùng | `40:68` |
| 31 | Quản trị viên | Cài đặt dự án | `40:70` |
| 32 | Quản trị viên | Cài đặt dự án – modal Dự án mới | `40:72` |

## Chi tiết

### Chung

#### 1. Giao diện chung (landing) – `40:2`
- Mục đích: giới thiệu sản phẩm và dẫn vào đăng nhập.
- Thành phần: logo CreatorStudio, tiêu đề "Một nơi duy nhất cho brief, phiên bản và phản hồi", mô tả ngắn, nút **Đăng nhập**, 4 thẻ vai trò (Khách hàng, Nhà thiết kế, Creative Lead, Quản trị viên) kèm mô tả.
- Điều hướng: Đăng nhập → màn hình Đăng nhập.

### Khách hàng

#### 2. Đăng nhập – `40:4`
- Thành phần: trường Email, Mật khẩu, nút **Đăng nhập**; khối "Tài khoản demo" (mật khẩu chung 123456) với các nút điền nhanh theo vai trò (Khách hàng, Nhà thiết kế, Creative Lead, Quản trị viên) và nút "Đặt lại dữ liệu mẫu".
- Ví dụ dữ liệu: client@demo.vn.
- Điều hướng: đăng nhập thành công → Tổng quan dự án.

#### 3. Tổng quan dự án – `40:6`
- Sidebar: Tổng quan dự án (đang chọn), Creative Brief, Duyệt phiên bản.
- Thành phần: 4 thẻ thống kê (Tổng dự án, Đang chạy, Phiên bản chờ bạn duyệt, Đã lưu trữ); ô tìm theo tên dự án; bộ lọc trạng thái; danh sách thẻ dự án (tên, trạng thái Đang chạy/Tạm dừng, mô tả, hạn chót, trạng thái brief, phiên bản mới nhất, góp ý đang mở, thanh tiến độ); nút mỗi thẻ: Duyệt, Sửa, Lưu trữ, Xóa; nút **+ Tạo dự án**.
- Điều hướng: + Tạo dự án → modal (màn hình 4); Duyệt → Duyệt phiên bản.

#### 4. Modal Tạo dự án – `40:8`
- Thành phần: Tên dự án*, Mô tả*, Hạn chót* (chọn ngày); nút Hủy, Lưu.

#### 5. Creative Brief – mặc định – `40:11`
- Thành phần: chọn dự án; khối "Brief Structurer (AI)" với ô mô tả tự do, nút **Cấu trúc hóa bằng AI** và **Điền ví dụ**; form "Nội dung brief" (Tiêu đề*, Mục tiêu*, Đối tượng*, Sản phẩm bàn giao*, Phong cách, Ngân sách (VNĐ), Hạn chót*); nút Lưu nháp, Gửi brief, Làm mới; danh sách "Brief của dự án" (tiêu đề, trạng thái Đã duyệt, hạn, nút Lưu trữ).

#### 6. Creative Brief – kết quả AI – `40:14`
- Trạng thái sau khi bấm "Cấu trúc hóa bằng AI".
- Thành phần: cảnh báo "AI chưa chắc chắn về kết quả này"; bảng kết quả (Mục tiêu, Đối tượng, Sản phẩm, Phong cách, Ngân sách, Hạn chót, các trường thiếu gắn nhãn "Thiếu"); khối "Vì sao có kết quả này?" giải thích; thanh độ tin cậy (ví dụ 33%, "AI chưa chắc chắn"); nút Chấp nhận, Sửa, Tạo lại, Từ chối.

#### 7. Creative Brief – sau khi gửi Brief – `40:16`
- Danh sách "Brief của dự án" có thêm brief mới với trạng thái **Đã gửi**.

#### 8. Duyệt phiên bản – mặc định – `40:18`
- Thành phần: chọn dự án; danh sách phiên bản (v3 Mới nhất – Đang chờ duyệt, v2 – Bị từ chối, v1 – Cần chỉnh sửa; kèm ngày); chi tiết phiên bản (ảnh/preview, ghi chú, người thiết kế, ngày, số lượt chỉnh sửa đã dùng 2/3); nút **Duyệt**, **Yêu cầu chỉnh sửa**, **Từ chối**; khối "Góp ý" (danh sách góp ý với trạng thái Đang mở, nút Sửa/Xóa); ô "Thêm góp ý" và nút **Gửi góp ý**.

#### 9. Modal xác nhận duyệt – `40:20`
- "Duyệt v3": thông báo sau khi duyệt, phiên bản được xem là bản chốt. Nút Hủy, Xác nhận.

#### 10. Duyệt thành công – `40:22`
- Phiên bản có trạng thái **Đã duyệt**; hiển thị "Phiên bản này đã có quyết định"; các nút Duyệt/Yêu cầu chỉnh sửa/Từ chối bị vô hiệu hoá.

#### 11. Sửa góp ý – `40:24`
- Một góp ý chuyển sang chế độ chỉnh sửa trực tiếp (ô nhập, nút Lưu, Hủy).

### Nhà thiết kế

#### 12. Đăng nhập – `40:30`
- Giống đăng nhập khách hàng, thêm banner "Bạn đang đăng nhập với tên … Vào trang làm việc" khi đã có phiên; ví dụ designer@demo.vn.

#### 13. Bảng điều khiển – `40:32`
- Sidebar: Bảng điều khiển (đang chọn), Moodboard, Quản lý phiên bản.
- Thành phần: 4 thẻ thống kê (Dự án đang làm, Việc chưa xong, Phiên bản chờ khách duyệt, Cần xử lý gấp); "Việc của tôi" (lọc, mỗi việc có trạng thái Đang làm/Cần làm, hạn, nút Gửi review/Bắt đầu); "Góp ý đang mở" (góp ý khách hàng và góp ý nội bộ); nút "Đi tới quản lý phiên bản".

#### 14. Moodboard – `40:35`
- Thành phần: chọn dự án; nút **+ Moodboard mới**; tab moodboard; thẻ moodboard (trạng thái Đã đăng, từ khoá phong cách thêm/xoá được, bảng màu + Thêm màu, nút Chuyển về nháp, Xóa moodboard); "Ô tham chiếu" (+ Thêm ô, xóa từng ô); khối "Mood Keyword Assistant (AI)" với ô mô tả chủ đề và nút **Gợi ý từ khóa**.

#### 15. Moodboard – gợi ý từ khoá AI – `40:37`
- Danh sách từ khoá gợi ý để chọn; khối "Vì sao có kết quả này?"; độ tin cậy (ví dụ 62%); nút Chấp nhận đã chọn, Tạo lại, Từ chối.

#### 16. Quản lý phiên bản – `40:39`
- Màn hình "Quản lý phiên bản" trong sidebar của Nhà thiết kế.

#### 17. Quản lý phiên bản – phiên bản mới – `40:41`
- Trạng thái "Phiên bản mới" của màn hình Quản lý phiên bản.

### Creative Lead (Page 2)

| # | Màn hình | Node ID | Mô tả |
|---|----------|---------|-------|
| 18 | Đăng nhập | `40:43` | Form email/mật khẩu và tài khoản demo, giống các vai trò khác. |
| 19 | Bảng công việc | `40:45` | Bảng công việc dạng cột (kanban) của các việc trong dự án. |
| 20 | Modal Giao việc | `40:48` | Hộp thoại giao việc từ Bảng công việc cho nhà thiết kế. |
| 21 | Hàng chờ review | `40:50` | Danh sách phiên bản nhà thiết kế gửi lên, chờ Creative Lead duyệt nội bộ, có xem trước phiên bản. |
| 22 | Sau khi giao cho khách | `40:52` | Trạng thái sau khi phiên bản được chuyển cho khách hàng. |
| 23 | Tổng hợp feedback | `40:54` | Màn hình gom góp ý của khách hàng và nội bộ. |
| 24 | Tổng hợp action items | `40:56` | Trạng thái tổng hợp feedback thành các action item. |
| 25 | Sau khi chấp nhận | `40:58` | Trạng thái sau khi chấp nhận kết quả tổng hợp. |

### Quản trị viên (Page 2)

| # | Màn hình | Node ID | Mô tả |
|---|----------|---------|-------|
| 26 | Đăng nhập | `40:60` | Form đăng nhập quản trị viên. |
| 27 | Template brief | `40:62` | Danh sách template brief. |
| 28 | Modal Template mới | `40:64` | Hộp thoại tạo template brief mới. |
| 29 | Người dùng | `40:66` | Bảng quản lý người dùng. |
| 30 | Modal Thêm người dùng | `40:68` | Hộp thoại thêm người dùng mới. |
| 31 | Cài đặt dự án | `40:70` | Màn hình cài đặt dự án. |
| 32 | Modal Dự án mới | `40:72` | Hộp thoại tạo dự án mới. |
