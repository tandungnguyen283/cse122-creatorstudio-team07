# PROJECT PROPOSAL -- CreatorStudio

## 1. Thông tin chung

-   **Tên đề tài:** BTL-30 -- CreatorStudio -- Quản lý dự án sáng tạo và
    phản hồi phiên bản
-   **Học phần:** Phát triển ứng dụng Web cơ bản -- CSE122
-   **Lĩnh vực:** Arts & CreativeTech
-   **Loại sản phẩm:** Prototype website quản lý dự án sáng tạo
-   **Đối tượng sử dụng:** Khách hàng, nhà thiết kế, trưởng nhóm và quản
    trị viên
-   **Quy mô nhóm:** 3 thành viên

## 2. Bối cảnh và vấn đề

Trong các dự án sáng tạo như thiết kế hình ảnh, bộ nhận diện thương hiệu
hoặc nội dung truyền thông, yêu cầu và phản hồi thường được trao đổi qua
nhiều kênh khác nhau như tin nhắn, email và tệp đính kèm. Điều này có
thể dẫn đến các vấn đề:

1.  **Brief thiếu cấu trúc:** Yêu cầu, mục tiêu, sản phẩm bàn giao và
    thời hạn chưa được ghi nhận thống nhất.
2.  **Phản hồi phân tán:** Ý kiến của khách hàng và thành viên nhóm nằm
    ở nhiều nơi, gây khó khăn khi tổng hợp.
3.  **Nhầm lẫn phiên bản:** Người dùng có thể không xác định được đâu là
    bản mới nhất hoặc bản nào đang chờ duyệt.
4.  **Khó theo dõi tiến độ:** Việc phân công, cập nhật trạng thái và
    kiểm tra thời hạn chưa tập trung.
5.  **Khó xác nhận phê duyệt:** Trạng thái duyệt hoặc yêu cầu chỉnh sửa
    chưa được thể hiện rõ ràng.

## 3. Mục tiêu dự án

CreatorStudio hướng đến việc xây dựng một giao diện web tập trung để
quản lý quy trình sáng tạo từ lúc tiếp nhận brief đến khi giao sản phẩm
và duyệt phiên bản. Dự án đặt mục tiêu:

-   Tập trung thông tin dự án, brief, phiên bản, bình luận và nhiệm vụ.
-   Phân tách chức năng theo vai trò người dùng.
-   Giúp người dùng xác định trạng thái và phiên bản mới nhất.
-   Hỗ trợ phân công nhiệm vụ, theo dõi tiến độ và thời hạn.
-   Minh họa cách AI có thể hỗ trợ xử lý brief, tổng hợp phản hồi và gợi
    ý từ khóa sáng tạo.
-   Xây dựng giao diện responsive, dễ sử dụng trên máy tính và thiết bị
    di động.

## 4. Đối tượng và vai trò người dùng

### 4.1. Khách hàng (Client)

-   Tạo và gửi Creative Brief.
-   Theo dõi tổng quan dự án và tiến độ.
-   Xem các phiên bản thiết kế.
-   Gửi phản hồi, bình luận và duyệt hoặc yêu cầu chỉnh sửa phiên bản.

### 4.2. Nhà thiết kế (Designer)

-   Xem các dự án được phân công.
-   Tham khảo brief và yêu cầu sáng tạo.
-   Quản lý phiên bản thiết kế.
-   Cập nhật trạng thái công việc và tiếp nhận phản hồi.

### 4.3. Trưởng nhóm (Lead)

-   Theo dõi bảng công việc theo trạng thái.
-   Giao nhiệm vụ và chọn người phụ trách.
-   Theo dõi hạn hoàn thành và mức độ ưu tiên.
-   Xem brief đang chờ duyệt và duyệt hoặc trả lại brief.

### 4.4. Quản trị viên (Admin)

-   Quản lý người dùng và vai trò.
-   Quản lý mẫu brief.
-   Cấu hình các thông tin và thiết lập dự án.

## 5. Phạm vi chức năng

