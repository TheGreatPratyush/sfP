import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('sfp_cart');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse cart from local storage', e);
        }
        return [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('sfp_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);
    const openCart = () => setIsCartOpen(true);

    const addToCart = (product, variant, quantity) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(item => item.variant.id === variant.id);
            if (existingIndex >= 0) {
                // Update quantity, respecting stock limits
                const newItems = [...prev];
                const newQuantity = newItems[existingIndex].quantity + quantity;
                newItems[existingIndex].quantity = Math.min(newQuantity, variant.stock);
                return newItems;
            } else {
                // Add new item
                const price = (variant.price !== undefined && variant.price !== null && !isNaN(variant.price)) ? variant.price : product.price;
                return [...prev, {
                    product: {
                        id: product.id,
                        title: product.title,
                        price: price,
                        image: product.image || (product.images && product.images[0])
                    },
                    variant,
                    quantity: Math.min(quantity, variant.stock)
                }];
            }
        });
        openCart(); // Show feedback by opening drawer
    };

    const updateQuantity = (variantId, newQuantity) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.variant.id === variantId) {
                    const validQuantity = Math.max(1, Math.min(newQuantity, item.variant.stock));
                    return { ...item, quantity: validQuantity };
                }
                return item;
            });
        });
    };

    const removeFromCart = (variantId) => {
        setCartItems(prev => prev.filter(item => item.variant.id !== variantId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            isCartOpen,
            toggleCart,
            closeCart,
            openCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
