import React from 'react'
import { motion } from 'framer-motion'

const CategoryFilter = ({ categories, active, setActive }) => {
  return (
    <div className="flex overflow-x-auto gap-2 px-4 py-3 no-scrollbar">
      {categories.map(cat => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(cat)}
          className={`px-5 py-2 rounded-full capitalize text-sm font-medium transition-all ${
            active === cat
              ? 'bg-amber-500 text-white shadow-lg'
              : 'glass text-white/70 hover:bg-white/10'
          }`}
        >
          {cat === 'all' ? 'All' : cat}
        </motion.button>
      ))}
    </div>
  )
}

export default CategoryFilter