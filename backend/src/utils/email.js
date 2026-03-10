const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

async function sendEmail({ to, subject, html }) {
  if (!to) return;
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@sociosphere.local',
    to,
    subject,
    html,
  });
}

async function sendMaintenanceBillEmail(user, payment) {
  await sendEmail({
    to: user.email,
    subject: 'Maintenance Bill Notification',
    html: `<p>Dear ${user.name}, your maintenance bill of ${payment.amount} is due on ${payment.due_date}.</p>`,
  });
}

async function sendPaymentReceiptEmail(user, payment) {
  await sendEmail({
    to: user.email,
    subject: 'Payment Receipt',
    html: `<p>Dear ${user.name}, we received your payment of ${payment.amount}. Thank you.</p>`,
  });
}

async function sendVisitorApprovalRequestEmail(resident, visitor) {
  await sendEmail({
    to: resident.email,
    subject: 'Visitor Approval Request',
    html: `<p>${visitor.name} is requesting to visit you. Please approve in the app.</p>`,
  });
}

async function sendPasswordResetEmail(user, token) {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Use this token to reset your password: ${token}</p>`,
  });
}

module.exports = {
  sendEmail,
  sendMaintenanceBillEmail,
  sendPaymentReceiptEmail,
  sendVisitorApprovalRequestEmail,
  sendPasswordResetEmail,
};

