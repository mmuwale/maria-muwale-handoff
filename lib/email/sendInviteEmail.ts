import { sendMail } from "./sendMail";
import { getSiteUrl } from "@/lib/env/getSiteUrl";

export async function sendInviteEmail(input: { to: string; name: string; token: string }) {
  const url = `${getSiteUrl()}/admin/invite/${input.token}`;

  await sendMail({
    to: input.to,
    subject: "You've been invited to the Maria Muwale feedback admin",
    text: `Hi ${input.name},\n\nYou've been added as a feedback admin. Set your password to activate your account:\n${url}\n\nThis link expires in 48 hours.`,
    html: `
      <p>Hi ${input.name},</p>
      <p>You've been added as a feedback admin. Set your password to activate your account:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires in 48 hours.</p>
    `,
  });
}
