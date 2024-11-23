'use client'

import ShoppingCart from '@/components/Cart/ShoppingCart'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type ShoppingCartProviderProps = {
	children: React.ReactNode
}

type CartItemId = {
	id: string
	quantity: number
}

type ShoppingCartContextProps = {
	openCart: () => void
	closeCart: () => void
	openOrderModal: () => void
	closeOrderModal: () => void
	resetCart: () => void
	getItemQuantity: (id: string) => number
	increaseCartQuantity: (id: string) => void
	decreaseCartQuantity: (id: string) => void
	removeFromCart: (id: string) => void
	setCartQuantity: (quantity: number) => void
	cartQuantity: number
	cartItemsId: CartItemId[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContextProps)

export function useShoppingCart() {
	return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
	const [cartItemsId, setCartItemsId] = useState<CartItemId[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		// Run only on client
		const savedCartItems = localStorage.getItem('cartItems')
		if (savedCartItems) {
			setCartItemsId(JSON.parse(savedCartItems))
		}
		setIsHydrated(true)
	}, [])

	useEffect(() => {
		if (isHydrated) {
			localStorage.setItem('cartItems', JSON.stringify(cartItemsId))
		}
	}, [cartItemsId, isHydrated])

	const cartQuantity = cartItemsId.reduce((quantity, item) => item.quantity + quantity, 0)

	const openCart = () => setIsOpen(true)
	const closeCart = () => setIsOpen(false)
	const openOrderModal = () => {
		setIsOrderModalOpen(true)
		setIsOpen(false)
	}
	const closeOrderModal = () => setIsOrderModalOpen(false)

	const resetCart = () => {
		setCartItemsId([])
		localStorage.removeItem('cartItems')
	}

	const setCartQuantity = (quantity: number) => {
		const updatedItems = cartItemsId.map(item => ({ ...item, quantity }))
		setCartItemsId(updatedItems)
	}

	function getItemQuantity(id: string) {
		return cartItemsId.find(item => item.id === id)?.quantity || 0
	}

	function increaseCartQuantity(id: string) {
		setCartItemsId(currItems => {
			if (currItems.find(item => item.id === id) == null) {
				return [
					...currItems,
					{
						id,
						quantity: 1,
					},
				]
			} else {
				return currItems.map(item => {
					if (item.id === id) {
						return {
							...item,
							quantity: item.quantity + 1,
						}
					} else {
						return item
					}
				})
			}
		})
		toast.success('Товар доданий до корзини')
	}

	function decreaseCartQuantity(id: string) {
		setCartItemsId(currItems => {
			if (currItems.find(item => item.id === id)?.quantity === 1) {
				return currItems.filter(item => item.id !== id)
			} else {
				return currItems.map(item => {
					if (item.id === id) {
						return {
							...item,
							quantity: item.quantity - 1,
						}
					} else {
						return item
					}
				})
			}
		})
		toast.success('Товар видалено з коризни')
	}

	function removeFromCart(id: string) {
		setCartItemsId(currItems => {
			return currItems.filter(item => item.id !== id)
		})
		toast.info('Товар видалено з корзини')
	}

	if (!isHydrated) {
		// Render a loading state or nothing until the component is hydrated
		return null
	}

	return (
		<ShoppingCartContext.Provider
			value={{
				getItemQuantity,
				increaseCartQuantity,
				decreaseCartQuantity,
				removeFromCart,
				openCart,
				closeCart,
				openOrderModal,
				closeOrderModal,
				resetCart,
				setCartQuantity,
				cartItemsId,
				cartQuantity,
			}}
		>
			{children}
			<ShoppingCart isOpen={isOpen} isOrderModalOpen={isOrderModalOpen} />
		</ShoppingCartContext.Provider>
	)
}
