'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const login = useStore(s => s.login)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="dn-card max-w-md w-full p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--dn-surface-muted)] transition-colors">
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-[var(--dn-border-strong)]/10 flex items-center justify-center mx-auto mb-5">
                <GraduationCap size={32} className="text-[var(--dn-border-strong)]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Chào bạn!</h2>
              <p className="text-sm text-[var(--dn-text-secondary)] mb-2">Đăng nhập để tham gia cộng đồng ĐN-UniShare</p>
              <p className="text-xs text-[var(--dn-text-secondary)] mb-8">
                Chỉ chấp nhận email trường: <strong>@sv1.dut.udn.vn</strong>, <strong>@due.edu.vn</strong>, ...
              </p>
              <button
                onClick={() => login('google')}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 rounded-full border-[var(--dn-border-strong)] hover:bg-[var(--dn-surface-muted)] transition-all font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng nhập với Google
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
