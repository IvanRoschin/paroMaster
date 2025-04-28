"use client"

import { getGoodById } from "@/actions/goods"
import ShoppingCart from "@/components/Cart/ShoppingCart"
import { storageKeys } from "@/helpers/storageKeys"
import { CartItem } from "@/types/cart/ICartItem"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
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
    const storedCartData = localStorage.getItem(storageKeys.cart)
    if (storedCartData) {
      try {
        const cartData: CartItem[] = JSON.parse(storedCartData)
        setCart(cartData)
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(storageKeys.cart, JSON.stringify(cart))
    } else {
      localStorage.removeItem(storageKeys.cart)
    }
  }, [cart])

  const cartQuantity = useMemo(
    () => cart.reduce((quantity, item) => quantity + item.quantity, 0),
    [cart]
  )

  const resetCart = useCallback(() => {
    setCart([])
    localStorage.removeItem(storageKeys.cart)
  }, [])

  const setCartQuantity = useCallback((id: string, quantity: number) => {
    setCart(currItems =>
      currItems.map(item => (item.good._id === id ? { ...item, quantity } : item))
    )
  }, [])

  const getItemQuantity = useCallback(
    (id: string) => {
      return cart.find(item => item.good._id === id)?.quantity || 0
    },
    [cart]
  )

  const increaseCartQuantity = useCallback((id: string) => {
    getGoodById(id)
      .then(newGood => {
        setCart(currItems => {
          const existingItem = currItems.find(item => item.good._id === id)
          if (!existingItem) {
            toast.success(`Товар "${newGood.title}" додано до корзини`, { id: `add-${id}` })
            return [...currItems, { good: newGood, quantity: 1 }]
          } else {
            toast.info(`Кількість товару "${existingItem.good.title}" збільшено`, {
              id: `update-${id}`
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
  }, [])

  const decreaseCartQuantity = useCallback((id: string) => {
    setCart(currItems => {
      const existingItem = currItems.find(item => item.good._id === id)

      if (!existingItem) return currItems

      if (existingItem.quantity === 1) {
        toast.warning(`Товар "${existingItem.good.title}" видалено з корзини`, {
          id: `remove-${id}`
        })
        return currItems.filter(item => item.good._id !== id)
      } else {
        toast.info(`Кількість товару "${existingItem.good.title}" зменшено`, {
          id: `decrease-${id}`
        })
        return currItems.map(item =>
          item.good._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart(currItems => currItems.filter(item => item.good._id !== id))
    toast.info("Товар видалено з корзини", { id: `delete-${id}` })
  }, [])

  const contextValue = useMemo(
    () => ({
      resetCart,
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      setCartQuantity,
      cart,
      setCart,
      cartQuantity
    }),
    [cart, cartQuantity, getItemQuantity]
  )

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
      <ShoppingCart />
    </ShoppingCartContext.Provider>
  )
}
