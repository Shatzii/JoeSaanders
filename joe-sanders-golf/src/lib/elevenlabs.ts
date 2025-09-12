// ElevenLabs integration for Uncle Joe's voice coaching
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice ID for Uncle Joe (you'll need to create this voice in ElevenLabs)
const UNCLE_JOE_VOICE_ID = 'your-uncle-joe-voice-id-here';

export interface CoachingTip {
  text: string;
  category: 'setup' | 'swing' | 'follow-through' | 'mental';
}

export const generateCoachingTip = (metrics: {
  clubSpeed: number;
  ballSpeed: number;
  launchAngle: number;
  carryDistance: number;
  shotShape: string;
  club: string;
}): CoachingTip => {
  const { clubSpeed, ballSpeed, launchAngle, carryDistance, shotShape, club } = metrics;

  // Driver coaching
  if (club === 'driver') {
    if (clubSpeed < 95) {
      return {
        text: "Pick up the pace there, partner! You're leaving power on the table. Focus on a smooth, accelerating swing.",
        category: 'swing'
      };
    }
    if (launchAngle < 10) {
      return {
        text: "Get that ball up in the air! Work on keeping your hands ahead of the ball at impact.",
        category: 'setup'
      };
    }
    if (shotShape === 'Slice') {
      return {
        text: "That slice is costing you strokes. Keep your grip neutral and swing more from the inside.",
        category: 'swing'
      };
    }
    if (carryDistance > 300) {
      return {
        text: "Now that's what I'm talkin' about! Solid contact and great distance. Keep that swing tempo.",
        category: 'swing'
      };
    }
  }

  // Iron coaching
  if (club === 'iron') {
    if (launchAngle > 25) {
      return {
        text: "Easy there, cowboy! That's too much loft. Focus on solid contact with a descending blow.",
        category: 'setup'
      };
    }
    if (shotShape === 'Hook') {
      return {
        text: "That hook is trouble. Open your stance a bit and swing more from the inside.",
        category: 'setup'
      };
    }
  }

  // Wedge coaching
  if (club === 'wedge') {
    if (clubSpeed < 65) {
      return {
        text: "Give it some mustard! Wedges need acceleration to stop on the green.",
        category: 'swing'
      };
    }
    if (carryDistance < 80) {
      return {
        text: "You're leaving distance on the table. Accelerate through impact and trust your swing.",
        category: 'mental'
      };
    }
  }

  // Putter coaching
  if (club === 'putter') {
    if (carryDistance > 25) {
      return {
        text: "That's not a putt, that's a chip! Keep your stroke smooth and accelerate through the ball.",
        category: 'swing'
      };
    }
  }

  // General positive feedback
  if (shotShape === 'Straight' && carryDistance > 250) {
    return {
      text: "Pure! That's the kind of shot that wins tournaments. Keep your focus and tempo.",
      category: 'mental'
    };
  }

  // Default coaching tip
  return {
    text: "Good effort! Focus on smooth rhythm and clean contact. Every swing is a learning opportunity.",
    category: 'mental'
  };
};

export const speakCoachingTip = async (tip: CoachingTip): Promise<void> => {
  try {
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your-elevenlabs-api-key-here') {
      throw new Error('ElevenLabs API key not configured');
    }

    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${UNCLE_JOE_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: tip.text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();

    // Play the audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);
    audioElement.play();

    // Clean up the URL after playing
    audioElement.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error('Error generating voice coaching:', error);
    // Fallback to browser speech synthesis if ElevenLabs fails
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(tip.text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
};

export const getVoiceList = async () => {
  try {
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your-elevenlabs-api-key-here') {
      throw new Error('ElevenLabs API key not configured');
    }

    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    return [];
  }
};