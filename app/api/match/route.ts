import { NextResponse } from 'next/server';
import opportunities from '@/data/opportunities';

type AiMatch = {
  title: string;
  matchScore: number;
  reason: string;
};

const GEMINI_MODEL = 'gemini-2.0-flash';

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) return trimmed;
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return codeBlock?.[1]?.trim() ?? trimmed;
}

export async function POST(request: Request) {
  try {
    const { cvText } = (await request.json()) as { cvText?: string };
    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: 'Please provide a more detailed CV (at least 50 characters).' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured on the server.' }, { status: 500 });
    }

    // Minimal payload: send CV and a compact opportunities list to the model
    const smallPayload = opportunities.map((o) => ({ id: o.id, title: o.title, company: o.company, location: o.location, region: o.region, skills: o.skills, level: o.level }));

    const prompt = [
      'You are an assistant that strictly returns JSON. Do not include any extra text, headings or markdown.',
      'Given the candidate CV and the small opportunities list, return the top 3 opportunity matches as an array of objects with EXACT keys: title, matchScore (0-100 number), reason (one short sentence).',
      'Respond with compact JSON only. Example output: [{"title":"...","matchScore":87,"reason":"..."}, ...]',
      '',
      'CV:',
      cvText.trim(),
      '',
      'Opportunities:',
      JSON.stringify(smallPayload),
    ].join('\n');

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: 'You are a concise matching assistant.' }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
        }),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `Gemini error ${resp.status}`, details: text }, { status: 502 });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? '';
    const jsonText = extractJson(text);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON from Gemini' }, { status: 502 });
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Gemini did not return an array' }, { status: 502 });
    }

    const matches = (parsed as any[])
      .slice(0, 3)
      .map((item): AiMatch | null => {
        if (!item || typeof item.title !== 'string') return null;
        const score = typeof item.matchScore === 'number' ? item.matchScore : Number(item.matchScore) || 0;
        return { title: item.title, matchScore: Math.max(0, Math.min(100, Math.round(score))), reason: String(item.reason ?? '').trim() };
      })
      .filter(Boolean) as AiMatch[];

    return NextResponse.json(matches);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown server error' }, { status: 500 });
  }
}
