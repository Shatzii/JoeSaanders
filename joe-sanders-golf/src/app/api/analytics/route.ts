import { NextResponse } from 'next/server';
import { z } from 'zod';

const EventSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  label: z.string().optional(),
  value: z.number().optional(),
  meta: z.record(z.any()).optional(),
});

const BodySchema = z.object({
  events: z.array(EventSchema).min(1),
  ts: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const receivedAt = Date.now();
    // For now just log – could integrate with external data warehouse
    console.log('[analytics] batch', {
      count: parsed.data.events.length,
      receivedAt,
      first: parsed.data.events[0]
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
