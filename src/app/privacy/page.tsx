import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SaintSal™ Labs',
  description: 'Privacy Policy for SaintSal™ Labs. GDPR, CCPA, and AI usage disclosure.',
};

const GOLD = '#D4AF37';


const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 48 }}>
    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: GOLD, marginBottom: 16 }}>
      {title}
    </h2>
    <div style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.65)' }}>
      {children}
    </div>
  </div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: 14 }}>{children}</p>
);

const UL = ({ items }: { items: string[] }) => (
  <ul style={{ marginLeft: 24, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
    {items.map((item, i) => (
      <li key={i} style={{ color: 'rgba(255,255,255,0.55)', listStyleType: 'none', display: 'flex', gap: 10 }}>
        <span style={{ color: GOLD, flexShrink: 0 }}>·</span>{item}
      </li>
    ))}
  </ul>
);

export default function PrivacyPage() {
  const lastUpdated = 'March 16, 2026';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Public+Sans:wght@400;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:#080808;color:white;font-family:'Public Sans',sans-serif;}
        a{color:#D4AF37;text-decoration:none;}
        a:hover{text-decoration:underline;}
        strong{color:rgba(255,255,255,0.85);}
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.12)', padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 3, background: 'linear-gradient(135deg,#D4AF37,#F3D06D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SaintSal™ Labs
        </Link>
        <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>← Back to Home</Link>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 48px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: GOLD, marginBottom: 12, opacity: 0.7 }}>Legal</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, lineHeight: 0.92, letterSpacing: 2, marginBottom: 20 }}>
            PRIVACY<br /><span style={{ color: GOLD }}>POLICY</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
            Effective Date: {lastUpdated} &nbsp;·&nbsp; Last Updated: {lastUpdated}
          </p>
          <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            <strong>Saint Vision Technologies LLC</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates SaintSal™ Labs at{' '}
            <a href="https://saintsallabs.com">saintsallabs.com</a> and the SaintSal™ Labs iOS/Android application. This Privacy Policy explains how we collect, use, disclose, and protect your information.
          </div>
        </div>

        <Section title="1. Company Information">
          <P><strong>Saint Vision Technologies LLC</strong><br />
          221 Main Street, Suite J<br />
          Huntington Beach, CA 92648<br />
          United States</P>
          <P>Email: <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a><br />
          Privacy Contact: <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a></P>
        </Section>

        <Section title="2. Information We Collect">
          <P><strong>Information you provide directly:</strong></P>
          <UL items={[
            'Account registration: name, email address, password',
            'Business profile: company name, industry, business goals (Business DNA)',
            'Payment information: processed securely via Stripe — we never store card numbers',
            'Communications: messages sent through our platform, support requests',
          ]} />
          <P><strong>Information collected automatically:</strong></P>
          <UL items={[
            'Usage data: screens visited, features used, session duration',
            'Device information: device type, OS version, app version',
            'IP address and approximate location (country/city level)',
            'Compute usage: AI generation minutes consumed per session',
            'UTM parameters: marketing attribution data (source, medium, campaign)',
          ]} />
          <P><strong>AI conversation data:</strong></P>
          <UL items={[
            'Messages you send to our AI systems (Claude, GPT, Gemini, Grok)',
            'AI-generated responses and content you create',
            'Builder projects, saved builds, and version history',
            'Vertical preferences and conversation history per vertical',
          ]} />
        </Section>

        <Section title="3. How We Use Your Information">
          <UL items={[
            'Provide, operate, and improve SaintSal™ Labs services',
            'Process payments and manage subscriptions via Stripe',
            'Deliver AI-powered responses using third-party AI providers',
            'Track and enforce compute minute quotas and tier limits',
            'Send transactional emails (receipts, security alerts, plan changes)',
            'Send marketing communications (only with your consent)',
            'Analyze aggregate usage patterns to improve the platform',
            'Comply with legal obligations and enforce our Terms of Service',
            'Prevent fraud, abuse, and unauthorized access',
          ]} />
        </Section>

        <Section title="4. AI Usage Disclosure">
          <P>
            SaintSal™ Labs routes your conversations to multiple third-party AI providers depending on your plan tier and selected vertical. By using our platform, you acknowledge:
          </P>
          <UL items={[
            'Free/Starter tier: messages processed by Google Gemini 2.0 Flash',
            'Pro/Teams tier: messages processed by Anthropic Claude (claude-sonnet-4-6)',
            'Enterprise tier: messages processed by Anthropic Claude (claude-opus-4-6)',
            'Global Intelligence vertical: messages processed by xAI Grok',
            'Search queries: processed by Perplexity, Tavily, and/or Exa',
            'Voice features: audio processed by ElevenLabs',
            'Image generation: processed by OpenAI DALL-E 3',
          ]} />
          <P>
            <strong>Important:</strong> Do not share sensitive personal information, protected health information (PHI), confidential business secrets, or personally identifiable financial information in AI conversations unless you have a signed Business Associate Agreement (BAA) with us (available on Enterprise plans).
          </P>
          <P>
            AI conversations may be used by third-party AI providers to improve their models unless you are on an Enterprise plan with data processing agreements in place. See each provider's privacy policy for details.
          </P>
        </Section>

        <Section title="5. Data Sharing & Third Parties">
          <P>We do not sell your personal data. We share data only with:</P>
          <UL items={[
            'Supabase — database and authentication (data stored in US-East)',
            'Stripe — payment processing and subscription management',
            'Anthropic — AI message processing (Claude models)',
            'Google — AI processing (Gemini), Analytics (GA4), Maps API',
            'xAI — AI message processing (Grok models)',
            'OpenAI — AI message processing, image generation (DALL-E 3)',
            'ElevenLabs — voice synthesis and audio processing',
            'Perplexity / Tavily / Exa — search and research queries',
            'Alpaca Markets — financial data queries (read-only)',
            'RentCast / PropertyAPI — real estate data queries',
            'Twilio — SMS and voice communication features',
            'GoHighLevel (GHL) — CRM integration (only for GHL Bridge users)',
            'Apollo.io — contact enrichment (only for GHL Bridge users)',
          ]} />
          <P>We may disclose information if required by law, court order, or to protect the rights, property, or safety of Saint Vision Technologies LLC, our users, or the public.</P>
        </Section>

        <Section title="6. GDPR — European Users">
          <P>If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR):</P>
          <UL items={[
            'Right of Access — request a copy of your personal data',
            'Right to Rectification — correct inaccurate or incomplete data',
            'Right to Erasure ("Right to be Forgotten") — request deletion of your data',
            'Right to Data Portability — receive your data in a machine-readable format',
            'Right to Object — object to processing based on legitimate interests',
            'Right to Restrict Processing — limit how we use your data',
            'Right to Withdraw Consent — withdraw consent at any time',
          ]} />
          <P>Our lawful basis for processing: <strong>contract performance</strong> (providing the service), <strong>legitimate interests</strong> (security, fraud prevention, analytics), and <strong>consent</strong> (marketing communications).</P>
          <P>To exercise any GDPR right, contact us at <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a>. We will respond within 30 days.</P>
          <P>Data transfers outside the EEA are covered by Standard Contractual Clauses (SCCs) where applicable.</P>
        </Section>

        <Section title="7. CCPA — California Residents">
          <P>Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to:</P>
          <UL items={[
            'Know what personal information we collect and how it is used',
            'Delete personal information we have collected about you',
            'Opt out of the "sale" or "sharing" of personal information — we do not sell or share your data for cross-context behavioral advertising',
            'Non-discrimination — we will not discriminate against you for exercising CCPA rights',
            'Correct inaccurate personal information',
            'Limit use of sensitive personal information',
          ]} />
          <P>To submit a CCPA request: email <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a> with subject line "CCPA Request." We will verify your identity and respond within 45 days.</P>
          <P><strong>Categories of personal information collected:</strong> identifiers, commercial information, internet/network activity, geolocation data, inferences from usage data.</P>
        </Section>

        <Section title="8. Data Retention">
          <UL items={[
            'Account data: retained while your account is active, deleted within 90 days of account deletion request',
            'AI conversation history: retained for 12 months, then anonymized',
            'Payment records: retained for 7 years per financial regulations',
            'Usage/analytics data: retained in aggregate form indefinitely',
            'Support communications: retained for 3 years',
          ]} />
        </Section>

        <Section title="9. Security">
          <P>We implement industry-standard security measures including:</P>
          <UL items={[
            'TLS 1.3 encryption for all data in transit',
            'AES-256 encryption for data at rest via Supabase',
            'Row-level security (RLS) — users can only access their own data',
            'Supabase Auth with JWT tokens and secure session management',
            'No plaintext storage of passwords or API keys',
            'Regular security audits and penetration testing',
          ]} />
          <P>No system is 100% secure. If you discover a security vulnerability, please report it responsibly to <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a>.</P>
        </Section>

        <Section title="10. Cookies & Tracking">
          <P>We use:</P>
          <UL items={[
            'Essential cookies: authentication sessions, CSRF protection',
            'Analytics cookies: Google Analytics 4 (GA4) for aggregate usage statistics',
            'Marketing attribution: UTM parameters stored in sessionStorage (not cookies)',
            'No third-party advertising cookies or cross-site tracking',
          ]} />
          <P>You can disable non-essential cookies in your browser settings without affecting core functionality.</P>
        </Section>

        <Section title="11. Children's Privacy">
          <P>SaintSal™ Labs is not directed to children under 13 (or under 16 in the EEA). We do not knowingly collect personal information from children. If you believe a child has provided us personal information, contact <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a> and we will promptly delete it.</P>
        </Section>

        <Section title="12. Changes to This Policy">
          <P>We may update this Privacy Policy periodically. We will notify you of material changes via email and/or a prominent notice on our platform at least 30 days before changes take effect. Continued use after the effective date constitutes acceptance.</P>
        </Section>

        <Section title="13. Contact Us">
          <P>For any privacy questions, requests, or concerns:</P>
          <div style={{ padding: '20px 24px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'white' }}>Saint Vision Technologies LLC</strong><br />
            Attn: Privacy Officer<br />
            221 Main Street, Suite J<br />
            Huntington Beach, CA 92648<br />
            <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a>
          </div>
        </Section>

        {/* Footer links */}
        <div style={{ borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/">← Home</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <a href="mailto:legal@saintsallabs.com">Contact Legal</a>
        </div>
      </main>
    </>
  );
}
