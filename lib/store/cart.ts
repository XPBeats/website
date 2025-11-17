import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LicenseType } from '@prisma/client'

export interface CartItem {
  beatId: string
  title: string
  licenseType: LicenseType
  price: number
  coverImageUrl?: string
  slug: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (beatId: string, licenseType: LicenseType) => void
  updateQuantity: (beatId: string, licenseType: LicenseType, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setIsOpen: (isOpen: boolean) => void
  getTotalPrice: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          // Check if item already exists (same beat + license type)
          const existingIndex = state.items.findIndex(
            (i) => i.beatId === item.beatId && i.licenseType === item.licenseType
          )
          
          if (existingIndex >= 0) {
            // Item already exists, don't add duplicate
            return state
          }
          
          return {
            items: [...state.items, item],
          }
        })
      },
      
      removeItem: (beatId, licenseType) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.beatId === beatId && item.licenseType === licenseType)
          ),
        }))
      },
      
      updateQuantity: (beatId, licenseType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(beatId, licenseType)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.beatId === beatId && item.licenseType === licenseType
              ? { ...item }
              : item
          ),
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      setIsOpen: (isOpen) => {
        set({ isOpen })
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0)
      },
      
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'xp-beats-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)