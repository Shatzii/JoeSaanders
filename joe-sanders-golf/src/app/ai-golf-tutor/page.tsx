import Link from 'next/link'
// Next/Image not needed here; using SponsorLogo abstraction
import SponsorLogo from '@/components/SponsorLogo'
import { Target, Volume2, TrendingUp, Users, Star, Play, CheckCircle } from 'lucide-react'
import TutorInteractiveWrapper from '@/components/TutorInteractiveWrapper'

export const metadata = {
  title: 'AI Golf Tutor - Uncle Joe\'s Revolutionary Golf Coaching',
  description: 'Experience the future of golf coaching with Uncle Joe\'s AI-powered tutor. Get instant swing analysis, voice feedback, and personalized tips to improve your game.',
  keywords: 'AI golf coach, golf simulator, swing analysis, golf training, Uncle Joe Sanders',
}

export default function AIGolfTutorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-joe-black via-joe-stone to-joe-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-joe-gold/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-joe-gold rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-joe-black" />
                </div>
                <span className="text-joe-gold font-joe-accent font-semibold">Revolutionary Golf Technology</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-joe-heading font-bold text-white mb-6">
                Uncle Joe&apos;s
                <span className="block text-joe-gold">AI Golf Tutor</span>
              </h1>
              
              <p className="text-xl text-joe-white/90 font-joe-body mb-8 leading-relaxed">
                Experience the future of golf coaching with AI-powered swing analysis, real-time voice feedback, 
                and personalized improvement tips from Uncle Joe himself. No more guessing – get instant, 
                professional-grade coaching on every shot.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/ai-golf-tutor/demo"
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-8 py-4 rounded-lg font-joe-heading font-bold text-lg hover:from-amber-400 hover:to-joe-gold transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  Try FREE Demo Now
                </Link>
                <button className="inline-flex items-center justify-center gap-3 border-2 border-joe-gold text-joe-gold px-8 py-4 rounded-lg font-joe-heading font-semibold text-lg hover:bg-joe-gold hover:text-joe-black transition-all duration-300">
                  <Volume2 className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No sign-up required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>5 free shots</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Instant feedback</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-joe-gold/20 to-joe-gold/5 rounded-2xl p-2 sm:p-4 border border-joe-gold/30 flex items-center justify-center">
                <SponsorLogo
                  src="/images/uncle-joe-cartoon.webp"
                  fallbackSrc="/images/JoeCartoon.webp"
                  alt="Uncle Joe Cartoon"
                  width={768}
                  height={1152}
                  className="rounded-xl object-contain max-h-[520px] w-auto"
                />
              </div>

              {/* Info overlay panel below the image for key tech labels */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="bg-joe-black/50 rounded-lg p-4 border border-joe-gold/20">
                  <div className="text-2xl font-bold text-joe-gold">GPT-4</div>
                  <div className="text-sm text-joe-white/70">AI Brain</div>
                </div>
                <div className="bg-joe-black/50 rounded-lg p-4 border border-joe-gold/20">
                  <div className="text-2xl font-bold text-joe-gold">Voice</div>
                  <div className="text-sm text-joe-white/70">ElevenLabs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-joe-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">
              Revolutionary Golf Coaching Features
            </h2>
            <p className="text-xl text-joe-white/80 max-w-3xl mx-auto">
              Everything you need to take your golf game to the next level, powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real-Time Analysis */}
            <div className="bg-gradient-to-br from-joe-black to-joe-stone rounded-2xl p-8 border border-joe-gold/20">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-4">
                Real-Time Swing Analysis
              </h3>
              <p className="text-joe-white/80 mb-6">
                Get instant feedback on every shot with GPT-4 powered analysis. Our AI evaluates club selection, 
                swing technique, ball flight, and provides specific improvement recommendations.
              </p>
              <ul className="space-y-2 text-sm text-joe-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Club selection analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Swing path evaluation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Distance optimization
                </li>
              </ul>
            </div>

            {/* Voice Coaching */}
            <div className="bg-gradient-to-br from-joe-black to-joe-stone rounded-2xl p-8 border border-joe-gold/20">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-2xl flex items-center justify-center mb-6">
                <Volume2 className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-4">
                Uncle Joe&apos;s Voice Coaching
              </h3>
              <p className="text-joe-white/80 mb-6">
                Hear personalized coaching tips in Uncle Joe&apos;s authentic voice using ElevenLabs AI. 
                Get the feeling of having a professional coach right beside you on every shot.
              </p>
              <ul className="space-y-2 text-sm text-joe-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Natural voice synthesis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Personalized tips
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Motivational encouragement
                </li>
              </ul>
            </div>

            {/* Performance Tracking */}
            <div className="bg-gradient-to-br from-joe-black to-joe-stone rounded-2xl p-8 border border-joe-gold/20">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-4">
                Advanced Performance Tracking
              </h3>
              <p className="text-joe-white/80 mb-6">
                Track your improvement over time with detailed analytics, shot history, and AI-generated 
                progress reports that help you understand your strengths and areas for improvement.
              </p>
              <ul className="space-y-2 text-sm text-joe-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Shot history tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Progress analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Improvement recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-joe-stone to-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">
              What Golfers Are Saying
            </h2>
            <p className="text-xl text-joe-white/80">
              See how the AI Golf Tutor is transforming games across the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-joe-black/50 rounded-xl p-6 border border-joe-gold/20">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-joe-white/90 mb-4">
                &quot;The AI feedback is incredibly accurate! It&apos;s like having Uncle Joe right there with me. 
                My swing has improved dramatically in just a few sessions.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-joe-gold rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-joe-black" />
                </div>
                <div>
                  <div className="font-semibold text-joe-gold">Sarah M.</div>
                  <div className="text-sm text-joe-white/70">Amateur Golfer</div>
                </div>
              </div>
            </div>

            <div className="bg-joe-black/50 rounded-xl p-6 border border-joe-gold/20">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-joe-white/90 mb-4">
                &quot;The voice coaching feature is game-changing. Hearing Uncle Joe&apos;s tips in real-time 
                has taken my practice sessions to the next level.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-joe-gold rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-joe-black" />
                </div>
                <div>
                  <div className="font-semibold text-joe-gold">Mike R.</div>
                  <div className="text-sm text-joe-white/70">Club Professional</div>
                </div>
              </div>
            </div>

            <div className="bg-joe-black/50 rounded-xl p-6 border border-joe-gold/20">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-joe-white/90 mb-4">
                &quot;Finally, a golf simulator that actually helps me improve! The AI analysis is spot-on 
                and the feedback is incredibly useful.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-joe-gold rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-joe-black" />
                </div>
                <div>
                  <div className="font-semibold text-joe-gold">Jennifer L.</div>
                  <div className="text-sm text-joe-white/70">Weekend Warrior</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">
              Choose Your Coaching Level
            </h2>
            <p className="text-xl text-joe-white/80 max-w-3xl mx-auto">
              Start with our free demo, then choose the plan that fits your golf improvement goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Demo */}
            <div className="bg-gradient-to-br from-joe-stone to-joe-black rounded-2xl p-8 border border-joe-gold/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-2">Free Demo</h3>
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <p className="text-joe-white/70">Try it now</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>5 demo shots</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Basic AI analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Voice coaching preview</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No sign-up required</span>
                </li>
              </ul>
              <Link
                href="/simulator?demo=true"
                className="block w-full bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-6 py-3 rounded-lg font-bold text-center hover:from-amber-400 hover:to-joe-gold transition-all duration-300"
              >
                Try Free Demo
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-joe-gold/20 to-joe-gold/5 rounded-2xl p-8 border-2 border-joe-gold relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-joe-gold text-joe-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-2">Pro Simulator</h3>
                <div className="text-4xl font-bold text-white mb-2">$9.99</div>
                <p className="text-joe-white/70">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Unlimited shots</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Full voice coaching</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Multiple courses</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Performance tracking</span>
                </li>
              </ul>
              <button className="block w-full bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-6 py-3 rounded-lg font-bold hover:from-amber-400 hover:to-joe-gold transition-all duration-300">
                Start Pro Trial
              </button>
            </div>

            {/* Elite Plan */}
            <div className="bg-gradient-to-br from-joe-stone to-joe-black rounded-2xl p-8 border border-joe-gold/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-2">Elite Coach</h3>
                <div className="text-4xl font-bold text-white mb-2">$19.99</div>
                <p className="text-joe-white/70">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>1-on-1 AI coaching</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Video analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Custom drills</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button className="block w-full border-2 border-joe-gold text-joe-gold px-6 py-3 rounded-lg font-bold hover:bg-joe-gold hover:text-joe-black transition-all duration-300">
                Upgrade to Elite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-joe-gold/10 to-joe-gold/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">
            Ready to Transform Your Golf Game?
          </h2>
          <p className="text-xl text-joe-white/90 mb-8">
            Join thousands of golfers who are already improving their game with Uncle Joe&apos;s AI Golf Tutor. 
            Start your free demo today – no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-8 py-4 rounded-lg font-joe-heading font-bold text-lg hover:from-amber-400 hover:to-joe-gold transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6" />
              Start Free Demo Now
            </Link>
            <p className="text-sm text-joe-white/70">
              No sign-up required • 5 free shots • Instant feedback
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 bg-joe-black/60 border-t border-joe-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-joe-heading font-bold text-joe-gold">Interactive Demo</h2>
            <p className="text-joe-white/80 mt-2">Try the embedded simulator, capture swings, and generate your 2-week plan.</p>
          </div>
          <TutorInteractiveWrapper />
        </div>
      </section>
    </div>
  )
}