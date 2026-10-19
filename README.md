# SkillBridge Web

Next.js 16, React 19, TypeScript và Tailwind CSS 4.

## Chạy trên máy

Cần Node.js 24.x. Sao chép cấu hình từ .env.example sang .env.local và đặt API_BASE_URL trỏ tới backend SkillBridge. Giá trị mặc định http://localhost:5000 khớp với profile chạy .NET trên máy. Nếu backend được triển khai ở cổng khác, ví dụ 8080 qua container, đặt lại API_BASE_URL tương ứng.

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

Form đăng ký dùng hợp đồng `POST /api/v1/identity/auth/register`: `fullName` bắt buộc, tối đa 200 ký tự; `email` bắt buộc, tối đa 256 ký tự; `role` là `Mentee` hoặc `Mentor`; `phoneNumber` tùy chọn, tối đa 30 ký tự theo cột dữ liệu Identity. Mật khẩu cần ít nhất 8 ký tự, có chữ hoa ASCII, chữ thường ASCII, chữ số và một ký tự trong `!?*@#$%^&+=._-`. Form có trường xác nhận mật khẩu kiểm tra khớp trước khi gửi. Web giữ giới hạn request mật khẩu 256 ký tự. Quy tắc phía form và BFF dùng chung tại `src/lib/registration.ts`.

Form hiển thị điều kiện mật khẩu khi nhập, trường xác nhận mật khẩu và lỗi theo từng trường. BFF chuyển tiếp số điện thoại, ánh xạ lỗi FluentValidation từ Identity và lỗi email trùng vào đúng input. Backend trả token ngay sau đăng ký thành công nên web tạo phiên đăng nhập ngay; không thêm bước OTP hoặc xác nhận email chưa được API yêu cầu.

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

## CI/CD với Vercel

Workflow `.github/workflows/ci.yml` chạy lint, type check, build và integration test cho pull request và push vào `main`. Job `deploy` chỉ chạy sau khi toàn bộ CI thành công trên sự kiện push vào `main`; pull request không được deploy production.

CD checkout đúng commit đã kiểm thử, lấy cấu hình production từ Vercel, build bằng Vercel CLI cố định phiên bản `64.5.0`, rồi upload artifact bằng `vercel deploy --prebuilt --prod`. Các lần deploy được chạy lần lượt; commit đã cũ hơn đầu nhánh `main` sẽ được bỏ qua trước khi upload. URL được ghi trong trang tổng kết GitHub Actions và environment `production`.

`next.config.ts` dùng output của nền tảng khi có `VERCEL=1` hoặc `NEXT_ADAPTER_PATH`; build local/Docker vẫn tạo `.next/standalone`. Cấu hình này tránh lỗi thiếu `next-server.js.nft.json` khi kết hợp deployment adapter với standalone trên Next.js 16.3.4. Node.js được cố định ở major `24.x` trong package và workflow.

### Cấu hình lần đầu

1. Tạo hoặc import repository này vào Vercel, chọn framework Next.js, root directory là gốc repository và Node.js 24.x.
2. Trong Vercel, thêm biến môi trường **Production** `API_BASE_URL` bằng URL HTTPS của backend đã deploy, ví dụ `https://api.example.com`. Chỉ dùng URL gốc, không thêm `/api/v1/identity`; không dùng `localhost:5000` trên production.
3. Liên kết máy với đúng project để lấy `orgId` và `projectId`:

   ```cmd
   npx vercel@64.5.0 login
   npx vercel@64.5.0 link
   type .vercel\project.json
   ```

4. Trong repository GitHub, vào **Settings → Secrets and variables → Actions → New repository secret** và thêm:

   | Secret              | Giá trị                                                          |
   | ------------------- | ---------------------------------------------------------------- |
   | `VERCEL_TOKEN`      | Access token tạo trong tài khoản Vercel, có quyền deploy project |
   | `VERCEL_ORG_ID`     | `orgId` trong `.vercel/project.json`                             |
   | `VERCEL_PROJECT_ID` | `projectId` trong `.vercel/project.json`                         |

   Không commit token, file `.env` hay thư mục `.vercel`; `.gitignore` đã loại trừ các file local này. Job deploy dùng GitHub environment `production`, có thể dùng secret cùng tên ở environment này nếu đã cấu hình.

5. Merge pull request vào `main`. Mở tab **Actions → Web CI** để xem job CI và **Deploy production to Vercel**. Nếu thiếu secret, job sẽ báo rõ tên cần bổ sung; sau khi cấu hình có thể chọn **Re-run failed jobs**.

`vercel.json` tắt Git auto-deploy riêng cho `main`, để production chỉ cập nhật qua CD sau CI. Các nhánh khác vẫn có thể tạo Vercel Preview nếu Git integration đang bật. Khi đổi `API_BASE_URL` hoặc cấu hình production, cần chạy lại workflow hoặc tạo deployment mới để áp dụng.

Tham khảo [Vercel với GitHub Actions](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) và [cấu hình Git deployments](https://vercel.com/docs/project-configuration/git-configuration).
