import Image from 'next/image'
import Link from 'next/link'
import { dataClient } from '@/lib/data-client'
import { Merch } from '@/types'
import { ShoppingBag, Image as ImageIcon, CheckCircle, Heart, DollarSign } from 'lucide-react'

async function getMerch(): Promise<Merch[]> {
  try {
    return await dataClient.getMerch()
  } catch (error) {
    console.error('Error fetching merch:', error)
    return []
  }
}

export default async function ShopPage() {
  const merchItems = await getMerch()

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="hero-container text-joe-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-tagline mb-4">Pro Shop</h1>
            <p className="text-xl text-joe-stone max-w-3xl mx-auto font-joe-body">
              Support my PGA Tour journey while getting official merchandise.
              Every purchase helps fund my professional career.
            </p>
          </div>
        </div>
      </section>

      {/* Merchandise Grid */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {merchItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-joe-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-joe-gold" />
              </div>
              <h3 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-2">Coming Soon</h3>
              <p className="text-joe-white mb-6 font-joe-body">Official merchandise will be available soon. Check back for exclusive Uncle Joe gear!</p>
              <Link
                href="/contact"
                className="merch-button px-6 py-3 rounded-lg font-joe-accent font-bold text-lg"
              >
                <span>Get Notified</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {merchItems.map((item) => (
                <div key={item.id} className="merch-card">
                  <div className="aspect-square bg-joe-black relative">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-joe-gold" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-joe-white text-sm mb-4 font-joe-body">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-joe-heading font-bold text-joe-gold">
                        ${(item.price_id ? 25 : 25).toFixed(2)} {/* Mock price */}
                      </span>
                      <button className="merch-button px-6 py-2 rounded-lg font-joe-accent font-bold text-sm">
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Buy Section */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Why Shop With Joe?</h2>
            <p className="text-lg text-joe-stone font-joe-body">More than just merchandise - you&apos;re investing in a dream</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Quality Products</h3>
              <p className="text-joe-stone font-joe-body">
                Premium materials and professional craftsmanship for all merchandise items.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Support the Dream</h3>
              <p className="text-joe-stone font-joe-body">
                Every purchase directly supports my professional golf career and tournament expenses.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Exclusive Content</h3>
              <p className="text-joe-stone font-joe-body">
                Merchandise purchases may include access to exclusive content and fan experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Ready to Support?</h2>
          <p className="text-xl mb-8 text-joe-white font-joe-body">
            Your support means everything on this journey to the PGA Tour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fan-club"
              className="merch-button px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
            >
              <span>Join Fan Club</span>
            </Link>
            <Link
              href="/journey"
              className="btn-outline border-2 border-joe-gold text-joe-gold hover:bg-joe-gold hover:text-joe-black px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
            >
              Follow The Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
