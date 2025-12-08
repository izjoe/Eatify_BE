# Email Provider - Nodemailer Integration

## Mô tả
Module này cung cấp chức năng gửi email thông qua SMTP sử dụng thư viện `nodemailer`.

## Cấu hình

Thêm các biến môi trường sau vào file `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Eatify <noreply@eatify.com>"
FRONTEND_URL=http://localhost:3000
```

### Cấu hình Gmail SMTP

1. Bật **2-Step Verification** trong Google Account
2. Truy cập: https://myaccount.google.com/apppasswords
3. Tạo **App Password** mới cho ứng dụng
4. Copy password (16 ký tự) vào `SMTP_PASS`
5. Sử dụng các giá trị:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=your_gmail@gmail.com`

### Test với Ethereal Email (Fake SMTP)

Để test không cần Gmail thật:

1. Truy cập: https://ethereal.email/create
2. Lấy thông tin SMTP được tạo tự động
3. Cập nhật `.env` với thông tin đó
4. Xem email đã gửi tại: https://ethereal.email/messages

## Sử dụng

### Import

```javascript
import { sendEmail, getWelcomeEmailTemplate, getResetPasswordEmailTemplate } from "./providers/emailProvider.js";
```

### Gửi email đơn giản

```javascript
await sendEmail({
  to: "user@example.com",
  subject: "Test Email",
  text: "This is plain text content",
  html: "<h1>This is HTML content</h1>",
});
```

### Gửi Welcome Email

```javascript
const emailTemplate = getWelcomeEmailTemplate("John Doe", "john@example.com");

await sendEmail({
  to: "john@example.com",
  subject: emailTemplate.subject,
  text: emailTemplate.text,
  html: emailTemplate.html,
});
```

### Gửi Reset Password Email

```javascript
const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=abc123`;
const emailTemplate = getResetPasswordEmailTemplate("John Doe", resetLink);

await sendEmail({
  to: "john@example.com",
  subject: emailTemplate.subject,
  text: emailTemplate.text,
  html: emailTemplate.html,
});
```

## API Functions

### `initEmailProvider()`
Khởi tạo email provider khi server start. Được gọi tự động trong `server.js`.

### `sendEmail(options)`
Gửi email với các tùy chọn:
- `to` (string): Email người nhận
- `subject` (string): Tiêu đề email
- `text` (string, optional): Nội dung plain text
- `html` (string): Nội dung HTML

**Returns:** Promise với kết quả `{ success, messageId, response }` hoặc `{ success: false, error }`

### `getWelcomeEmailTemplate(name, email)`
Tạo template cho email chào mừng khi đăng ký.

**Parameters:**
- `name` (string): Tên người dùng
- `email` (string): Email người dùng

**Returns:** Object với `{ subject, text, html }`

### `getResetPasswordEmailTemplate(name, resetLink)`
Tạo template cho email reset password.

**Parameters:**
- `name` (string): Tên người dùng
- `resetLink` (string): Link reset password

**Returns:** Object với `{ subject, text, html }`

## Lưu ý

- Nếu không cấu hình SMTP, email sẽ không được gửi (không gây lỗi server)
- Email được gửi async, không block response
- Lỗi gửi email chỉ được log, không ảnh hưởng đến logic chính
- Sử dụng TLS/STARTTLS cho port 587, SSL cho port 465

## Testing

Để test email trong môi trường dev, có thể:

1. **Sử dụng Ethereal Email** (recommended cho dev):
   ```
   https://ethereal.email/create
   ```

2. **Sử dụng Gmail với App Password**

3. **Sử dụng Mailtrap** (dev SMTP service):
   ```
   https://mailtrap.io
   ```

## Troubleshooting

### Lỗi: "Invalid login"
- Kiểm tra SMTP_USER và SMTP_PASS
- Với Gmail: đảm bảo đã tạo App Password
- Với Gmail: bật 2-Step Verification

### Lỗi: "Connection timeout"
- Kiểm tra SMTP_HOST và SMTP_PORT
- Kiểm tra firewall/network blocking port 587/465

### Email không được gửi
- Kiểm tra console log để xem thông báo lỗi
- Xác minh tất cả biến môi trường SMTP đã được set
- Test với Ethereal Email trước khi dùng Gmail thật
