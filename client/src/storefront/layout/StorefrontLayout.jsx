import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar';
import StoreHeader from '../components/StoreHeader';
import StoreFooter from '../components/StoreFooter';
import CartDrawer from '../components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import '../styles/storefront.css';

const StorefrontLayout = () => {
    return (
        <CartProvider>
            <div className="storefront">
                <AnnouncementBar />
                <StoreHeader />
                <main className="storefront-main">
                    <Outlet />
                </main>
                <StoreFooter />
                <CartDrawer />
            </div>
        </CartProvider>
    );
};

export default StorefrontLayout;
