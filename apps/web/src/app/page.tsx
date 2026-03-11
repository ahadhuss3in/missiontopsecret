import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight">👗 FashionFit</span>
        <div className="flex items-center gap-6">
          <Link href="#how" className="text-sm text-gray-600 hover:text-black">How it works</Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-black">Sign in</Link>
          <Link href="/register" className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-28 px-8 max-w-4xl mx-auto">
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-6">
          Chrome Extension · Free MVP
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none mb-6">
          Build outfits<br />from any store
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10">
          Browse Zara, H&M, ASOS, Shein and Nike — add items to one virtual mannequin.
          Mix, match, and save complete outfits in seconds.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="#install" className="bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition">
            Install Extension
          </a>
          <Link href="/register" className="text-gray-500 text-sm underline">
            Create free account
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-black text-center mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Browse any store", desc: "Shop Zara, H&M, ASOS, Shein, or Nike like you normally would." },
              { step: "2", title: "Click 'Add to Outfit'", desc: "The extension detects the product and adds it to your mannequin with one click." },
              { step: "3", title: "Save your outfit", desc: "Combine items from multiple stores into one outfit. Save it to your dashboard." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported stores */}
      <section className="py-20 px-8 text-center">
        <h2 className="text-2xl font-bold mb-8">Works with your favourite stores</h2>
        <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-lg font-semibold">
          {["Zara", "H&M", "ASOS", "Shein", "Nike"].map((s) => (
            <span key={s} className="bg-gray-50 px-6 py-3 rounded-full border border-gray-200">{s}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="install" className="bg-black text-white py-24 text-center px-8">
        <h2 className="text-4xl font-black mb-4">Start building outfits today</h2>
        <p className="text-gray-400 mb-8">Free to use. No credit card required.</p>
        <Link href="/register" className="bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition">
          Create free account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-100">
        © 2026 FashionFit. Built with love.
      </footer>
    </div>
  );
}
