"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product { quantity: number; }

export default function StoreContent({ products }: { products: Product[] }) {
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem("csc-cart"); if (s) setCartItems(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("csc-cart", JSON.stringify(cartItems)); }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => { setCartItems((prev) => prev.filter((item) => item.id !== id)); }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">Store</div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] border border-transparent rounded-lg focus:outline-none focus:border-[#0000ff] text-sm text-black placeholder:text-[#525252]" />
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? "bg-[#0000ff] text-white" : "bg-[rgba(211,210,211,0.35)] text-black hover:bg-[rgba(211,210,211,0.5)]"}`}>{cat}</button>
              ))}
            </div>
            <button onClick={() => setCartOpen(true)} className="relative p-2.5 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-lg hover:bg-[rgba(211,210,211,0.5)] transition-colors">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#0000ff] text-white text-xs rounded-full flex items-center justify-center font-medium">{cartCount}</span>}
            </button>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {filteredProducts.length === 0 ? <p className="text-center text-[#525252] py-20">No products found.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find((item) => item.id === product.id);
              return (
                <div key={product.id} className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl overflow-hidden shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] transition-all duration-300">
                  <div className="relative h-56 bg-[rgba(211,210,211,0.35)]">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-mono text-[#0000ff] uppercase tracking-wider">{product.category}</span>
                    <h3 className="font-semibold text-lg mt-1 text-black">{product.name}</h3>
                    <p className="text-lg font-bold mt-2 text-black">৳{product.price.toLocaleString()}</p>
                    <div className="mt-4">
                      {inCart ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(product.id, -1)} className="w-8 h-8 rounded-lg bg-[rgba(211,210,211,0.5)] flex items-center justify-center text-black hover:bg-[rgba(211,210,211,0.7)]">-</button>
                            <span className="font-medium w-6 text-center text-black">{inCart.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="w-8 h-8 rounded-lg bg-[rgba(211,210,211,0.5)] flex items-center justify-center text-black hover:bg-[rgba(211,210,211,0.7)]">+</button>
                          </div>
                          <button onClick={() => removeFromCart(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">X</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} className="w-full py-2.5 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors text-sm">Add to Cart</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(211,210,211,0.5)]">
              <h2 className="text-lg font-bold text-black">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-[rgba(211,210,211,0.35)] rounded-lg transition-colors text-black">X</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? <p className="text-center text-[#525252] py-20">Cart is empty.</p> : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-[rgba(211,210,211,0.35)] rounded-xl">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate text-black">{item.name}</h4>
                        <p className="text-sm font-bold mt-1 text-black">৳{(item.price * item.quantity).toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded bg-white flex items-center justify-center">-</button>
                          <span className="text-sm font-medium w-5 text-center text-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded bg-white flex items-center justify-center">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="self-start p-1 text-red-500 hover:bg-red-50 rounded transition-colors">X</button>
                    </div>
                  ))}
                  <div className="border-t border-[rgba(211,210,211,0.5)] pt-4 mt-4">
                    <div className="flex items-center justify-between font-bold text-lg text-black">
                      <span>Total</span>
                      <span>৳{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => { setCartItems([]); setCartOpen(false); }}
                    className="w-full py-3 border border-[rgba(211,210,211,0.5)] rounded-lg text-sm font-medium hover:bg-[rgba(211,210,211,0.35)] transition-colors text-black">Clear Cart</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
