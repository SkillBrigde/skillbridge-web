# SKILLBRIDGE PLATFORM — TÀI LIỆU ĐẶC TẢ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECIFICATION)

> **Phiên bản**: 4.1 Enterprise Standard  
> **Ngôn ngữ thiết kế (Design Language)**: Minimalist Dark Slate (Linear / Raycast / Stripe Style)  
> **Căn cứ kiến trúc**: Khớp 100% với 7 Bounded Contexts, 24 Bảng CSDL, Cổng thanh toán kép (PayOS VietQR \+ VNPAY), Gói dịch vụ đóng gói (Productized Services), Cơ chế Ký quỹ Escrow và MinIO S3 Object Storage.

---

## MỤC LỤC

1. [Triết Lý Thiết Kế & Bản Sắc Thẩm Mỹ (Design Philosophy)](#1-triết-lý-thiết-kế--bản-sắc-thẩm-mỹ)  
2. [Hệ Thống Design Tokens Chuẩn Doanh Nghiệp (Design Tokens)](#2-hệ-thống-design-tokens-chuẩn-doanh-nghiệp)  
3. [Danh Mục Tổng Thể 24 Màn Hình Hệ Thống (Master Screen Inventory)](#3-danh-mục-tổng-thể-24-màn-hình-hệ-thống)  
4. [Đặc Tả Chi Tiết 6 Luồng Nghiệp Vụ Cốt Lõi (Core Interaction Wireframes)](#4-đặc-tả-chi-tiết-6-luồng-nghiệp-vụ-cốt-lõi)  
5. [Đặc Tả Các Màn Hình Trạng Thái Lỗi Hệ Thống (System Error States)](#5-đặc-tả-các-màn-hình-trạng-thái-lỗi-hệ-thống)  
6. [Chiến Lược Thích Ứng Đa Màn Hình (Responsive Breakpoints)](#6-chiến-lược-thích-ứng-đa-màn-hình)  
7. [Tiêu Chuẩn Tiếp Cận & Tương Tác Vi Mô (Accessibility & Micro-Interactions)](#7-tiêu-chuẩn-tiếp-cận--tương-tác-vi-mô)

---

## 1\. Triết Lý Thiết Kế & Bản Sắc Thẩm Mỹ

### 1.1 Định Vị: "Tối Giản, Chuẩn Xác, Sang Trọng Chuẩn Silicon Valley"

Hệ thống SkillBridge loại bỏ hoàn toàn các phong cách màu mè, neon lòe loẹt hoặc giao diện SaaS phẳng màu trắng gây chói mắt. Nền tảng áp dụng ngôn ngữ thiết kế **Minimalist Dark Slate** (lấy cảm hứng từ Linear.app, Raycast và Stripe):

- **Bảng màu than đen Obsidian (`#0B0C0E`)**: Giúp tăng sự tập trung cao độ cho kỹ sư và học viên, tạo độ tương phản sâu và cảm giác cao cấp.  
- **Đường viền siêu mảnh 1px (Hairline Borders `rgba(255, 255, 255, 0.08)`)**: Thay thế các bóng đổ (shadows) nặng nề bằng các đường viền sắc cạnh phân tách khối giao diện tinh tế.  
- **Khoảng thở hào phóng (Generous Whitespace)**: Bố cục thông thoáng, nhịp điệu thị giác rõ ràng, không nhồi nhét chữ hay sticker hoạt hình.  
- **Phông chữ lai kỹ thuật (Dual Typography Engine)**:  
  * **Inter**: Phông chữ không chân hiện đại, căn chỉnh kerning chặt chẽ cho toàn bộ tiêu đề, nhãn và văn bản điều hướng.  
  * **JetBrains Mono**: Dành riêng cho dữ liệu tài chính (VND), mã giao dịch (TXID), mã phòng học, dấu thời gian, và trình soạn thảo mã nguồn.

---

## 2\. Hệ Thống Design Tokens Chuẩn Doanh Nghiệp

### 2.1 Bảng Màu Hệ Thống (Color Palette)

| Token Name | Giá Trị HEX / RGBA | Ý Nghĩa Sử Dụng & Vị Trí Áp Dụng |
| :---- | :---- | :---- |
| `surface-canvas` | `#0B0C0E` | Nền canvas toàn hệ thống, header ghim trên cùng |
| `surface-subtle` | `#0F1115` | Nền thanh tìm kiếm, khối nhập liệu form, bảng log |
| `surface-card` | `#14171D` | Bề mặt các thẻ dịch vụ, modal, bảng dữ liệu ledger |
| `surface-card-hover` | `#171A21` | Trạng thái hover của thẻ card tương tác |
| `border-hairline` | `rgba(255, 255, 255, 0.08)` | Viền 1px phân tách các khối giao diện chuẩn |
| `border-active` | `rgba(94, 106, 210, 0.4)` | Viền sáng khi thẻ được chọn hoặc ô input focus |
| `brand-indigo` | `#5E6AD2` | Màu nhận diện chính, nút bấm CTA chính (Linear Indigo) |
| `status-emerald` | `#27C98F` | Số dư khả dụng, khiên bảo chứng Escrow, giao dịch thành công |
| `status-amber` | `#F5A623` | Bộ đếm ngược khóa Redis (10:00), sao đánh giá, cảnh báo |
| `status-rose` | `#FF5C5C` | Tranh chấp Dispute SLA 48h, thông báo hủy lịch, mã lỗi |
| `text-primary` | `#F0F2F5` | Tiêu đề chính H1/H2/H3, số tiền, nội dung quan trọng |
| `text-secondary` | `#9BA1B0` | Đoạn văn mô tả dịch vụ, nhãn trường nhập liệu |
| `text-tertiary` | `#5D6474` | Metadata, thời gian phụ, chú thích chân trang |

### 2.2 Quy Chuẩn Typography & Thang Cỡ Chữ

```
Display H1    : 24px - 28px / Semi-bold (Inter) / Tracking: -0.02em / Color: #F0F2F5
Section H2    : 18px - 20px / Semi-bold (Inter) / Tracking: -0.015em / Color: #F0F2F5
Card Title H3 : 14px - 15px / Semi-bold (Inter) / Tracking: -0.01em / Color: #F0F2F5
Body Text     : 13px - 14px / Regular (Inter) / Line-height: 1.6 / Color: #9BA1B0
Caption / Tag : 11px - 12px / Medium (Inter) / Color: #5D6474
Monospace     : 11px - 14px / JetBrains Mono / Tabular Numbers / Color: #F0F2F5
```

---

## 3\. Danh Mục Tổng Thể 24 Màn Hình Hệ Thống

Toàn bộ hệ thống được quy hoạch thành **24 Màn hình chuyên trách**, chia thành 4 phân hệ rõ rệt:

```
SKILLBRIDGE PLATFORM (24 SCREENS)
├── PHẦN A: MENTEE JOURNEY (9 Màn hình: SCR-PUB-01 -> SCR-DSP-01)
├── PHẦN B: MENTOR STUDIO (8 Màn hình: SCR-MTR-01 -> SCR-MTR-05)
├── PHẦN C: ADMIN OPERATION CENTER (3 Màn hình: SCR-ADM-01 -> SCR-ADM-03)
└── PHẦN D: AUTH & SYSTEM ERRORS (4 Màn hình: SCR-AUT-01 -> SCR-ERR-03)
```

### Bảng Chi Tiết 24 Màn Hình

| STT | Mã Màn Hình | Tên Màn Hình & Phân Hệ | Vai Trò (Actor) | Mục Đích Cốt Lõi |
| :---: | :---- | :---- | :---- | :---- |
| **01** | `SCR-PUB-01` | **Khám Phá Mentors & Bộ Lọc Kỹ Năng** | Mentee / Guest | Tìm kiếm với phím tắt \[Ctrl+K\], lọc danh mục, duyệt danh sách Mentors |
| **02** | `SCR-PUB-02` | **Hồ Sơ Mentor & 3 Gói Dịch Vụ Đóng Gói** | Mentee / Guest | Xem bio chuyên gia, tích xanh, rating 4.98⭐, và 3 thẻ Productized Services |
| **03** | `SCR-BKG-01` | **Khảo Sát Intake 3 Câu Hỏi & Chọn Khung Giờ** | Mentee | Bắt buộc trả lời 3 câu hỏi (Problem, Repo, Outcome), chọn slot trống Redis |
| **04** | `SCR-PAY-01` | **Cổng Thanh Toán Kép (VietQR PayOS \+ VNPAY)** | Mentee | Đếm ngược 10:00 Redis Lock, VietQR động MB Bank, bảo chứng Escrow Shield |
| **05** | `SCR-BKG-02` | **Bảng Điều Khiển Buổi Học Của Tôi (My Bookings)** | Mentee | Quản lý lịch học sắp diễn ra, chờ nghiệm thu, đã hoàn thành |
| **06** | `SCR-LRN-01` | **Phòng Học 1-on-1 & Nghiệm Thu Escrow** | Mentee & Mentor | WebRTC Video call, bảng Code Scratchpad, nút Nghiệm thu / Khiếu nại |
| **07** | `SCR-REV-01` | **Đánh Giá & Nhận Xét 4 Tiêu Chí Sau Buổi Học** | Mentee | Chấm 5 sao (Chuyên môn, Sư phạm, Hữu ích, Tổng quan) & viết feedback |
| **08** | `SCR-WLT-01` | **Ví Cá Nhân & Lịch Sử Ký Quỹ Mentee** | Mentee | Quản lý số dư, số tiền đang cọc Escrow, lịch sử nạp/hoàn tiền |
| **09** | `SCR-DSP-01` | **Khởi Tạo Hồ Sơ Khiếu Nại Buổi Học (Dispute)** | Mentee | Nộp đơn tố cáo (vắng mặt, out sớm), đính kèm ảnh bằng chứng |
| **10** | `SCR-MTR-01` | **Đăng Ký Mentor & Nộp Hồ Sơ KYC** | Mentor | Nộp ảnh CCCD 2 mặt vào MinIO S3 Private, chứng chỉ AWS, tài khoản ngân hàng |
| **11** | `SCR-MTR-02` | **Studio Đóng Gói 3 Gói Dịch Vụ (Packaging)** | Mentor | Thiết lập 3 Tier: đặt tên, thời lượng, giá cố định, cam kết đầu ra |
| **12** | `SCR-SCH-01` | **Quản Lý Lịch Trống & Quy Tắc Lặp Tuần** | Mentor | Thiết lập Availability Rules (Thứ 2 \- CN), Buffer time, ngày nghỉ phép |
| **13** | `SCR-MTR-03` | **Lịch Giảng Dạy Sắp Tới & Xem Trước Intake** | Mentor | Danh sách học viên sắp dạy, đọc trước câu trả lời Intake và link GitHub |
| **14** | `SCR-MTR-04` | **Phòng Học Mentor & Nộp Bằng Chứng Nghiệm Thu** | Mentor | Upload ảnh chụp màn hình (Proof-of-Work) & rubric, kích hoạt đếm ngược 24h |
| **15** | `SCR-WLT-02` | **Ví Doanh Thu Mentor & Rút Tiền VietQR 24/7** | Mentor | Theo dõi 3 số dư (Khả dụng, Escrow, Tranh chấp), rút tiền tức thì PayOS |
| **16** | `SCR-DSP-02` | **Giải Trình Khiếu Nại & Đối Chất Bằng Chứng** | Mentor | Đối chất với Mentee trong vòng 24h, nộp log cuộc gọi và đề xuất phương án |
| **17** | `SCR-MTR-05` | **Quản Lý Uy Tín & Phản Hồi Đánh Giá** | Mentor | Theo dõi điểm số các tiêu chí, trả lời phản hồi công khai của Mentee |
| **18** | `SCR-ADM-01` | **Trung Tâm Phán Quyết Khiếu Nại SLA 48h** | Super Admin | So sánh đối chất 2 cột, đồng hồ SLA 48h, 4 nút phán quyết tối cao |
| **19** | `SCR-ADM-02` | **Duyệt Hồ Sơ KYC Mentor & Cấp Tích Xanh** | Super Admin | Thẩm định CCCD, bằng cấp MinIO, kiểm tra trùng khớp tên ngân hàng |
| **20** | `SCR-ADM-03` | **Giám Sát Sổ Cái Escrow Toàn Sàn & Đối Soát** | Super Admin | Sổ cái kế toán kép Double-Entry Ledger, đối soát PayOS / VNPAY |
| **21** | `SCR-AUT-01` | **Xác Thực Đăng Nhập & Google OAuth2** | All Actors | Đăng nhập nhanh Google OAuth2 một chạm hoặc Email/Password tối giản |
| **22** | `SCR-ERR-01` | **Màn Hình Lỗi 404 (Không Tìm Thấy Trang)** | All Actors | Thông báo đường dẫn hỏng hoặc slot đã bị hủy, phím điều hướng nhanh |
| **23** | `SCR-ERR-02` | **Màn Hình Lỗi 500 & Bảo Trì Hệ Thống** | All Actors | Trạng thái dịch vụ phụ trợ (DB, Redis, Payment), cam kết bảo toàn tiền Escrow |
| **24** | `SCR-ERR-03` | **Màn Hình Hết Hạn Khóa Slot 10 Phút Redis** | Mentee | Thông báo hết hạn giữ chỗ (Redis Timeout), nút đặt lại slot hoặc chọn slot khác |

---

## 4\. Đặc Tả Chi Tiết 6 Luồng Nghiệp Vụ Cốt Lõi

### 4.1 Luồng 1: Hồ Sơ Mentor & Bộ 3 Gói Dịch Vụ Đóng Gói (`SCR-PUB-02`)

- **Khái niệm nghiệp vụ**: Không bán giờ lẻ tẻ. Bắt buộc đóng gói thành 3 nấc thang rõ ràng:  
  1. **Tier 1 (Quick Win)**: Review CV & Tối ưu Portfolio chuẩn ATS (45 phút \- 300.000 ₫).  
  2. **Tier 2 (High Impact \- Top Pick)**: Mock Interview System Design & .NET (60 phút \- 450.000 ₫).  
  3. **Tier 3 (Transformation)**: Lộ trình Software Architect 1 Tháng (4 buổi \- 2.000.000 ₫).  
- **Trạng thái tương tác**:  
  * Thẻ Tier 2 có viền phân biệt `border-accent/40`, huy hiệu nhỏ "Tier 2 • Phổ biến nhất".  
  * Bấm "Chọn Gói Này" sẽ lưu thông tin dịch vụ vào bộ nhớ phiên và chuyển sang `SCR-BKG-01`.

### 4.2 Luồng 2: Khảo Sát Intake 3 Câu Hỏi & Khóa Slot Tức Thời (`SCR-BKG-01`)

- **Quy tắc vàng**: Bắt buộc trả lời đủ 3 câu hỏi trước khi sang bước thanh toán:  
  * *Câu 1*: Vấn đề cốt lõi (Textarea min 30 ký tự, có 3 chip gợi ý nhanh).  
  * *Câu 2*: Link tài liệu / GitHub Repo (URL Input hợp lệ).  
  * *Câu 3*: Kỳ vọng đầu ra cụ thể sau buổi học.  
- **Cơ chế khóa Slot độc quyền (Redis Atomic Lock)**:  
  * Khi bấm "Khóa Slot & Sang Thanh Toán", client gọi API tạo booking dạng `Draft`.  
  * Backend kích hoạt lệnh Redis: `SET lock:slot:{slotId} "{menteeId}" NX EX 600`.  
  * Khung giờ chuyển sang trạng thái bận đối với mọi người dùng khác trong vòng đúng 10 phút.

### 4.3 Luồng 3: Trung Tâm Thanh Toán Kép & Khóa 10 Phút (`SCR-PAY-01`)

- **Bộ đếm thời gian (Redis Countdown)**: Hiển thị đồng hồ `09:59` đếm lùi từng giây ở góc trên. Khi còn dưới 2 phút, chuyển sang màu vàng hổ phách cảnh báo.  
- **Chuyển đổi 2 cổng thanh toán**:  
  * **Tab 1 \- PayOS VietQR Pro**: Hiển thị mã QR đen trắng sắc nét chuẩn Napas 247, logo ngân hàng MB Bank, mã chuyển khoản định danh duy nhất (VD: `SB20268819`). Có nút giả lập Webhook tức thì.  
  * **Tab 2 \- VNPAY Sandbox**: Biểu mẫu thẻ ATM nội địa có sẵn nút *"Điền thẻ test NCB"* (`9704198526191432198`).  
- **Thẻ bảo chứng Escrow Shield**: Xác nhận số tiền được đóng băng trong hợp đồng ủy thác SkillBridge Escrow, chỉ giải ngân cho Mentor sau khi học viên hài lòng hoặc sau 24h.

### 4.4 Luồng 4: Phòng Học Trực Tuyến & Bằng Chứng Nghiệm Thu (`SCR-LRN-01`)

- **Bố cục làm việc đôi (Dual Workspace 7:5)**:  
  * Cửa sổ video call 1080p, hiển thị Mentor toàn màn hình và ô PIP Mentee góc trên, thanh sóng âm thời gian thực.  
  * Bảng soạn thảo code chia sẻ trực tiếp (C\# .NET 10 Solution).  
- **Khối nghiệm thu & mở khóa Escrow**:  
  * Hiển thị file bằng chứng do Mentor tải lên (`webrtc_session_proof_98124.png`).  
  * Mentee có 2 hành động dứt khoát:  
    - Nút Xanh: *"Tôi Hài Lòng & Giải Phóng Tiền Cho Mentor"* (tiền lập tức chuyển vào ví Mentor).  
    - Nút Đỏ: *"Báo Cáo Sự Cố / Khiếu Nại (Mở SLA 48h)"* (chuyển hồ sơ sang Admin).

### 4.5 Luồng 5: Trung Tâm Phán Quyết Khiếu Nại Admin SLA 48h (`SCR-ADM-01`)

- **Đối chất song song 2 cột (Split Evidence Inspector)**:  
  * *Cột trái (Mentee)*: Lý do khiếu nại \+ Trích xuất tự động lịch sử chat có dấu thời gian của buổi học.  
  * *Cột phải (Mentor)*: Văn bản giải trình \+ Nhật ký WebRTC Server Log (chỉ ra Mentor vào trễ và thiếu 24 phút).  
- **4 Quyết định phán quyết tối cao**:  
  1. `REFUND_100`: Hoàn tiền 100% (450.000 ₫) cho Mentee, trừ điểm uy tín Mentor.  
  2. `SPLIT_50_50`: Chia đôi Escrow, mỗi bên nhận 225.000 ₫.  
  3. `RESCHEDULE`: Giữ tiền Escrow, yêu cầu Mentor sắp xếp dạy bù 1 buổi miễn phí.  
  4. `RELEASE_100`: Bác khiếu nại, giải phóng toàn bộ tiền cho Mentor nếu bằng chứng cho thấy Mentee vu khống.

### 4.6 Luồng 6: Ví FinTech Mentor & Rút Tiền VietQR Tức Thì (`SCR-WLT-02`)

- **Phân tách rạch ròi 3 dòng tiền**:  
  * *Khả dụng (Available)*: Tiền đã được giải phóng từ Escrow, có thể rút bất cứ lúc nào.  
  * *Tạm giữ Escrow (Holding)*: Các buổi học vừa xong, đang trong thời hạn 24h nghiệm thu.  
  * *Đang tranh chấp (Disputed)*: Các buổi học đang bị Mentee khiếu nại, chờ Admin ra phán quyết.  
- **Rút tiền tức thì PayOS Payout 24/7**:  
  * Tích hợp Napas 247, tiền về tài khoản ngân hàng của Mentor trong 30 giây.

---

## 5\. Đặc Tả Các Màn Hình Trạng Thái Lỗi Hệ Thống

### 5.1 Màn Hình 404 — Không Tìm Thấy Trang (`SCR-ERR-01`)

- Số `404` kích thước lớn màu xám trầm (`#3B4150`), dòng thông điệp *"Không tìm thấy trang này"*.  
- 2 Card điều hướng nhanh: *"Khám phá danh sách Mentors"* và *"Quay lại Bảng điều khiển"*.  
- Dấu vết RayID để người dùng gửi cho kỹ thuật viên khi cần hỗ trợ.

### 5.2 Màn Hình 500 — Sự Cố Máy Chủ & Bảo Trì (`SCR-ERR-02`)

- Biểu tượng server rack với đèn vàng thận trọng.  
- Thông điệp cam đoan: *"Máy chủ đang gặp sự cố khi xử lý dữ liệu. Toàn bộ dòng tiền và hợp đồng Escrow của bạn vẫn được bảo vệ tuyệt đối."*  
- Bảng kiểm tra sức khỏe phụ trợ thời gian thực: PostgreSQL (Xanh), Redis (Vàng), Cổng thanh toán (Xanh).

### 5.3 Màn Hình Hết Hạn Khóa Slot 10 Phút Redis (`SCR-ERR-03`)

- Biểu tượng đồng hồ `00:00` kèm nhãn *"REDIS ATOMIC LOCK EXPIRED"*.  
- Giải thích rõ ràng nguyên nhân slot bị hủy để nhường cơ hội cho học viên khác.  
- Kiểm tra trực tiếp: Nếu slot vẫn chưa ai đặt, hiển thị nút *"Khóa lại ngay khung giờ này"* hoặc gợi ý 2 khung giờ kế tiếp.

---

## 6\. Chiến Lược Thích Ứng Đa Màn Hình

| Thiết Bị & Kích Cỡ | Điểm Ngắt (Breakpoint) | Điều Chỉnh Bố Cục Giao Diện |
| :---- | :---- | :---- |
| **Mobile** | `< 640px` (375px \- 428px) | 3 Thẻ dịch vụ chuyển sang dạng trượt ngang (Carousel); Form Intake hiển thị toàn màn hình (Full-screen Modal); Thanh điều hướng ghim đáy màn hình. |
| **Tablet** | `640px - 1024px` (768px \- 834px) | Thẻ dịch vụ xếp lưới 2 cột; Giao diện thanh toán chuyển thành dạng 1 cột dọc liên tục; Video call thu nhỏ diện tích code editor. |
| **Desktop** | `> 1024px` (1280px \- 1920px) | Hiển thị trọn vẹn 3 cột dịch vụ song song; Checkout chia tỷ lệ 7:5; Màn hình Admin hiển thị song song 2 cột đối chất trực diện. |

---

## 7\. Tiêu Chuẩn Tiếp Cận & Tương Tác Vi Mô

1. **Chuẩn WCAG 2.1 Level AA**:  
   - Tương phản chữ trắng `#F0F2F5` trên nền đen than `#0B0C0E` đạt tỷ lệ `16.5:1` (vượt xa mức chuẩn yêu cầu `4.5:1`).  
   - Mọi phím bấm tương tác đều có vùng bấm tối thiểu `44px x 44px` trên thiết bị cảm ứng.  
2. **Hỗ trợ phím tắt bàn phím (Keyboard Accessibility)**:  
   - Hộp tìm kiếm hỗ trợ phím tắt `Ctrl + K` (hoặc `Cmd + K`).  
   - Tab phím điều hướng tuần tự qua các ô nhập liệu của form Intake.  
3. **Phản hồi xúc giác & thị giác tức thì (Micro-Interactions)**:  
   - Thao tác bấm Copy số tài khoản / Nội dung chuyển khoản: Hiển thị nhãn *"Đã copy"* trong 0.2s.  
   - Nhận Webhook thanh toán: Hiệu ứng chuyển động nhẹ và thông báo màu xanh ngọc lục bảo.