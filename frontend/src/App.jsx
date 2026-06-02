import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MenuItem from './components/MenuItem'
import Cart from './components/Cart'
import CategoryFilter from './components/CategoryFilter'

// Sample menu – replace with API call later
const MENU = [
  { id: 1, name: "Waakye", description: "Spaghetti, egg, meat, salad", price: 15, category: "waakye", emoji: "🍛" },
  { id: 2, name: "Jollof Rice", description: "Chicken, coleslaw, plantain", price: 20, category: "jollof", emoji: "🍚" },
  { id: 3, name: "Beans & Plantain", description: "Fried ripe plantain, spicy beans", price: 12, category: "beans", emoji: "🫘" },
  { id: 4, name: "Fried Rice", description: "Mixed vegetables, egg, chicken", price: 18, category: "rice", emoji: "🍚" },
  { id: 5, name: "Banku & Tilapia", description: "Fresh tilapia, hot pepper, okro stew", price: 25, category: "rice", emoji: "🐟" },
  { id: 6, name: "Fufu & Light Soup", description: "Goat meat, aromatic spices", price: 22, category: "soup", emoji: "🍲" }
]

const CATEGORIES = ["all", "waakye", "jollof", "beans", "rice", "soup"]

function App() {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [telegramUser, setTelegramUser] = useState(null)
  
  useEffect(() => {
    // Telegram WebApp initialization
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.expand()
      tg.ready()
      if (tg.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user)
      }
    }
  }, [])
  
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }
  
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }
  
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i
      const newQty = i.quantity + delta
      return newQty <= 0 ? null : { ...i, quantity: newQty }
    }).filter(Boolean))
  }
  
  const clearCart = () => setCart([])
  
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = 3.0
  const total = subtotal + deliveryFee
  
  const handleCheckout = async () => {
    if (!telegramUser) {
      alert("Please open this from within Telegram")
      return
    }
    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }
    
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: telegramUser.id,
        items: cart.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
        subtotal: subtotal
      })
    })
    
    if (response.ok) {
      alert("✅ Order placed! Check the bot for payment instructions.")
      clearCart()
      // Optional: close mini app
      window.Telegram?.WebApp?.close()
    } else {
      alert("Failed to place order. Please try again.")
    }
  }
  
  const filteredMenu = activeCategory === "all" 
    ? MENU 
    : MENU.filter(item => item.category === activeCategory)
  
  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section with glass morphism */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass text-white p-6 mx-4 mt-4 rounded-3xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🍲</span>
          <div>
            <h1 className="text-2xl font-bold">GIHOC Canteen</h1>
            <p className="text-white/70 text-sm">Fresh meals • Fast delivery • No queues</p>
          </div>
        </div>
      </motion.div>
      
      {/* Category Filter */}
      <CategoryFilter 
        categories={CATEGORIES} 
        active={activeCategory} 
        setActive={setActiveCategory} 
      />
      
      {/* Menu Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 my-4"
      >
        <AnimatePresence>
          {filteredMenu.map(item => (
            <MenuItem key={item.id} item={item} onAdd={addToCart} />
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Cart Bottom Sheet */}
      <Cart 
        cart={cart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}

export default App