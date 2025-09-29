import nodemailer from "nodemailer";

// Tạo transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: "nvh11103@gmail.com",
    pass: "xfcpmdydityxlwef", // App Password không dấu cách
  },
});


/**
 * Gửi OTP qua email
 * @param {string} email - Email người nhận
 * @param {string} otp - Mã OTP
 */
export async function sendOtpEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: '"Shop Online" <nvh11103@gmail.com>',
      to: email,
      subject: "Mã OTP xác thực đăng ký",
      text: `Mã OTP của bạn là: ${otp}. OTP có hiệu lực trong 5 phút.`,
    });
    console.log(`OTP đã gửi đến ${email}: ${otp}`);
  } catch (error) {
    console.error(`Gửi OTP thất bại đến ${email}:`, error.message);
    throw new Error("Gửi OTP thất bại, vui lòng thử lại sau.");
  }
}
