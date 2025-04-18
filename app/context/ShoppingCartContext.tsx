"use client"

import { getGoodById } from "@/actions/goods"
import ShoppingCart from "@/components/Cart/ShoppingCart"
import { storageKeys } from "@/helpers/storageKeys"
import { CartItem } from "@/types/cart/ICartItem"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

type ShoppingCartProviderProps = {
  children: React.ReactNode
}

type ShoppingCartContextProps = {
  resetCart: () => void
  getItemQuantity: (id: string) => number
  increaseCartQuantity: (id: string) => void
  decreaseCartQuantity: (id: string) => void
  removeFromCart: (id: string) => void
  setCartQuantity: (id: string, quantity: number) => void
  cartQuantity: number
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

const ShoppingCartContext = createContext({} as ShoppingCartContextProps)

export function useShoppingCart() {
  return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCartData = sessionStorage.getItem(storageKeys.cart)
    if (storedCartData) {
      try {
        const cartData = JSON.parse(storedCartData)
        setCart(cartData)
      } catch (error) {
        console.error("Error parsing JSON from sessionStorage:", error)
      }
    }
  }, [])

  const cartQuantity = cart.reduce((quantity, item) => item.quantity + quantity, 0)

  const resetCart = () => {
    setCart([])
    sessionStorage.removeItem(storageKeys.cart)
  }

  const setCartQuantity = (id: string, quantity: number) => {
    setCart(currItems =>
      currItems.map(item => (item.good._id === id ? { ...item, quantity } : item))
    )
  }

  const getItemQuantity = (id: string) => {
    return cart.find(item => item.good._id === id)?.quantity || 0
  }
  const increaseCartQuantity = (id: string) => {
    getGoodById(id)
      .then(newGood => {
        setCart(currItems => {
          const existingItem = currItems.find(item => item.good._id === id)
          if (!existingItem) {
            toast.success(`Товар "${newGood.title}" додано до корзини`, {
              id: `add-${id}` // унікальний ID для нотифікації
            })
            return [...currItems, { good: newGood, quantity: 1 }]
          } else {
            toast.info(`Кількість товару "${existingItem.good.title}" збільшено`, {
              id: `update-${id}` // унікальний ID для нотифікації
            })
            return currItems.map(item =>
              item.good._id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
          }
        })
      })
      .catch(error => {
        console.error("Error fetching good:", error)
        toast.error("Не вдалося додати товар до корзини")
      })
  }

  const decreaseCartQuantity = (id: string) => {
    setCart(currItems => {
      const existingItem = currItems.find(item => item.good._id === id)

      if (!existingItem) return currItems

      if (existingItem.quantity === 1) {
        toast.warning(`Товар "${existingItem.good.title}" видалено з корзини`, {
          id: `remove-${id}` // унікальний ID для нотифікації
        })
        return currItems.filter(item => item.good._id !== id)
      } else {
        toast.info(`Кількість товару "${existingItem.good.title}" зменшено`, {
          id: `decrease-${id}` // унікальний ID для нотифікації
        })
        return currItems.map(item =>
          item.good._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart(currItems => currItems.filter(item => item.good._id !== id))
    toast.info("Товар видалено з корзини")
  }

  const contextValue = useMemo(
    () => ({
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      resetCart,
      setCartQuantity,
      cart,
      setCart,
      cartQuantity
    }),
    [cart, cartQuantity]
  )

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
      <ShoppingCart />
    </ShoppingCartContext.Provider>
  )
}
