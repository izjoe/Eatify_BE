import nodemailer from "nodemailer";

/**
 * Email Provider - Nodemailer Configuration
 * Uses SMTP to send emails
 * 
 * Required Environment Variables:
 * - SMTP_HOST: SMTP server host (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP port (e.g., 587 for TLS, 465 for SSL)
 * - SMTP_USER: Email account username
 * - SMTP_PASS: Email account password or app password
 * - SMTP_FROM: Sender email address (e.g., "Eatify <noreply@eatify.com>")
 */

// Create transporter to send emails
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Validate configuration
  if (!config.host || !config.auth.user || !config.auth.pass) {
    console.warn("️ SMTP configuration is incomplete. Email sending will be disabled.");
    return null;
  }

  return nodemailer.createTransporter(config);
};

// Singleton transporter instance
let transporter = null;

/**
 * Initialize email provider
 */
export const initEmailProvider = () => {
  transporter = createTransporter();
  if (transporter) {
    console.log(" Email Provider initialized successfully");
  } else {
    console.log("️ Email Provider disabled (missing SMTP config)");
  }
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content (optional)
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Result of email sending
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // If no transporter (SMTP not configured), skip sending email
    if (!transporter) {
      console.log("️ Email sending skipped (SMTP not configured)");
      return { success: false, message: "SMTP not configured" };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully:", info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error(" Error sending email:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Template: Welcome email for account registration
 * @param {string} name - User name
 * @param {string} email - User email
 * @returns {Object} - Email content
 */
export const getWelcomeEmailTemplate = (name, email) => {
  return {
    subject: " Chào mừng bạn đến với Eatify!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #FF6B6B;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #FF6B6B;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Eatify</h1>
            <p>Chào mừng bạn đến với cộng đồng của chúng tôi!</p>
          </div>
          <div class="content">
            <h2>Xin chào ${name}! </h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Eatify</strong>.</p>
            <p>Tài khoản của bạn đã được tạo thành công với email: <strong>${email}</strong></p>
            
            <h3>Bước tiếp theo:</h3>
            <ul>
              <li>Đăng nhập vào tài khoản của bạn</li>
              <li>Hoàn thiện thông tin cá nhân</li>
              <li>Khám phá các món ăn ngon từ người bán hàng</li>
              <li>Đặt hàng và tận hưởng!</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'https://eatify-fe.vercel.app'}/login" class="button">
                Đăng nhập ngay
              </a>
            </center>
            
            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
            
            <p>Chúc bạn có trải nghiệm tuyệt vời! </p>
            
            <p>Trân trọng,<br><strong>Đội ngũ Eatify</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Eatify. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Xin chào ${name}!

Cảm ơn bạn đã đăng ký tài khoản tại Eatify.
Tài khoản của bạn đã được tạo thành công với email: ${email}

Bước tiếp theo:
- Đăng nhập vào tài khoản của bạn
- Hoàn thiện thông tin cá nhân
- Khám phá các món ăn ngon từ người bán hàng
- Đặt hàng và tận hưởng!

Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.

Chúc bạn có trải nghiệm tuyệt vời!

Trân trọng,
Đội ngũ Eatify
    `.trim(),
  };
};

/**
 * Template: Reset password email
 * @param {string} name - User name
 * @param {string} resetLink - Password reset link
 * @returns {Object} - Email content
 */
export const getResetPasswordEmailTemplate = (name, resetLink) => {
  return {
    subject: " Yêu cầu đặt lại mật khẩu - Eatify",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Eatify</h1>
            <p>Yêu cầu đặt lại mật khẩu</p>
          </div>
          <div class="content">
            <h2>Xin chào ${name}! </h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            
            <center>
              <a href="${resetLink}" class="button">
                Đặt lại mật khẩu
              </a>
            </center>
            
            <div class="warning">
              <strong>️ Lưu ý:</strong>
              <ul>
                <li>Link này chỉ có hiệu lực trong <strong>1 giờ</strong></li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                <li>Không chia sẻ link này với bất kỳ ai</li>
              </ul>
            </div>
            
            <p>Nếu nút bên trên không hoạt động, copy link sau vào trình duyệt:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            
            <p>Trân trọng,<br><strong>Đội ngũ Eatify</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Eatify. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Xin chào ${name}!

Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.

Vui lòng truy cập link sau để đặt lại mật khẩu:
${resetLink}

️ Lưu ý:
- Link này chỉ có hiệu lực trong 1 giờ
- Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
- Không chia sẻ link này với bất kỳ ai

Trân trọng,
Đội ngũ Eatify
    `.trim(),
  };
};

export default {
  initEmailProvider,
  sendEmail,
  getWelcomeEmailTemplate,
  getResetPasswordEmailTemplate,
};
