/* ─── GHL SaaS Integration Helpers ─────────────────────────── */
/* Uses GHL v1 REST API for webhook-time operations             */

const GHL_BASE = 'https://rest.gohighlevel.com/v1';
const LOCATION_ID = 'oRA8vL3OSiCPjpwmEC0V'; // your agency location

function ghlHeaders() {
  return {
    Authorization: `Bearer ${process.env.GHL_LOCATION_KEY}`,
    'Content-Type': 'application/json',
  };
}

export interface GHLContactPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tier: string;
  stripeCustomerId: string;
}

/* ─── Upsert contact + set tier tag ────────────────────────── */

export async function upsertGHLContact(p: GHLContactPayload): Promise<void> {
  const tags = [`sal-${p.tier}`, 'saintsal-member', 'stripe-paid'];

  const body = {
    email: p.email,
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    tags,
    customField: {
      sal_tier: p.tier,
      stripe_customer_id: p.stripeCustomerId,
      ghl_subaccount_active: 'true',
    },
  };

  // Try lookup first
  const lookup = await fetch(
    `${GHL_BASE}/contacts/lookup?email=${encodeURIComponent(p.email)}`,
    { headers: ghlHeaders() },
  ).then((r) => r.json()).catch(() => null);

  const contactId = lookup?.contacts?.[0]?.id;

  if (contactId) {
    await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers: ghlHeaders(),
      body: JSON.stringify(body),
    });
  } else {
    await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: ghlHeaders(),
      body: JSON.stringify({ ...body, locationId: LOCATION_ID }),
    });
  }
}

/* ─── Trigger a GHL workflow by name / contact email ────────── */

export async function triggerGHLWorkflow(
  email: string,
  workflowId: string,
): Promise<void> {
  if (!workflowId) return;

  // Look up contact ID
  const lookup = await fetch(
    `${GHL_BASE}/contacts/lookup?email=${encodeURIComponent(email)}`,
    { headers: ghlHeaders() },
  ).then((r) => r.json()).catch(() => null);

  const contactId = lookup?.contacts?.[0]?.id;
  if (!contactId) return;

  await fetch(`${GHL_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
    method: 'POST',
    headers: ghlHeaders(),
  });
}

/* ─── Tier → GHL workflow mapping ──────────────────────────── */
// Fill these in from GHL → Automations → your welcome workflows

export const GHL_WELCOME_WORKFLOWS: Record<string, string> = {
  starter: process.env.GHL_WORKFLOW_STARTER ?? '',
  pro: process.env.GHL_WORKFLOW_PRO ?? '',
  teams: process.env.GHL_WORKFLOW_TEAMS ?? '',
  enterprise: process.env.GHL_WORKFLOW_ENTERPRISE ?? '',
};
