/* ─── SaintSal Labs — Branded Email Templates ──────────────── */
/* APP_URL always resolves to saintsallabs.com — never saintsal.ai  */
/* app.saintsal.ai is GHL white-label CRM only — intentionally kept */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://saintsallabs.com';
const GOLD = '#D4AF37';
const BG = '#0a0a0a';
const CARD = '#111111';
const TEXT = '#e5e5e5'; // eslint-disable-line @typescript-eslint/no-unused-vars
const MUTED = '#888888';

const TIER_CONFIG: Record<string, { label: string; price: string; credits: string; features: string[] }> = {
  free: {
    label: 'Free',
    price: '$0',
    credits: '100 compute min/mo',
    features: ['Basic AI chat across all verticals', '3 builder runs/day', 'Community support'],
  },
  starter: {
    label: 'Starter',
    price: '$27/mo',
    credits: '500 compute min/mo',
    features: ['GHL Basic Bridge access', 'Save up to 5 builds', 'Standard GHL snapshots', 'Email support'],
  },
  pro: {
    label: 'Pro',
    price: '$97/mo',
    credits: '2,000 compute min/mo',
    features: [
      'Full GHL Bridge + FREE Pro workflows auto-installed',
      'SaintSal™ AI + Labs — full access',
      'Image + video + voice generation',
      'Premium GHL Snapshots',
      'Priority support',
    ],
  },
  teams: {
    label: 'Teams',
    price: '$297/mo',
    credits: '10,000 compute min/mo',
    features: [
      'Everything in Pro',
      'Up to 5 team seats',
      'SAL Max AI (Claude Opus)',
      'Team workspace + shared builds',
      'Dedicated Slack channel',
    ],
  },
  enterprise: {
    label: 'Enterprise',
    price: '$497/mo',
    credits: 'Unlimited compute',
    features: [
      'Everything in Teams',
      'White-glove onboarding call',
      'Custom GHL snapshot build',
      'Dedicated SAL agent',
      'Custom integrations + SLA',
    ],
  },
};

