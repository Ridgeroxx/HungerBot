import React from 'react'
import { motion } from 'framer-motion'

const MenuItem = ({ item, onAdd }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -4 }}
      className="glass-card p-4 cursor-pointer"
      onClick={() => onAdd(item)}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-3xl mr-2">{item.emoji}</span>
          <h3 className="text-white font-semibold text-lg">{item.name}</h3>
          <p className="text-white/50 text-sm mt-1">{item.description}</p>
          <p className="text-amber-400 font-bold mt-2">₵{item.price}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-amber-500/20 text-amber-400 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold border border-amber-500/30"
        >
          +
        </motion.button>
      </div>
    </motion.div>
  )
}

export default MenuItem