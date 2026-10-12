'use client';
import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Sparkles, CheckCircle, X, Phone, MapPin, 
  Star, ShieldCheck, Truck, RefreshCw, Heart, ArrowRight
} from 'lucide-react';

// Product Type Definition
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
}

interface CartItem extends Product {
  qty: number;
}

interface OrderDetails {
  orderId: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  total: number;
  deliveryArea: string;
}

// ELORA Beauty Zone - Product List
const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "COSRX Advanced Snail 96 Mucin Power Essence (100ml)", 
    category: "Skincare", 
    price: 1850, 
    originalPrice: 2100, 
    rating: 4.9, 
    reviews: 128,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500", 
    tag: "Bestseller" 
  },
  { 
    id: 2, 
    name: "Velvet Matte Liquid Lipstick - Ruby Red 05", 
    category: "Makeup", 
    price: 950, 
    originalPrice: 1200, 
    rating: 4.8, 
    reviews: 84,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500", 
    tag: "New" 
  },
  { 
    id: 3, 
    name: "Glow Brightening Vitamin C Serum (30ml)", 
    category: "Skincare", 
    price: 1450, 
    originalPrice: 1750, 
    rating: 4.9, 
    reviews: 210,
    image: "https://images.unsplash.com/photo-1608248597379-397317058e5e?w=500", 
    tag: "Hot Deal" 
  },
  { 
    id: 4, 
    name: "Pure Moroccan Argan Oil Hair Treatment", 
    category: "Haircare", 
    price: 1200, 
    originalPrice: 1500, 
    rating: 4.7, 
    reviews: 65,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500", 
    tag: "Popular" 
  },
  { 
    id: 5, 
    name: "Hydrating Hyaluronic Acid Sunscreen SPF 50+", 
    category: "SunCare", 
    price: 1350, 
    originalPrice: 1600, 
    rating: 5.0, 
    reviews: 142,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500", 
    tag: "Must Have" 
  },
  { 
    id: 6, 
    name: "Deep Cleansing Rose Water Facial Gel Toner", 
    category: "Skincare", 
    price: 980, 
    originalPrice: 1150, 
    rating: 4.8, 
    reviews: 92,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500", 
    tag: "Trending" 
  }
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deliveryArea, setDeliveryArea] = useState<string>("inside");
  const [orderConfirmed, setOrderConfirmed] = useState<OrderDetails | null>(null);

  // আপনার হোয়াটসঅ্যাপ নম্বর (এখানে আপনার নম্বর দিন)
  const WHATSAPP_NUMBER = "8801700000000"; 

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', note: '' });

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryCharge = deliveryArea === 'inside' ? 70 : 130;
  const grandTotal = subtotal + deliveryCharge;

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("আপনার কার্ট খালি!");

    const orderId = 'EBZ-' + Math.floor(100000 + Math.random() * 900000);
    const orderDetails: OrderDetails = {
      orderId,
      items: cart,
      customer: formData,
      total: grandTotal,
      deliveryArea: deliveryArea === 'inside' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳130)'
    };

    setOrderConfirmed(orderDetails);

    // WhatsApp Message
    const itemListText = cart.map(item => `• ${item.name} (${item.qty}x) = ৳${item.price * item.qty}`).join('\n');
    const waMessage = `✨ *NEW ORDER - ELORA BEAUTY ZONE* ✨\n\n` +
      `🆔 *Order ID:* ${orderId}\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `📍 *Address:* ${formData.address}\n\n` +
      `🛍️ *Ordered Products:*\n${itemListText}\n\n` +
      `🚚 *Delivery:* ${deliveryArea === 'inside' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳130)'}\n` +
      `💰 *Total Amount:* ৳${grandTotal} (Cash on Delivery)\n` +
      (formData.note ? `📝 *Note:* ${formData.note}\n` : '');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* 📌 TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>১০০% অরিজিনাল কসমেটিক্স ও স্কিনকেয়ার প্রোডাক্টস | ২,০০০ টাকার অর্ডারে ডেলিভারি ফ্রি!</span>
      </div>

      {/* 🟢 NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-rose-600">
              ELORA <span className="text-slate-900 font-bold">Beauty Zone</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Pure Care for Your Skin</p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-rose-50 hover:bg-rose-100 rounded-full transition shadow-xs group"
            >
              <ShoppingBag className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 🌸 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 text-rose-600 rounded-full text-xs font-bold shadow-sm border border-rose-100">
              <Sparkles className="w-4 h-4 text-rose-500" /> Premium Beauty Collection
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              আপনার ত্বকে আনুন <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">প্রাকৃতিক উজ্জ্বলতা</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
              ELORA Beauty Zone নিয়ে এসেছে কোরিয়ান ও আন্তর্জাতিক সেরা ব্র্যান্ডের ১০০% আসল স্কিনকেয়ার এবং মেকআপ প্রডাক্ট।
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="#products" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-rose-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm">
                প্রোডাক্টস দেখুন <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-rose-200/50 absolute blur-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800" 
              alt="Elora Beauty Zone Collection" 
              className="rounded-3xl shadow-2xl object-cover h-80 md:h-96 w-full max-w-md border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* 🛡️ TRUST BADGES */}
      <section className="bg-white py-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-2">
            <ShieldCheck className="w-8 h-8 text-rose-600 mb-2" />
            <h4 className="font-bold text-xs md:text-sm text-slate-800">১০০% আসল প্রোডাক্ট</h4>
            <p className="text-[11px] text-gray-500">গ্যারান্টিযুক্ত প্রিমিয়াম কোয়ালিটি</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <Truck className="w-8 h-8 text-rose-600 mb-2" />
            <h4 className="font-bold text-xs md:text-sm text-slate-800">দ্রুত ডেলিভারি</h4>
            <p className="text-[11px] text-gray-500">সারাদেশে হোম ডেলিভারি</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <RefreshCw className="w-8 h-8 text-rose-600 mb-2" />
            <h4 className="font-bold text-xs md:text-sm text-slate-800">ক্যাশ অন ডেলিভারি</h4>
            <p className="text-[11px] text-gray-500">পণ্য হাতে পেয়ে পেমেন্ট</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <Heart className="w-8 h-8 text-rose-600 mb-2" />
            <h4 className="font-bold text-xs md:text-sm text-slate-800">কাস্টমার সাপোর্ট</h4>
            <p className="text-[11px] text-gray-500">যেকোনো প্রয়োজনে সাহায্য</p>
          </div>
        </div>
      </section>

      {/* 🛍️ MAIN PRODUCT SECTION */}
      <main id="products" className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">আমাদের জনপ্রিয় প্রোডাক্টস</h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">আপনার ত্বকের ধরন অনুযায়ী বেছে নিন সেরা স্কিনকেয়ার সামগ্রী</p>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {["All", "Skincare", "Makeup", "Haircare", "SunCare"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                    : "bg-white text-gray-600 hover:bg-rose-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="পছন্দের প্রডাক্ট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-rose-500 bg-white shadow-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-50/80 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 rounded-2xl overflow-hidden mb-3 bg-gray-50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-rose-600 font-bold uppercase tracking-wider text-[10px]">{product.category}</span>
                  <div className="flex items-center text-amber-500 font-bold gap-1 text-[11px]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400">({product.reviews})</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 my-1 leading-snug group-hover:text-rose-600 transition-colors">
                  {product.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-slate-900">৳{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through ml-1.5 font-medium">৳{product.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="bg-slate-900 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🛒 CART MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" /> Shopping Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-2 stroke-1 text-rose-300" />
                <p className="text-sm font-medium">আপনার কার্ট খালি রয়েছে</p>
              </div>
            ) : (
              <div className="flex-1 py-4 divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="pr-2">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-rose-600 font-semibold mt-0.5">৳{item.price} x {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-white rounded font-bold hover:bg-rose-100 text-xs">-</button>
                      <span className="text-xs font-bold px-1">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-white rounded font-bold hover:bg-rose-100 text-xs">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t pt-4 space-y-3">
                <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">ডেলিভারি এরিয়া ও ঠিকানা</h3>
                
                <input
                  type="text" required placeholder="আপনার পুরো নাম"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-xl p-2.5 text-xs bg-gray-50 focus:bg-white"
                />
                <input
                  type="tel" required placeholder="মোবাইল নম্বর"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border rounded-xl p-2.5 text-xs bg-gray-50 focus:bg-white"
                />
                <textarea
                  required placeholder="সম্পূর্ণ ঠিকানা (বাসা/রোড নম্বর, এলাকা, থানা)"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full border rounded-xl p-2.5 text-xs bg-gray-50 focus:bg-white h-16"
                />

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600">ডেলিভারি চার্জ:</label>
                  <select 
                    value={deliveryArea} 
                    onChange={e => setDeliveryArea(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-xs bg-gray-50 font-medium"
                  >
                    <option value="inside">ঢাকার ভেতরে (৳৭০)</option>
                    <option value="outside">ঢাকার বাইরে (৳১৩০)</option>
                  </select>
                </div>

                <div className="bg-rose-50/70 p-3.5 rounded-xl text-xs space-y-1.5 font-medium border border-rose-100">
                  <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>৳{subtotal}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Delivery Charge:</span><span>৳{deliveryCharge}</span></div>
                  <div className="flex justify-between border-t border-rose-200 pt-1.5 font-black text-rose-600 text-sm">
                    <span>Total Amount:</span><span>৳{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-rose-200 text-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> WhatsApp-এ অর্ডার নিশ্চিত করুন (৳{grandTotal})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 🎉 FOOTER */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <h2 className="text-xl font-black text-rose-500">ELORA Beauty Zone</h2>
          <p className="text-xs text-slate-400">Your Trusted Destination for Authentic Cosmetics & Skincare</p>
          <p className="text-[11px] text-slate-600 pt-4">© {new Date().getFullYear()} ELORA Beauty Zone. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}