function base(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>SaintSal™ Labs</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#111111,#0a0a0a);border:1px solid rgba(212,175,55,0.2);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${GOLD};margin-bottom:12px;">SaintSal™ Labs</div>
        <div style="font-size:36px;font-weight:900;color:white;letter-spacing:-1px;line-height:1.1;">YOUR GOTTA GUY™</div>
        <div style="font-size:13px;color:${MUTED};margin-top:8px;letter-spacing:2px;text-transform:uppercase;">Responsible Intelligence™ · Patent #10,290,222</div>
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:${CARD};border:1px solid rgba(212,175,55,0.1);border-top:none;border-radius:0 0 16px 16px;padding:40px;">
        ${content}
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:24px 0;text-align:center;">
        <div style="font-size:11px;color:${MUTED};line-height:1.8;">
          © 2026 Saint Vision Technologies LLC · All rights reserved<br/>
          US Patent #10,290,222 · <a href="https://saintsallabs.com/privacy" style="color:${GOLD};text-decoration:none;">Privacy</a> ·
          <a href="https://saintsallabs.com/terms" style="color:${GOLD};text-decoration:none;">Terms</a><br/>
          221 Main St Suite J, Huntington Beach, CA 92648
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/* ─── 1. Supabase Verification / OTP Email ──────────────────── */

export function supabaseVerifyEmailHTML(otpCode: string): string {
  return base(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:22px;font-weight:800;color:white;margin-bottom:8px;">Confirm Your Email</div>
      <div style="font-size:14px;color:${MUTED};line-height:1.7;">Enter this code in the browser tab to verify your account.</div>
    </div>

    <!-- OTP CODE BOX -->
    <div style="text-align:center;margin:32px 0;">
      <div style="display:inline-block;background:rgba(212,175,55,0.08);border:2px solid rgba(212,175,55,0.4);border-radius:12px;padding:24px 48px;">
        <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:${GOLD};font-family:'Courier New',monospace;">${otpCode}</div>
        <div style="font-size:11px;color:${MUTED};margin-top:8px;letter-spacing:2px;text-transform:uppercase;">6-Digit Verification Code</div>
      </div>
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;margin-bottom:24px;text-align:center;">
      <div style="font-size:12px;color:${MUTED};">Code expires in <strong style="color:white;">10 minutes</strong> · Do not share this code with anyone</div>
    </div>

    <div style="font-size:13px;color:${MUTED};text-align:center;line-height:1.7;">
      If you didn't sign up for SaintSal™ Labs, you can safely ignore this email.
    </div>
  `);
}

/* ─── 2. Welcome Email — fires immediately on checkout.session.completed ─ */

export function welcomeEmailHTML(name: string, tier: string): string {
  const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG.starter;
  const firstName = name?.split(' ')[0] || 'there';

  return base(`
    <div style="margin-bottom:28px;">
      <div style="font-size:22px;font-weight:800;color:white;margin-bottom:6px;">Welcome to SaintSal™ Labs, ${firstName}. 🔥</div>
      <div style="font-size:14px;color:${MUTED};line-height:1.7;">Your <strong style="color:${GOLD};">${cfg.label} plan</strong> is being activated right now. Two things are happening as you read this:</div>
    </div>

    <!-- WHAT'S HAPPENING -->
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:32px;">
      ${[
        ['1', 'Your GHL subaccount is being built', 'Check your inbox — you\'ll receive an invitation email to set your login at <strong style="color:white;">app.saintsal.ai</strong>'],
        ['2', 'Your SAL Labs account is live', `Log in now at <a href="${APP_URL}/login" style="color:${GOLD};text-decoration:none;">saintsallabs.com</a> with the email you used to purchase`],
      ].map(([n, title, desc]) => `
        <div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.15);border-radius:10px;padding:18px 20px;display:flex;gap:14px;">
          <div style="width:28px;height:28px;background:linear-gradient(135deg,${GOLD},#8A7129);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#080808;flex-shrink:0;line-height:28px;text-align:center;">${n}</div>
          <div>
            <div style="font-size:13px;font-weight:700;color:white;margin-bottom:4px;">${title}</div>
            <div style="font-size:12px;color:${MUTED};line-height:1.6;">${desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- PLAN DETAILS -->
    <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:24px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin-bottom:14px;">Your ${cfg.label} Plan — ${cfg.price}</div>
      <div style="font-size:12px;color:${MUTED};margin-bottom:12px;">${cfg.credits}</div>
      ${cfg.features.map(f => `
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
          <span style="color:${GOLD};font-weight:800;flex-shrink:0;">✓</span>
          <span style="font-size:13px;color:rgba(255,255,255,0.7);">${f}</span>
        </div>
      `).join('')}
    </div>

    <!-- GHL SETUP INSTRUCTIONS -->
    ${tier !== 'free' ? `
    <div style="background:#0F0F0F;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:28px;">
      <div style="font-size:14px;font-weight:700;color:white;margin-bottom:16px;">Setting Up Your GHL Account</div>
      ${[
        ['Check this email inbox', 'Look for an email titled "You\'ve been invited to SaintSal™" — this comes from GHL and contains your login link.'],
        ['Click the invitation link', 'This takes you to app.saintsal.ai where you\'ll set your GHL account password. This is your CRM login — save it.'],
        ['Your snapshots are pre-installed', tier === 'pro' || tier === 'teams' || tier === 'enterprise' ? 'Your included snapshot system has been cloned into your subaccount. Check your Pipelines and Workflows in GHL — everything is ready to go.' : 'Starter snapshots are available in the Snapshots section of your account.'],
        ['Connect your SAL AI', 'In your GHL dashboard, you\'ll find the SaintSal AI widget pre-configured. It\'s already talking to your CRM data.'],
      ].map(([title, desc], i) => `
        <div style="display:flex;gap:12px;margin-bottom:14px;${i < 3 ? 'padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.05);' : ''}">
          <div style="width:22px;height:22px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:50%;font-size:11px;font-weight:800;color:${GOLD};display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:22px;text-align:center;">${i + 1}</div>
          <div>
            <div style="font-size:12px;font-weight:700;color:white;margin-bottom:3px;">${title}</div>
            <div style="font-size:12px;color:${MUTED};line-height:1.6;">${desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- CTA BUTTONS -->
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;">
      <a href="${APP_URL}/login" style="background:linear-gradient(135deg,${GOLD},#8A7129);color:#080808;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:800;letter-spacing:1px;display:inline-block;">
        Open SAL Labs →
      </a>
      ${tier !== 'free' ? `<a href="https://app.saintsal.ai" style="background:transparent;color:${GOLD};text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:800;letter-spacing:1px;border:1px solid rgba(212,175,55,0.3);display:inline-block;">
        Open GHL CRM →
      </a>` : ''}
    </div>

    <div style="font-size:12px;color:${MUTED};line-height:1.8;">
      Questions? Reply to this email or reach us at <a href="mailto:support@saintsallabs.com" style="color:${GOLD};text-decoration:none;">support@saintsallabs.com</a><br/>
      Need DFY setup help? Book a call: <a href="https://saintsal.ai/book" style="color:${GOLD};text-decoration:none;">saintsal.ai/book</a>
    </div>
  `);
}

/* ─── 3. Snapshot Purchased Email ───────────────────────────── */

const SNAPSHOT_CONFIG: Record<string, { name: string; price: string; steps: string[] }> = {
  residential_lending: {
    name: 'Residential Lending Pro',
    price: '$797',
    steps: [
      'Check GHL → you\'ll find a new snapshot cloned into your account within 15 minutes',
      'Go to Pipelines — your full residential mortgage pipeline is live with 36+ workflows',
      'Activate your Voice AI: Settings → Phone Numbers → assign to the AI calling workflow',
      'Test with a fake lead using the "Test Lead" workflow button',
      'Book your DFY onboarding call below to customize the templates to your brand',
    ],
  },
  commercial_lending: {
    name: 'Commercial Lending Pro',
    price: '$997',
    steps: [
      'Your commercial deal pipeline + broker CRM is being cloned into your GHL account',
      'Review the Term Sheet automation in Workflows — it auto-generates from deal data',
      'Connect your email in Settings → Email for the SAL AI underwriting assistant',
      'Book your onboarding call to customize for your deal types',
    ],
  },
  ceo_pro: {
    name: 'CEO Pro System',
    price: '$1,297',
    steps: [
      'Your CEO command center is being deployed to your GHL subaccount',
      'Daily briefings start tomorrow morning — SAL will email you a business summary each day',
      'Add your team in GHL → Settings → Team Members',
      'Connect your revenue sources in the Custom Fields section',
      'Book your strategy call — we\'ll configure your KPI dashboard live',
    ],
  },
  cookin_cards: {
    name: 'CookinCards™',
    price: '$797',
    steps: [
      'Your Pokemon & sports card AI system is being deployed',
      'The eBay deal engine is pre-connected — enter your eBay credentials in Integrations',
      'PSA grading tracker is in your Dashboard widgets — start scanning cards',
      'Book your setup call to connect your inventory source',
    ],
  },
};

export function snapshotPurchasedEmailHTML(name: string, snapshotKey: string): string {
  const snap = SNAPSHOT_CONFIG[snapshotKey];
  const firstName = name?.split(' ')[0] || 'there';
  if (!snap) return welcomeEmailHTML(name, 'pro');

  return base(`
    <div style="margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin-bottom:10px;">Snapshot Purchase Confirmed · ${snap.price}</div>
      <div style="font-size:22px;font-weight:800;color:white;margin-bottom:8px;">Your ${snap.name} is being deployed, ${firstName}.</div>
      <div style="font-size:14px;color:${MUTED};line-height:1.7;">This is a Done-For-You system. Here's exactly what to do next:</div>
    </div>

    <div style="margin-bottom:28px;">
      ${snap.steps.map((step, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;padding:14px;background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.1);border-radius:8px;">
          <div style="width:26px;height:26px;background:linear-gradient(135deg,${GOLD},#8A7129);border-radius:50%;font-size:11px;font-weight:900;color:#080808;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:26px;text-align:center;">${i + 1}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6;">${step}</div>
        </div>
      `).join('')}
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://saintsal.ai/book" style="background:linear-gradient(135deg,${GOLD},#8A7129);color:#080808;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:15px;font-weight:900;letter-spacing:1px;display:inline-block;">
        Book DFY Onboarding Call →
      </a>
    </div>

    <div style="font-size:12px;color:${MUTED};text-align:center;line-height:1.8;">
      Your system will be ready in your GHL account within 15–30 minutes.<br/>
      Questions? <a href="mailto:support@saintsallabs.com" style="color:${GOLD};text-decoration:none;">support@saintsallabs.com</a>
    </div>
  `);
}
