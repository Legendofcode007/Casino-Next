import nodemailer from "nodemailer";

export const forgetPwdMail = async (email: string, token: string) => {
  const resetLink =
    process.env.HOST +
    "/reset-password?token=" +
    encodeURIComponent(token) +
    "&email=" +
    email;

  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: true,
  });

  const send = await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Chanel Casino: Your Reset Password Link",
    html:
      '<p>Click on the link below to reset your password:</p><p><h3><a href="' +
      resetLink +
      '"><u>PASSWORD RESET LINK</u></a></h3></p>',
  });

  return "Message sent: %s", send.response;
};
