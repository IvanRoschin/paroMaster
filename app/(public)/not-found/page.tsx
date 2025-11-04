'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden text-white">
      {/* Мягкое свечение */}
      <div className="absolute -inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent blur-3xl opacity-60" />

      {/* Летающие частицы */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 1.2 + 0.3,
          }}
          animate={{
            y: ['0%', '-200%'],
            opacity: [0.1, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
          }}
        />
      ))}

      {/* Контент */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        >
          404
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl font-semibold mt-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Sparkles className="text-yellow-400 w-8 h-8" />
          Сторінку не знайдено
        </motion.h2>

        <motion.p
          className="text-gray-300 mt-4 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Схоже, ви потрапили у невідомий всесвіт. Але не хвилюйтесь — ми
          допоможемо вам повернутися додому.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Повернутися на головну
          </Link>
        </motion.div>
      </motion.div>

      {/* Блики */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
    </div>
  );
}
