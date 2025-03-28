export default class EmailTemplates {
    static forgotPasswordTemplate(name, resetLink) {
      return `
        <p>Hello ${name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background:#007bff; padding:10px 15px; color:white; text-decoration:none; border-radius:5px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;
    }
  
    static welcomeTemplate(name) {
      return `
        <p>Hi ${name},</p>
        <p>Welcome to our platform! We are excited to have you.</p>
        <p>Let us know if you need any help.</p>
      `;
    }
  }
  