Các chức năng dự kiến của prototype bao gồm:

  -----------------------------------------------------------------------
  Nhóm chức năng                      Nội dung chính
  ----------------------------------- -----------------------------------
  Tài khoản và hồ sơ                  Đăng nhập, đăng ký, khôi phục mật
                                      khẩu, hồ sơ và cài đặt

  Quản lý dự án                       Xem tổng quan, tạo/sửa dự án, lọc
                                      trạng thái, lưu trữ và khôi phục

  Creative Brief                      Nhập yêu cầu, mục tiêu, sản phẩm
                                      bàn giao, thời hạn và gửi duyệt

  Quản lý phiên bản                   Xem phiên bản, xác định bản mới
                                      nhất, theo dõi trạng thái duyệt

  Phản hồi                            Gửi và theo dõi bình luận, phân
                                      biệt phản hồi khách hàng và ghi chú
                                      nội bộ

  Quản lý nhiệm vụ                    Giao việc, chọn người nhận, đặt
                                      hạn, mức ưu tiên và trạng thái

  Bảng tiến độ                        Hiển thị công việc theo các cột Cần
                                      làm, Đang làm, Chờ review và Hoàn
                                      thành

  Quản trị                            Quản lý người dùng, mẫu brief và
                                      thiết lập dự án

  Trải nghiệm AI                      Hỗ trợ cấu trúc brief, tổng hợp
                                      phản hồi và gợi ý từ khóa moodboard
  -----------------------------------------------------------------------


## 6. Phân công nhóm đề xuất

  -----------------------------------------------------------------------
  Thành viên                          Nhiệm vụ đề xuất
  ----------------------------------- -----------------------------------
  Thành viên 1                        Phụ trách các trang khách hàng,
                                      Creative Brief và duyệt phiên bản

  Thành viên 2                        Phụ trách các trang nhà thiết kế,
                                      moodboard và quản lý phiên bản

  Thành viên 3                        Phụ trách bảng công việc của trưởng
                                      nhóm, chức năng quản trị và tích
                                      hợp/kiểm thử chung
  -----------------------------------------------------------------------

## 7. Kiểm thử và tiêu chí nghiệm thu

Dự án được xem là đạt yêu cầu prototype khi:

-   Các trang chính mở được và điều hướng đúng.
-   Chức năng hiển thị dữ liệu theo vai trò hoạt động nhất quán.
-   Có thể tạo, xem, sửa hoặc cập nhật các dữ liệu thuộc phạm vi đã
    triển khai.
-   Tìm kiếm và bộ lọc trả về kết quả phù hợp.
-   Biểu mẫu kiểm tra dữ liệu bắt buộc và thông báo lỗi rõ ràng.
-   Trạng thái brief, phiên bản, bình luận và nhiệm vụ được thể hiện
    nhất quán.
-   Giao diện sử dụng được trên màn hình lớn và màn hình nhỏ.
-   Các luồng AI/demo có trạng thái tải, kết quả và xử lý lỗi phù hợp
    với phạm vi triển khai thực tế.
-   Báo cáo nêu trung thực các chức năng đã hoàn thành, chức năng mock
    và chức năng gọi API thật.

## 8. Rủi ro và hướng xử lý

  -----------------------------------------------------------------------
  Rủi ro                              Hướng xử lý
  ----------------------------------- -----------------------------------
  Dữ liệu giữa các trang không đồng   Dùng chung cấu trúc dữ liệu và các
  nhất                                hàm truy cập dữ liệu

  Phân quyền hiển thị sai             Kiểm tra điều kiện lọc dữ liệu theo
                                      vai trò và dự án

  Tính năng AI/API gặp lỗi            Có trạng thái lỗi, thông báo dễ
                                      hiểu và phương án thử lại

  Giao diện lệch trên điện thoại      Kiểm tra responsive ở nhiều kích
                                      thước màn hình

  Xung đột mã nguồn khi làm nhóm      Chia nhánh, commit thường xuyên và
                                      review trước khi gộp

  Khó phân biệt tính năng thật và mô  Ghi rõ phạm vi triển khai trong
  phỏng                               giao diện và báo cáo
  -----------------------------------------------------------------------

## 9. Kết quả mong đợi

Sau khi hoàn thành, CreatorStudio sẽ là một prototype web minh họa quy
trình quản lý dự án sáng tạo tập trung, từ tiếp nhận yêu cầu, phân công
công việc, quản lý phiên bản đến thu thập phản hồi và phê duyệt. Dự án
giúp nhóm vận dụng HTML, CSS, JavaScript, thiết kế responsive, quản lý
dữ liệu, kiểm thử và phối hợp nhóm; đồng thời thực hành đánh giá AI có
trách nhiệm bằng cách công khai giới hạn, xác minh kết quả và phân biệt
rõ tính năng mô phỏng với tích hợp API thực tế.

------------------------------------------------------------------------

**Ghi chú:** Đây là bản đề xuất dự án. Trước khi nộp, hãy cập nhật tiến
độ thực tế, tên thành viên, công nghệ/API đã sử dụng và trạng thái hoàn
thành của từng chức năng để nội dung khớp với sản phẩm cuối cùng.
