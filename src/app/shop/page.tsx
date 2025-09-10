import { ShoppingCart, Filter, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

// Sample product data - in a real app, this would come from Supabase
const products: Product[] = [
  {
    id: "1",
    name: "Joe Sanders Golf Polo - Navy",
    description: "Premium performance polo with moisture-wicking technology and Joe Sanders logo.",
    price: 85,
    images: ["/api/placeholder/400/400"],
    category: "apparel",
    inStock: true
  },
  {
    id: "2",
    name: "Signature Golf Cap",
    description: "Adjustable cap with embroidered signature logo. Perfect for on and off the course.",
    price: 35,
    images: ["/api/placeholder/400/400"],
    category: "apparel", 
    inStock: true
  },
  {
    id: "3",
    name: "Tour Golf Glove",
    description: "Professional-grade cabretta leather glove used by Joe in tournaments.",
    price: 28,
    images: ["/api/placeholder/400/400"],
    category: "equipment",
    inStock: true
  },
  {
    id: "4",
    name: "Championship Golf Balls (Dozen)",
    description: "Custom golf balls with Joe Sanders logo, same specification used on tour.",
    price: 55,
    images: ["/api/placeholder/400/400"],
    category: "equipment",
    inStock: true
  },
  {
    id: "5",
    name: "Signed Golf Photo",
    description: "8x10 professionally printed photo from the Masters, personally signed by Joe.",
    price: 45,
    images: ["/api/placeholder/400/400"],
    category: "accessories",
    inStock: true
  },
  {
    id: "6",
    name: "Golf Towel - Green",
    description: "Microfiber golf towel with carabiner clip and Joe Sanders embroidery.",
    price: 25,
    images: ["/api/placeholder/400/400"],
    category: "accessories",
    inStock: false
  }
];

const categories = [
  { id: "all", name: "All Products" },
  { id: "apparel", name: "Apparel" },
  { id: "equipment", name: "Equipment" },
  { id: "accessories", name: "Accessories" }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Official Merchandise
            </h1>
            <p className="text-lg lg:text-xl text-green-100 max-w-3xl mx-auto">
              Shop exclusive Joe Sanders golf merchandise. From professional-grade equipment 
              to signature apparel, support your favorite golfer in style.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filter by category:</span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category.id === "all"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-gray-600">
              {products.length} products available
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  {!product.inStock && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                    </div>
                  </div>

                  <button
                    disabled={!product.inStock}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      product.inStock
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Cart Notice */}
      <section className="py-8 bg-blue-50 border-t border-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              Secure Checkout with Stripe
            </h3>
          </div>
          <p className="text-blue-800">
            All payments are processed securely through Stripe. We accept all major credit cards 
            and provide worldwide shipping on all merchandise.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over $75 within the United States
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                All merchandise meets professional tour standards for quality and durability
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                30-day return policy on all unworn and unused merchandise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the Fan Club for Exclusive Deals
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-green-100">
            Fan club members receive 15% off all merchandise, early access to new products, 
            and exclusive limited-edition items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Join Fan Club
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}