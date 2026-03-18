import { Resend } from 'resend'
import { welcomeEmailHTML, supabaseVerifyEmailHTML, snapshotPurchasedEmailHTML } from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'SaintSal™ Labs <support@cookin.io>'
const REPLY_TO = 'support@cookin.io'

/* ─── Send welcome email on signup / upgrade ─── */
export async function sendWelcomeEmail(to: string, name: string, tier: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    reply_to: REPLY_TO,
    to,
    subject: tier === 'free'
      ? 'Welcome to SaintSal™ Labs — Your Account Is Live'
      : `You're on ${tier.charAt(0).toUpperCase() + tier.slice(1)} — Let's Build 🔥`,
    html: welcomeEmailHTML(name, tier),
  })
}

/* ─── Send OTP / verify email (called from Supabase custom SMTP or API) ─── */
export async function sendVerifyEmail(to: string, otpCode: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    reply_to: REPLY_TO,
    to,
    subject: 'Your SaintSal™ Labs Verification Code',
    html: supabaseVerifyEmailHTML(otpCode),
  })
}

/* ─── Send snapshot purchase confirmation ─── */
export async function sendSnapshotEmail(to: string, name: string, snapshotKey: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    reply_to: REPLY_TO,
    to,
    subject: 'Your SaintSal™ Snapshot Is Being Deployed',
    html: snapshotPurchasedEmailHTML(name, snapshotKey),
  })
}
