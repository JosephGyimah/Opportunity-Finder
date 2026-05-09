import { NextResponse } from 'next/server';
import { opportunities } from '@/lib/opportunities';

type MatchResult = {
  opportunity_id: string;
  score: number;
  reason: string;
};

type RequestBody = {
  cvText?: string;
};

const GEMINI_MODEL = 'gemini-2.0-flash';

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    return trimmed;
  }

  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return codeBlock?.[1]?.trim() ?? trimmed;
}

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const cvText = body.cvText?.trim();

  if (!cvText || cvText.length < 50) {
    return NextResponse.json(
      { error: 'Please provide a more detailed CV (at least 50 characters).' },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured on the server.' },
      { status: 500 },
    );
  }

  const opportunityPayload = opportunities.map((opportunity) => ({
    id: opportunity.id,
    title: opportunity.title,
    organization: opportunity.organization,
    description: opportunity.description,
    location: opportunity.location,
    type: opportunity.type,
    deadline: opportunity.deadline,
    tags: opportunity.tags,
    eligibility: opportunity.eligibility,
    stipend: opportunity.stipend ?? null,
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: 'You are an opportunity matching assistant. Rank the provided opportunities against the CV. Return JSON only.',
            },
          ],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: [
                  'CV:',
                  cvText,
                  '',
                  'Opportunities JSON:',
                  JSON.stringify(opportunityPayload),
                  '',
                  'Return an array of objects with opportunity_id, score (0-100 integer), and reason (one sentence).',
                  'Sort from best to worst match. Do not include markdown or extra keys.',
                ].join('\n'),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `Gemini request failed with status ${response.status}` },
      { status: 500 },
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('') ?? '';
  const parsed = JSON.parse(extractJson(text)) as MatchResult[];

  const matches = Array.isArray(parsed)
    ? parsed
        .filter(
          (item): item is MatchResult =>
            item && typeof item.opportunity_id === 'string' && typeof item.reason === 'string',
        )
        .map((item) => ({
          opportunity_id: item.opportunity_id,
          score: Math.max(0, Math.min(100, Math.round(Number(item.score) || 0))),
          reason: item.reason.trim(),
        }))
        .filter((item) => item.score > 0)
    : [];

  return NextResponse.json({ matches });
}