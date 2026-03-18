/* ═══════════════════════════════════════════════════════════
   SUPABASE AUTH HOOK — SEND EMAIL
   Intercepts every auth email (OTP, magic link, recovery)
   and sends our fully-branded Resend email instead.

   Register in: Supabase Dashboard → Auth → Hooks → Send Email
   URL: https://saintsallabs.com/api/auth/email-hook
   Secret: value of SUPABASE_HOOK_SECRET env var
═══════════════════════════════════════════════════════════ */
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseVerifyEmailHTML, welcomeEmailHTML } from '@/lib/email/templates'

const getResend = () => new Resend(process.env.RESEND_API_KEY)
const FROM    = 'SaintSal™ Labs <support@cookin.io>'
const REPLY_TO = 'support@cookin.io'
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://saintsallabs.com'

const GOLD = '#D4AF37'
const BG   = '#0a0a0a'
const CARD = '#111111'
const MUTED = '#888888'

/* ─── Build magic-link email HTML ─── */
function magicLinkHTML(confirmUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>SaintSal™ Labs</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#111111,#0a0a0a);border:1px solid rgba(212,175,55,0.2);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${GOLD};margin-bottom:12px;">SaintSal™ Labs</div>
        <div style="font-size:36px;font-weight:900;color:white;letter-spacing:-1px;line-height:1.1;">YOUR GOTTA GUY™</div>
        <div style="font-size:13px;color:${MUTED};margin-top:8px;letter-spacing:2px;text-transform:uppercase;">Responsible Intelligence™ · Patent #10,290,222</div>
      </td></tr>
      <tr><td style="background:${CARD};border:1px solid rgba(212,175,55,0.1);border-top:none;border-radius:0 0 16px 16px;padding:40px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:22px;font-weight:800;color:white;margin-bottom:8px;">Sign In to SaintSal™ Labs</div>
          <div style="font-size:14px;color:${MUTED};line-height:1.7;">Click the button below to securely sign in. This link expires in 1 hour.</div>
        </div>
        <div style="text-align:center;margin:32px 0;">
          <a href="${confirmUrl}" style="background:linear-gradient(135deg,${GOLD},#8A7129);color:#080808;text-decoration:none;padding:18px 48px;border-radius:10px;font-size:16px;font-weight:900;letter-spacing:1px;display:inline-block;">
            Sign In to SAL Labs →
          </a>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;margin-bottom:24px;text-align:center;">
          <div style="font-size:12px;color:${MUTED};">If the button doesn't work, copy this link: <span style="color:white;word-break:break-all;">${confirmUrl}</span></div>
        </div>
        <div style="font-size:13px;color:${MUTED};text-align:center;line-height:1.7;">
          If you didn't request this, you can safely ignore this email.
        </div>
      </td></tr>
      <tr><td style="padding:24px 0;text-align:center;">
        <div style="font-size:11px;color:${MUTED};line-height:1.8;">
          © 2026 Saint Vision Technologies LLC · All rights reserved<br/>
          US Patent #10,290,222 · <a href="https://saintsallabs.com/privacy" style="color:${GOLD};text-decoration:none;">Privacy</a> · <a href="https://saintsallabs.com/terms" style="color:${GOLD};text-decoration:none;">Terms</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}

/* ─── Build password reset email HTML ─── */
function recoveryHTML(confirmUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>SaintSal™ Labs</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#111111,#0a0a0a);border:1px solid rgba(212,175,55,0.2);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${GOLD};margin-bottom:12px;">SaintSal™ Labs</div>
        <div style="font-size:36px;font-weight:900;color:white;letter-spacing:-1px;line-height:1.1;">YOUR GOTTA GUY™</div>
      </td></tr>
      <tr><td style="background:${CARD};border:1px solid rgba(212,175,55,0.1);border-top:none;border-radius:0 0 16px 16px;padding:40px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:22px;font-weight:800;color:white;margin-bottom:8px;">Reset Your Password</div>
          <div style="font-size:14px;color:${MUTED};line-height:1.7;">We received a request to reset your SaintSal™ Labs password. Click below to set a new one.</div>
        </div>
        <div style="text-align:center;margin:32px 0;">
          <a href="${confirmUrl}" style="background:linear-gradient(135deg,${GOLD},#8A7129);color:#080808;text-decoration:none;padding:18px 48px;border-radius:10px;font-size:16px;font-weight:900;letter-spacing:1px;display:inline-block;">
            Reset Password →
          </a>
        </div>
        <div style="font-size:13px;color:${MUTED};text-align:center;line-height:1.7;">
          This link expires in 1 hour. If you didn't request a reset, ignore this email — your account is safe.
        </div>
      </td></tr>
      <tr><td style="padding:24px 0;text-align:center;">
        <div style="font-size:11px;color:${MUTED};line-height:1.8;">
          © 2026 Saint Vision Technologies LLC · All rights reserved
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}

/* ─── POST — Supabase calls this for every auth email ─── */
export async function POST(req: NextRequest) {
  // Verify the hook secret so only Supabase can call this
  const hookSecret = process.env.SUPABASE_HOOK_SECRET
  if (hookSecret) {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.replace('Bearer ', '')
    if (token !== hookSecret) {
      console.warn('[email-hook] Unauthorized — bad hook secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: {
    user?: { email?: string; user_metadata?: { full_name?: string; name?: string } }
    email_data?: {
      token?: string
      token_hash?: string
      redirect_to?: string
      email_action_type?: string
      site_url?: string
    }
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 })
  }

  const email     = body.user?.email
  const emailData = body.email_data
  const actionType = emailData?.email_action_type ?? 'signup'
  const token      = emailData?.token ?? ''

  if (!email) {
    return NextResponse.json({ error: 'No email in payload' }, { status: 400 })
  }

  const name = body.user?.user_metadata?.full_name
    || body.user?.user_metadata?.name
    || email.split('@')[0]

  try {
    if (actionType === 'signup' || actionType === 'email_change') {
      // OTP verification code
      await getResend().emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: 'Your SaintSal™ Labs Verification Code',
        html: supabaseVerifyEmailHTML(token),
      })

      // Also fire welcome email alongside the OTP for new signups
      if (actionType === 'signup') {
        // Fire async — don't await so hook returns fast
        getResend().emails.send({
          from: FROM,
          replyTo: REPLY_TO,
          to: email,
          subject: 'Welcome to SaintSal™ Labs 🔥',
          html: welcomeEmailHTML(name, 'free'),
        }).catch(() => {})
      }

    } else if (actionType === 'magic_link') {
      // Build the magic link URL from the token_hash
      const tokenHash = emailData?.token_hash ?? ''
      const confirmUrl = `${emailData?.site_url ?? APP_URL}/auth/v1/verify?token=${tokenHash}&type=magiclink&redirect_to=${encodeURIComponent(emailData?.redirect_to ?? APP_URL + '/chat/search')}`

      await getResend().emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: 'Your SaintSal™ Labs Sign-In Link',
        html: magicLinkHTML(confirmUrl),
      })

    } else if (actionType === 'recovery') {
      const tokenHash = emailData?.token_hash ?? ''
      const confirmUrl = `${emailData?.site_url ?? APP_URL}/auth/v1/verify?token=${tokenHash}&type=recovery&redirect_to=${encodeURIComponent(APP_URL + '/reset-password')}`

      await getResend().emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: 'Reset Your SaintSal™ Labs Password',
        html: recoveryHTML(confirmUrl),
      })

    } else if (actionType === 'invite') {
      const tokenHash = emailData?.token_hash ?? ''
      const confirmUrl = `${emailData?.site_url ?? APP_URL}/auth/v1/verify?token=${tokenHash}&type=invite&redirect_to=${encodeURIComponent(APP_URL + '/chat/search')}`

      await getResend().emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: email,
        subject: "You've been invited to SaintSal™ Labs",
        html: magicLinkHTML(confirmUrl),
      })
    }

    console.log(`[email-hook] Sent ${actionType} email to ${email}`)
    // Supabase requires an empty 200 response to acknowledge
    return NextResponse.json({})

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[email-hook] Resend error:', msg)
    // Still return 200 so Supabase doesn't retry/block auth
    return NextResponse.json({ warning: msg })
  }
}
