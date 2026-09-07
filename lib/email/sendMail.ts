import nodemailer from "nodemailer";

/** Created lazily, not at module load - keeps a missing/broken SMTP config
 *  from crashing every server start, only the requests that actually send. */
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 587),
    secure: process.env.MAIL_ENCRYPTION === "ssl",
    auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD },
  });

  return transporter;
}

export async function sendMail(input: { to: string; subject: string; html: string; text: string }) {
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM_ADDRESS,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
