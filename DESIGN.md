# SkillBridge design system

## Hướng thiết kế

Giao diện sáng, tối giản, mang cảm giác biên tập. Nền trắng ấm, chữ tối và màu tím chàm giữ nhận diện SkillBridge. Nội dung tiếng Việt, ưu tiên mục tiêu và hành động rõ ràng.

## Màu và chữ

- Canvas: #faf9f6; ink: #27252d; secondary text: #5e5866; primary: #6551a4; border: #e5e2de.
- Inter cho nội dung và tiêu đề. Lora italic có subset tiếng Việt dùng để nhấn nhá tiêu đề, tránh dấu bị tách do font thay thế.
- Thành phần dùng chung có tiền tố sb- và token --sb-* trong globals.css.

## Bố cục và chuyển động

- Nội dung tối đa 1320px. Chữ nội dung chính 14–16px, tiêu đề và thẻ lớn hơn với khoảng cách giữa các phần gọn hơn để trang đầy đặn, dễ đọc. Header cố định nhẹ, hero hai cột, lĩnh vực, quy trình, lời mời mentor, FAQ và CTA.
- Màn hình nhỏ chuyển thành một cột; menu điện thoại có nhãn và trạng thái mở rõ ràng.
- Minh họa cây cầu là SVG trong repository. Không phụ thuộc ảnh ngoài hoặc hồ sơ người dùng giả.
- Hover, chuyển mục tiêu, đường chuyển động và reveal nhẹ. Tôn trọng prefers-reduced-motion, nội dung vẫn có sẵn nếu tắt JavaScript.
- Dải 3 câu nói tự đổi mỗi 5,5 giây, tiếp tục chạy khi rê chuột hoặc dùng bàn phím; chỉ giữ nút chọn câu, không có nút tạm dừng. Tắt tự chuyển khi người dùng yêu cầu giảm chuyển động.

## Tính trung thực của nội dung

Không hiển thị số lượng người dùng, đánh giá, lời chứng thực, trạng thái dịch vụ, giao dịch hoặc hồ sơ mentor khi không có dữ liệu thật. Tính năng chưa tích hợp phải có trạng thái chưa khả dụng. Không có nút đăng nhập nhanh, Google giả hay thanh toán mô phỏng.
