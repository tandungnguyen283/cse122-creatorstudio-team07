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

## 6. Các tính năng AI dự kiến

### 6.1. Brief Structurer -- Hỗ trợ cấu trúc brief

-   **Đầu vào:** Nội dung yêu cầu sáng tạo do người dùng nhập.
-   **Xử lý dự kiến:** Phân loại nội dung thành mục tiêu, đối tượng,
    thông điệp, sản phẩm bàn giao và thời hạn.
-   **Đầu ra:** Brief được sắp xếp thành các trường dễ đọc và dễ chỉnh
    sửa.
-   **Kiểm soát người dùng:** Có thể chấp nhận, chỉnh sửa, tạo lại hoặc
    từ chối kết quả.

### 6.2. Feedback Summarizer -- Tổng hợp phản hồi

-   **Đầu vào:** Các bình luận và yêu cầu chỉnh sửa của khách hàng.
-   **Xử lý dự kiến:** Nhóm các ý kiến tương tự, tóm tắt điểm cần sửa và
    nêu các vấn đề cần xác nhận thêm.
-   **Đầu ra:** Bản tổng hợp phản hồi ngắn gọn, có thể dùng làm danh
    sách công việc.
-   **Kiểm soát người dùng:** Người dùng xem lại và chỉnh sửa trước khi
    lưu hoặc sử dụng.

### 6.3. Mood Keyword Assistant -- Gợi ý từ khóa sáng tạo

-   **Đầu vào:** Mô tả dự án, phong cách mong muốn hoặc nội dung brief.
-   **Xử lý dự kiến:** Đề xuất các từ khóa về cảm xúc, phong cách, màu
    sắc hoặc định hướng hình ảnh.
-   **Đầu ra:** Danh sách từ khóa tham khảo cho moodboard.
-   **Kiểm soát người dùng:** Có thể chọn, chỉnh sửa hoặc loại bỏ từ
    khóa.

**Lưu ý về phạm vi:** Các tính năng AI chỉ được xem là gọi API thật khi
mã nguồn thực sự gửi yêu cầu đến dịch vụ AI bên ngoài và xử lý phản hồi
từ dịch vụ đó. Nếu kết quả được tạo từ dữ liệu mẫu, câu trả lời cố định
hoặc logic JavaScript cục bộ thì phải ghi rõ là **mock/demo**, không
giới thiệu là AI API thật. Khi tích hợp API, cần xử lý trạng thái đang
tải, lỗi kết nối, kết quả không chắc chắn và không để lộ khóa API ở mã
nguồn frontend.

## 7. Công nghệ và phương pháp triển khai

-   **HTML5:** Xây dựng cấu trúc trang bằng các thẻ ngữ nghĩa như
    `header`, `nav`, `main`, `section` và `footer`.
-   **CSS3:** Thiết kế giao diện, bố cục Flexbox/Grid, trạng thái thành
    phần và responsive.
-   **JavaScript:** Xử lý sự kiện, thao tác DOM, tìm kiếm/lọc, kiểm tra
    dữ liệu biểu mẫu, modal, thông báo và cập nhật giao diện.
-   **Dữ liệu:** Có thể sử dụng dữ liệu mẫu, `LocalStorage` hoặc API giả
    lập tùy theo phần đã triển khai.
-   **Quản lý mã nguồn:** Git/GitHub; phân công và theo dõi tiến độ bằng
    Trello, Jira hoặc Notion.
-   **Thiết kế giao diện:** Figma để phác thảo bố cục và đối chiếu với
    giao diện được lập trình.

Các công nghệ và dịch vụ được ghi trong báo cáo cuối cùng cần phản ánh
đúng mã nguồn và môi trường chạy thực tế.

## 8. Thiết kế dữ liệu dự kiến

Các thực thể dữ liệu chính:

