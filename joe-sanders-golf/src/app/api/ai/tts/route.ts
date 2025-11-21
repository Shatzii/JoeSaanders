import { NextRequest, NextResponse } from 'next/server'

// ElevenLabs TTS API endpoint
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Default Uncle Joe voice

    if (!apiKey) {
      console.warn('ElevenLabs API key not configured')
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 503 }
      )
    }

    const selectedVoiceId = voiceId || defaultVoiceId

    const response = await fetch(`${ELEVENLABS_API_URL}/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('ElevenLabs API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        { status: response.status }
      )
    }

    // Get the audio data as buffer
    const audioBuffer = await response.arrayBuffer()

    // Return audio as base64
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      audio: base64Audio,
      contentType: 'audio/mpeg'
    })

  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
