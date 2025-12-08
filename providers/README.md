# Email Provider - Nodemailer Integration

## Description
This module provides SMTP email sending using `nodemailer`.

## Configuration

Add the following environment variables to your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Eatify <noreply@eatify.com>"
FRONTEND_URL=https://eatify-fe.vercel.app
```

### Gmail SMTP setup

1. Enable **2-Step Verification** in your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Create an **App Password** for the application
4. Copy the generated password into `SMTP_PASS`
5. Use the following values:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your_gmail@gmail.com`

### Test with Ethereal Email (fake SMTP)

To test without a real Gmail account:

1. Visit: https://ethereal.email/create
2. Copy the generated SMTP credentials
3. Update your `.env` with those credentials
4. Inspect sent messages at: https://ethereal.email/messages

## Usage

### Import

```javascript
import { sendEmail, getWelcomeEmailTemplate, getResetPasswordEmailTemplate } from "./providers/emailProvider.js";
```

### Send a simple email

```javascript
await sendEmail({
  to: "user@example.com",
  subject: "Test Email",
  text: "This is plain text content",
  html: "<h1>This is HTML content</h1>",
});
```

### Send Welcome Email

```javascript
const emailTemplate = getWelcomeEmailTemplate("John Doe", "john@example.com");

await sendEmail({
  to: "john@example.com",
  subject: emailTemplate.subject,
  text: emailTemplate.text,
  html: emailTemplate.html,
});
```

### Send Reset Password Email

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
Initialize email provider when the server starts. Called automatically from `server.js`.

### `sendEmail(options)`
Send an email with the following options:
- `to` (string): Recipient email
- `subject` (string): Email subject
- `text` (string, optional): Plain text content
- `html` (string): HTML content

**Returns:** Promise resolving to `{ success, messageId, response }` or `{ success: false, error }`

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

## Notes

- If SMTP is not configured, emails will be skipped (does not crash the server)
- Emails are sent asynchronously and do not block responses
- Errors while sending are logged but do not affect main logic
- Use TLS/STARTTLS for port 587, SSL for port 465

## Testing

To test emails in development:

1. **Use Ethereal Email** (recommended for dev):
  ```
  https://ethereal.email/create
  ```

2. **Use Gmail with App Password**

3. **Use Mailtrap** (developer SMTP service):
  ```
  https://mailtrap.io
  ```

## Troubleshooting

### Errors and troubleshooting

#### "Invalid login"
- Check `SMTP_USER` and `SMTP_PASS`
- For Gmail: ensure you created an App Password and enabled 2-Step Verification

#### "Connection timeout"
- Verify `SMTP_HOST` and `SMTP_PORT`
- Check firewall/network blocking ports 587/465

#### Emails not being delivered
- Inspect console logs for error details
- Ensure SMTP environment variables are set
- Test with Ethereal Email before using a real SMTP
