"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try { const s = localStorage.getItem("csc-cart"); if (s) setCartItems(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("csc-cart", JSON.stringify(cartItems)); }, [cartItems]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }, []);

  const removeItem = useCallback((id: string) => { setCartItems((prev) => prev.filter((item) => item.id !== id)); }, []);
  const clearCart = useCallback(() => { setCartItems([]); }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Your Cart</h1>
        <Link href="/store" className="flex items-center gap-1.5 text-sm text-[#525252] hover:text-[#0000ff] transition-colors">&larr; Back to Store</Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <h2 className="text-xl font-semibold mb-2 text-black">Your cart is empty</h2>
          <p className="text-[#525252] mb-6">Browse the store and add some items to your cart.</p>
          <Link href="/store" className="inline-block px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">Go to Store</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-5 p-5 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
              <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-xl">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-black">{item.name}</h3>
                    <p className="text-xs text-[#525252] mt-0.5">{item.category}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">X</button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-9 h-9 rounded-lg bg-[rgba(211,210,211,0.5)] flex items-center justify-center text-black hover:bg-[rgba(211,210,211,0.7)]">-</button>
                    <span className="font-medium w-8 text-center text-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-9 h-9 rounded-lg bg-[rgba(211,210,211,0.5)] flex items-center justify-center text-black hover:bg-[rgba(211,210,211,0.7)]">+</button>
                  </div>
                  <p className="font-bold text-lg text-black">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] mt-6">
            <div className="flex items-center justify-between mb-2 text-[#525252]">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>৳{total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xl font-bold border-t border-[rgba(211,210,211,0.5)] pt-4 mt-4 text-black">
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={clearCart} className="flex-1 py-3 border border-[rgba(211,210,211,0.5)] rounded-lg text-sm font-medium hover:bg-[rgba(211,210,211,0.35)] transition-colors text-black">Clear Cart</button>
              <button className="flex-1 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
