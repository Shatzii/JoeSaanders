import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check if ElevenLabs API key is available
    if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID) {
      return NextResponse.json({
        response: "Voice features are currently unavailable. Please configure ElevenLabs API credentials for full functionality.",
        suggestions: [
          "Set up ELEVENLABS_API_KEY environment variable",
          "Set up ELEVENLABS_VOICE_ID environment variable",
          "Contact administrator for API key configuration"
        ]
      });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      throw new Error('ElevenLabs TTS failed');
    }

    // Get the audio as a buffer
    const audioBuffer = await response.arrayBuffer();

    // Return the audio directly
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Speech generation error:', error);
    return NextResponse.json(
      { error: 'Speech generation failed' },
      { status: 500 }
    );
  }
}