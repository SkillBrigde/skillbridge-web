# SkillBridge Web

Next.js 16, React 19, TypeScript và Tailwind CSS 4.

## Chạy trên máy

Cần Node.js 24 trở lên. Sao chép cấu hình từ .env.example sang .env.local và đặt API_BASE_URL trỏ tới backend SkillBridge. Giá trị mặc định http://localhost:5000 khớp với profile chạy .NET trên máy. Nếu backend được triển khai ở cổng khác, ví dụ 8080 qua container, đặt lại API_BASE_URL tương ứng.

```powershell
npm ci
npm run dev
```

Mở http://localhost:3000 để xem homepage.

## Dữ liệu và tài khoản

- Website không tự tạo dữ liệu, tài khoản, JWT, hồ sơ mentor hay số dư mẫu.
- Đăng nhập, đăng ký, lấy phiên và đăng xuất gọi BFF /api/auth/*. BFF kết nối các endpoint Identity sẵn có của backend .NET.
- Access token và refresh token nằm trong cookie HttpOnly. Mã phía trình duyệt chỉ nhận thông tin tài khoản, không nhận token.
- Phiên cũ trong localStorage của bản prototype được bỏ qua và xóa khi mở website. Không lưu mật khẩu hay trạng thái giao dịch trong trình duyệt.
- Khi dịch vụ tài khoản chưa chạy, form hiển thị lỗi kết nối; không có đăng nhập dự phòng bằng tài khoản mẫu.

## Phạm vi tính năng hiện tại

Homepage, danh sách mentor với trạng thái trống, trang tài khoản và các trạng thái lỗi dùng giao diện sáng mới. Homepage có mục tiêu tương tác, liên kết khám phá lĩnh vực, FAQ và chuyển động hỗ trợ reduced motion.

Backend hiện có Identity và Catalog. Phần API cho hồ sơ mentor, đặt lịch, thanh toán, ví, phòng học, đánh giá và quản trị chưa có hợp đồng để tích hợp. Các nhóm route tương ứng hiển thị màn hình đang hoàn thiện. Các thao tác cũ trong store luôn trả về trạng thái chưa khả dụng; không thể tạo giao dịch hoặc cấp quyền cục bộ. View cũ được giữ để tiếp tục tích hợp sau, không được mở trong giao diện hiện tại.

## Cấu trúc

- src/features/home/content: nội dung và danh mục homepage.
- src/features/home/components: minh họa tĩnh và thành phần chọn mục tiêu tương tác.
- src/features/home/views: bố cục homepage render ở server.
- src/features/auth/components: form dùng chung cho đăng nhập và đăng ký.
- src/lib/server/auth.ts: giao tiếp Identity API và quản lý cookie.
- src/lib/store.ts: trạng thái tài khoản đã xác minh, không chứa dữ liệu mẫu.
- src/lib/feature-availability.ts: chặn thao tác chưa có API.

## Kiểm tra

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:integration
```

Integration test chạy bản production với backend fixture chỉ dùng trong kiểm thử: xác thực cookie, đăng ký, refresh, logout, lỗi dịch vụ và việc chặn các màn hình mô phỏng. Test tự tạo và dừng server riêng, không dùng tài khoản hay backend thật.
