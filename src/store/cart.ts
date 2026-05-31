"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const emptyState: CartState = { items: [], isOpen: false };
let state: CartState = emptyState;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const saved = localStorage.getItem("asrar-cart");
    if (saved) state = { ...state, items: JSON.parse(saved) };
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("asrar-cart", JSON.stringify(state.items));
    } catch {}
  }
}

function getSnapshot(): CartState {
  hydrateOnce();
  return state;
}

function getServerSnapshot(): CartState {
  return emptyState;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrateOnce();
  listener();
  return () => listeners.delete(listener);
}

export function addToCart(product: Product, qty = 1) {
  if (product.stock <= 0) return;
  const existing = state.items.find((i) => i.product.id === product.id);
  if (existing) {
    const newQty = Math.min(existing.quantity + qty, product.stock);
    if (newQty === existing.quantity) {
      showToast("Quantité max atteinte");
      return;
    }
    state = {
      ...state,
      items: state.items.map((i) =>
        i.product.id === product.id ? { ...i, quantity: newQty } : i
      ),
    };
  } else {
    state = { ...state, items: [...state.items, { product, quantity: Math.min(qty, product.stock) }] };
  }
  emit();
  showToast(`${product.name_fr} ajouté au panier`);
}

export function removeFromCart(productId: string) {
  state = { ...state, items: state.items.filter((i) => i.product.id !== productId) };
  emit();
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) { removeFromCart(productId); return; }
  const item = state.items.find((i) => i.product.id === productId);
  const max = item?.product.stock ?? quantity;
  state = {
    ...state,
    items: state.items.map((i) =>
      i.product.id === productId ? { ...i, quantity: Math.min(quantity, max) } : i
    ),
  };
  emit();
}

export function toggleCart() { state = { ...state, isOpen: !state.isOpen }; emit(); }
export function openCart() { state = { ...state, isOpen: true }; emit(); }
export function closeCart() { state = { ...state, isOpen: false }; emit(); }
export function clearCart() { state = { ...state, items: [] }; emit(); }

// Toast notification system
let toastListeners = new Set<(msg: string) => void>();
export function onToast(fn: (msg: string) => void) {
  toastListeners.add(fn);
  return () => toastListeners.delete(fn);
}
function showToast(msg: string) {
  toastListeners.forEach((fn) => fn(msg));
}

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const total = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = cart.items.reduce((s, i) => s + i.quantity, 0);

  return {
    items: cart.items,
    isOpen: cart.isOpen,
    total,
    count,
    addToCart: useCallback((p: Product, q?: number) => addToCart(p, q), []),
    removeFromCart: useCallback((id: string) => removeFromCart(id), []),
    updateQuantity: useCallback((id: string, q: number) => updateQuantity(id, q), []),
    toggleCart: useCallback(() => toggleCart(), []),
    openCart: useCallback(() => openCart(), []),
    closeCart: useCallback(() => closeCart(), []),
    clearCart: useCallback(() => clearCart(), []),
  };
}
