# SkillBridge Web (Frontend & BFF)

Ứng dụng Frontend & Backend-For-Frontend (BFF) xây dựng trên nền tảng **Next.js 16** (React 19 / App Router / TypeScript / Tailwind CSS / Zustand / TanStack Query) cho nền tảng cố vấn SkillBridge.

---

## 🛡️ Kiến Trúc Bảo Mật: Zero-Token In Browser
- **Token Handler Pattern**: Trình duyệt Client tuyệt đối **không lưu trữ Access Token hoặc Refresh Token** trong `localStorage`, `sessionStorage` hay JS memory (chống 100% tấn công đánh cắp token qua XSS).
- Toàn bộ Token được Next.js Server (BFF) lưu trữ an toàn và đóng gói thành Cookie bảo mật cao:
  ```http
  Set-Cookie: __Host-session=...; HttpOnly; Secure; SameSite=Strict; Path=/
  ```
- Mọi API call từ Client gọi qua Next.js Route Handlers (`/api/*`), BFF sẽ giải mã cookie và tự động inject `Authorization: Bearer <token>` khi gọi sang Backend .NET 10 API.

---

## 💳 Kiến Trúc Thanh Toán Đôi (Dual Checkout)
Màn hình Checkout hỗ trợ 2 phương thức:
1. **VietQR PayOS (Chuyển khoản thật)**: Hiển thị mã QR động chuẩn EMVCo, tiền thật nổ ngay vào tài khoản ngân hàng cá nhân trong 1–2 giây, SignalR tự động đẩy UI sang trạng thái "Thanh toán thành công".
2. **VNPAY Sandbox (Thẻ ATM Test)**: Chuyển hướng sang cổng thanh toán VNPAY, nhập thẻ ATM test NCB (`9704198526191432198`) phục vụ nộp bài và chấm đồ án.

---

## 🚀 Khởi Động Nhanh (Local Development)

```powershell
# 1. Tạo file cấu hình môi trường
Copy-Item .env.example .env.local

# 2. Cài đặt dependencies
npm install

# 3. Chạy môi trường phát triển
npm run dev
```

- Ứng dụng Web chạy tại: `http://localhost:3000`
- Kết nối tới Backend .NET API tại: `https://localhost:5001` hoặc `http://localhost:5000`

---

## 🧪 Kiểm Tra Chất Lượng Mã Nguồn

```powershell
npm run lint
npm run typecheck
npm run build
```
