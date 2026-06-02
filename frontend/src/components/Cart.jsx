import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Cart = ({ cart, subtotal, deliveryFee, total, onUpdateQuantity, onRemove, onCheckout }) => {
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  
  return (
    <motion.div
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 glass rounded-t-3xl p-4 shadow-2xl border-t border-white/20"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-semibold">🛒 Your Order</span>
        <span className="bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-sm">
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <AnimatePresence>
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-white/50 py-6"
          >
            Your cart is empty. Tap on any meal to add.
          </motion.div>
        ) : (
          <motion.div>
            {cart.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center py-2 border-b border-white/10"
              >
                <div className="flex-1">
                  <span className="text-white">{item.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="bg-white/10 rounded-full w-6 h-6 text-white"
                    >-</button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="bg-white/10 rounded-full w-6 h-6 text-white"
                    >+</button>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="ml-2 text-red-400 text-xs"
                    >remove</button>
                  </div>
                </div>
                <span className="text-amber-300 font-mono">₵{item.price * item.quantity}</span>
              </motion.div>
            ))}
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-white/70 text-sm">
                <span>Subtotal</span>
                <span>₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70 text-sm">
                <span>Delivery fee</span>
                <span>₵{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/20">
                <span>Total</span>
                <span className="text-amber-400">₵{total.toFixed(2)}</span>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ backgroundColor: "#f59e0b" }}
              onClick={onCheckout}
              className="w-full mt-4 bg-amber-500 text-white py-3 rounded-2xl font-bold text-lg shadow-lg"
            >
              Place Order →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Cart