import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to, subject, htmlContent) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", result.response);
      return true;
    } catch (error) {
      console.error("Email sending error:", error);
      return false;
    }
  }
}

export default new EmailService();
