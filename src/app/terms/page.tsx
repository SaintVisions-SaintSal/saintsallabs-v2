import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — SaintSal™ Labs',
  description: 'Terms of Service for SaintSal™ Labs by Saint Vision Technologies LLC.',
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

export default function TermsPage() {
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

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 48px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: GOLD, marginBottom: 12, opacity: 0.7 }}>Legal</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, lineHeight: 0.92, letterSpacing: 2, marginBottom: 20 }}>
            TERMS OF<br /><span style={{ color: GOLD }}>SERVICE</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
            Effective Date: {lastUpdated} &nbsp;·&nbsp; Last Updated: {lastUpdated}
          </p>
          <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            These Terms of Service ("Terms") govern your access to and use of SaintSal™ Labs services operated by <strong>Saint Vision Technologies LLC</strong>. By creating an account or using our services, you agree to these Terms. If you do not agree, do not use our services.
          </div>
        </div>

        <Section title="1. Acceptance of Terms">
          <P>By accessing or using SaintSal™ Labs (saintsallabs.com, the iOS app, or any related services), you agree to be bound by these Terms and our <Link href="/privacy">Privacy Policy</Link>. These Terms constitute a legally binding agreement between you and Saint Vision Technologies LLC.</P>
          <P>If you are using the service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</P>
        </Section>

        <Section title="2. Description of Service">
          <P>SaintSal™ Labs is an AI intelligence platform providing:</P>
          <UL items={[
            'Multi-model AI chat across 9 intelligence verticals (Real Estate, Finance, Sports, Medical, Legal, Tech, Creative, News, GHL)',
            'AI Builder for generating websites, apps, and code',
            'Social Studio for AI-generated social media content',
            'GHL Smart Bridge for GoHighLevel CRM integration',
            'Voice AI powered by ElevenLabs',
            'Image generation powered by DALL-E 3',
            'Real estate data via RentCast and PropertyAPI',
            'Financial data via Alpaca Markets',
            'GHL Snapshot Systems (done-for-you GoHighLevel automations)',
          ]} />
          <P>Services are protected by US Patent #10,290,222 (HACP™ Protocol).</P>
        </Section>

        <Section title="3. Account Registration">
          <P>To access paid features, you must create an account. You agree to:</P>
          <UL items={[
            'Provide accurate, current, and complete information',
            'Maintain the security of your password and account credentials',
            'Notify us immediately of any unauthorized access at legal@saintsallabs.com',
            'Be responsible for all activities that occur under your account',
            'Not share your account with others or create multiple accounts to circumvent limits',
          ]} />
          <P>You must be at least 18 years old to create an account.</P>
        </Section>

        <Section title="4. Subscription Plans & Billing">
          <P><strong>Plans:</strong> Free, Starter ($27/mo), Pro ($97/mo), Teams, Enterprise ($497/mo). Annual plans available at discounted rates.</P>
          <P><strong>Billing:</strong> Subscriptions are billed monthly or annually in advance via Stripe. By subscribing, you authorize recurring charges to your payment method.</P>
          <P><strong>Compute Minutes:</strong> Each plan includes a monthly compute minute allotment. Unused minutes do not roll over. Exceeding your allotment may restrict AI generation features until the next billing cycle.</P>
          <P><strong>Cancellation:</strong> You may cancel at any time. Your access continues through the end of your current billing period. No refunds for partial periods.</P>
          <P><strong>Refunds:</strong> Refunds are issued at our discretion within 7 days of initial purchase if you have not materially used the service. GHL Snapshot purchases are non-refundable once the snapshot has been delivered to your GHL account.</P>
          <P><strong>Price Changes:</strong> We reserve the right to change prices with 30 days notice. Continued use after the notice period constitutes acceptance.</P>
        </Section>

        <Section title="5. Acceptable Use">
          <P>You agree NOT to use SaintSal™ Labs to:</P>
          <UL items={[
            'Generate, distribute, or promote illegal content of any kind',
            'Create content that harasses, threatens, or defames any person',
            'Generate spam, phishing content, or deceptive marketing materials',
            'Attempt to circumvent compute limits, tier restrictions, or billing systems',
            'Reverse engineer, decompile, or attempt to extract source code',
            'Use our services to compete with or replicate our platform',
            'Scrape or systematically extract data from our platform',
            'Violate any applicable law or regulation',
            'Impersonate any person, company, or entity',
            'Generate content that infringes on third-party intellectual property',
            'Use the Medical vertical for actual clinical diagnosis or treatment decisions',
            'Transmit malware, viruses, or other harmful code',
          ]} />
          <P>We reserve the right to suspend or terminate accounts that violate these restrictions without notice or refund.</P>
        </Section>

        <Section title="6. AI-Generated Content">
          <P><strong>Ownership:</strong> Content you create using our AI tools is owned by you, subject to the terms of the underlying AI providers (Anthropic, OpenAI, Google, xAI). You are responsible for reviewing and ensuring AI-generated content is accurate before using it.</P>
          <P><strong>Accuracy Disclaimer:</strong> AI-generated content may contain errors, outdated information, or hallucinations. SaintSal™ Labs does not warrant the accuracy, completeness, or fitness for purpose of any AI-generated content.</P>
          <P><strong>Medical Disclaimer:</strong> The Medical vertical is for informational and research purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider.</P>
          <P><strong>Financial Disclaimer:</strong> The Finance vertical is for informational purposes only. Nothing constitutes investment advice. Past performance is not indicative of future results. Consult a licensed financial advisor.</P>
          <P><strong>Legal Disclaimer:</strong> AI-generated legal content does not constitute legal advice. Consult a licensed attorney for legal matters.</P>
        </Section>

        <Section title="7. Intellectual Property">
          <P><strong>Our IP:</strong> SaintSal™ Labs, the HACP™ Protocol, our software, designs, trademarks, and content are owned by Saint Vision Technologies LLC and protected by US Patent #10,290,222, copyright law, and trade secret law. You receive a limited, non-exclusive, non-transferable license to use our services.</P>
          <P><strong>Your IP:</strong> You retain ownership of content you provide as input to our services. You grant us a limited license to process your content solely to provide the service.</P>
          <P><strong>Feedback:</strong> If you provide feedback or suggestions, you grant us the right to use that feedback without restriction or compensation.</P>
        </Section>

        <Section title="8. Third-Party Integrations">
          <P>Our service integrates with third-party providers including GoHighLevel, Stripe, Supabase, Alpaca, RentCast, and others. Your use of integrated services is subject to those providers' own terms and privacy policies. We are not responsible for third-party service outages, errors, or changes in their terms.</P>
          <P><strong>GHL Integration:</strong> By connecting your GoHighLevel account, you authorize us to access and interact with your GHL data on your behalf. You are responsible for complying with GHL's terms of service.</P>
        </Section>

        <Section title="9. CookinPartners™ Affiliate Program">
          <P>By joining CookinPartners™, you agree to:</P>
          <UL items={[
            'Promote SaintSal™ Labs honestly and accurately',
            'Not use spam, misleading claims, or deceptive marketing tactics',
            'Disclose your affiliate relationship in all promotional content (FTC requirement)',
            'Receive 15% recurring commission on referred active subscriptions',
            'Commissions paid monthly via Stripe, minimum $25 threshold',
            'Forfeit commissions if your account is terminated for policy violations',
          ]} />
        </Section>

        <Section title="10. Limitation of Liability">
          <P>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAINT VISION TECHNOLOGIES LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.</P>
          <P>OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</P>
        </Section>

        <Section title="11. Disclaimers">
          <P>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</P>
          <P>We do not warrant that the service will be uninterrupted, error-free, or free of viruses. We do not guarantee the accuracy of AI-generated content.</P>
        </Section>

        <Section title="12. Indemnification">
          <P>You agree to indemnify, defend, and hold harmless Saint Vision Technologies LLC and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the service, violation of these Terms, or infringement of any third-party rights.</P>
        </Section>

        <Section title="13. Governing Law & Disputes">
          <P>These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Orange County, California.</P>
          <P><strong>Arbitration:</strong> For claims under $10,000, disputes will be resolved through binding arbitration under JAMS rules, conducted in Orange County, CA. Class action waiver applies — you may not bring claims as a class or representative action.</P>
        </Section>

        <Section title="14. Termination">
          <P>We may suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or for any reason with 30 days notice (except for violations, which may result in immediate termination).</P>
          <P>Upon termination, your right to use the service ceases immediately. You may request export of your data within 30 days of termination.</P>
        </Section>

        <Section title="15. Changes to Terms">
          <P>We may update these Terms from time to time. We will notify you of material changes via email at least 30 days before they take effect. Continued use after the effective date constitutes acceptance of the updated Terms.</P>
        </Section>

        <Section title="16. Contact">
          <div style={{ padding: '20px 24px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, fontSize: 14, lineHeight: 1.8 }}>
            <strong style={{ color: 'white' }}>Saint Vision Technologies LLC</strong><br />
            221 Main Street, Suite J<br />
            Huntington Beach, CA 92648<br />
            <a href="mailto:legal@saintsallabs.com">legal@saintsallabs.com</a>
          </div>
        </Section>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/">← Home</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="mailto:legal@saintsallabs.com">Contact Legal</a>
        </div>
      </main>
    </>
  );
}