-   `users`: tài khoản, tên hiển thị, vai trò và trạng thái.
-   `projects`: tên dự án, mô tả, khách hàng, nhà thiết kế phụ trách,
    thời hạn và trạng thái.
-   `briefs`: yêu cầu sáng tạo, mục tiêu, sản phẩm bàn giao, thời hạn và
    trạng thái duyệt.
-   `moodboards`: từ khóa, phong cách và tư liệu tham khảo.
-   `versions`: thông tin phiên bản, trạng thái và cờ xác định phiên bản
    mới nhất.
-   `comments`: nội dung phản hồi, phiên bản liên quan, trạng thái và
    loại bình luận.
-   `tasks`: tên nhiệm vụ, người nhận, hạn hoàn thành, mức ưu tiên và
    trạng thái.

Các thực thể cần được liên kết bằng mã định danh để bảo đảm dữ liệu dự
án, brief, phiên bản, bình luận và nhiệm vụ nhất quán.

## 9. Yêu cầu giao diện và trải nghiệm

-   Sử dụng HTML ngữ nghĩa và cấu trúc dễ bảo trì.
-   Bố cục thích ứng với màn hình máy tính, máy tính bảng và điện thoại.
-   Có trạng thái tải dữ liệu, không có dữ liệu, lỗi và thử tải lại khi
    phù hợp.
-   Biểu mẫu có nhãn rõ ràng và thông báo lỗi dễ hiểu.
-   Các hành động quan trọng như duyệt, trả lại, lưu trữ hoặc xóa cần có
    trạng thái phản hồi rõ ràng.
-   Nội dung nhập của người dùng cần được kiểm tra và hiển thị an toàn.
-   Phân biệt rõ dữ liệu mẫu, dữ liệu lưu cục bộ và dữ liệu lấy từ API.

## 10. Kế hoạch thực hiện

  -----------------------------------------------------------------------
  Giai đoạn               Công việc               Kết quả dự kiến
  ----------------------- ----------------------- -----------------------
  1\. Phân tích           Xác định vấn đề, vai    Đề xuất dự án và danh
                          trò, luồng nghiệp vụ và sách chức năng
                          phạm vi                 

  2\. Thiết kế            Phác thảo màn hình,     Bản thiết kế giao diện
                          điều hướng và thành     
                          phần giao diện trên     
                          Figma                   

  3\. Xây dựng nền tảng   Tạo cấu trúc HTML, CSS  Khung giao diện và dữ
                          dùng chung, dữ liệu và  liệu ban đầu
                          tiện ích JavaScript     

  4\. Phát triển theo vai Triển khai trang khách  Các trang chức năng
  trò                     hàng, nhà thiết kế,     chính
                          trưởng nhóm và quản trị 
                          viên                    

  5\. Tích hợp AI/demo    Xây dựng luồng nhập     Các tính năng AI hoặc
                          liệu, trạng thái tải,   mô phỏng được ghi nhãn
                          kết quả và thao tác xác rõ
                          nhận                    

  6\. Kiểm thử            Kiểm tra luồng thao     Danh sách lỗi và kết
                          tác, biểu mẫu, lọc,     quả sửa lỗi
                          responsive và dữ liệu   

  7\. Hoàn thiện          Viết README, đề xuất dự Bộ hồ sơ nộp bài và bản
                          án, tài liệu khai báo   demo
                          AI và kịch bản trình    
                          bày                     
  -----------------------------------------------------------------------

## 11. Phân công nhóm đề xuất

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

Phân công trên là gợi ý ban đầu; nhóm cần điều chỉnh theo phân công thực
tế, năng lực từng thành viên và phần việc đã hoàn thành. Mỗi thành viên
nên cập nhật tiến độ trên bảng công việc và sử dụng Git branch/pull
request khi làm việc nhóm.

## 12. Kiểm thử và tiêu chí nghiệm thu

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

## 13. Rủi ro và hướng xử lý

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

## 14. Kết quả mong đợi

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
