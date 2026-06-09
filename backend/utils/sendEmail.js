const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  // No SMTP configured yet — print to the console so the flow still works in dev
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n[DEV] Email not configured — printing instead of sending:");
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body:    ${text || html}\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;