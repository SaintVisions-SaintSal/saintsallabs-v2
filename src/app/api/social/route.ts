import { NextRequest, NextResponse } from 'next/server';

interface PlatformInput {
  id: string;
  label: string;
  charLimit: number;
}

interface SocialRequestBody {
  topic: string;
  tone: string;
  platforms: PlatformInput[];
}

interface GeneratedPost {
  content: string;
  hashtags: string[];
}

export async function POST(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !anthropicKey) {
    return NextResponse.json(
      { error: 'No AI API key configured' },
      { status: 500 },
    );
  }

  let body: SocialRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { topic, tone, platforms } = body;

  if (!topic || !tone || !platforms?.length) {
    return NextResponse.json(
      { error: 'Missing required fields: topic, tone, platforms' },
      { status: 400 },
    );
  }

  const platformList = platforms
    .map(
      (p) =>
        `- ${p.label} (id: "${p.id}", max ${p.charLimit} characters)`,
    )
    .join('\n');

  const systemPrompt = `You are SAL Social — the social media content engine for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol.

Generate unique, platform-optimized social media posts for each specified platform.

Rules:
- Respect each platform's character limit strictly
- Adapt voice, length, and formatting to each platform's culture
- Include relevant hashtags (2-5 per platform)
- Use the specified tone: ${tone}
- Do NOT use generic filler — every post must be specific and actionable
- Return ONLY valid JSON, no markdown fences, no extra text

Return JSON in this exact format:
{
  "results": {
    "<platform_id>": {
      "content": "the post text without hashtags",
      "hashtags": ["#tag1", "#tag2"]
    }
  }
}`;

  const userMessage = `Topic: ${topic}

Tone: ${tone}

Generate posts for these platforms:
${platformList}`;

  try {
    let text: string;

    if (geminiKey) {
      text = await callGemini(systemPrompt, userMessage, geminiKey);
    } else {
      text = await callAnthropic(systemPrompt, userMessage, anthropicKey!);
    }

    // Parse the JSON from the response
    let results: Record<string, GeneratedPost>;
    try {
      const parsed = JSON.parse(text);
      results = parsed.results ?? parsed;
    } catch {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        results = parsed.results ?? parsed;
      } else {
        return NextResponse.json(
          { error: 'Failed to parse AI response', raw: text },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Social generation failed', detail: message },
      { status: 500 },
    );
  }
}

/* ─── Gemini (primary) ───────────────────────────────────────── */

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
): Promise<string> {
  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/* ─── Anthropic (fallback) ───────────────────────────────────── */

async function callAnthropic(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Anthropic API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}
