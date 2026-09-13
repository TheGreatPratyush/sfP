import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const StoreHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleCart, cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className={`store-header ${scrolled ? 'store-header--scrolled' : ''}`}>
            <button className="store-header__hamburger" onClick={toggleMobileMenu} aria-label="Menu">
                <Menu size={24} />
            </button>
            
            <nav className={`store-header__nav ${mobileMenuOpen ? 'store-header__nav--mobile-open' : ''}`}>
                {mobileMenuOpen && (
                    <button className="store-header__close-mobile" onClick={toggleMobileMenu}>
                        <X size={24} />
                    </button>
                )}
                <Link to="/" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/shop" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
                <Link to="/collections/new-arrivals" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
                <Link to="/collections/straight-suits" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Straight Suits</Link>
                <Link to="/collections/co-ord-sets" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Co-ord Sets</Link>
                <Link to="/collections/girls-kurti" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Girls Kurti</Link>
            </nav>

            <div className="store-header__logo">
                <Link to="/">
                    <h1>KURTIWALAS.IN</h1>
                </Link>
            </div>

            <div className="store-header__icons">
                <div className="store-header__icon"><Search size={20} /></div>
                <button className="store-header__icon store-header__cart-btn" onClick={toggleCart} aria-label="Open Cart">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && <span className="store-header__cart-count">{cartCount}</span>}
                </button>
            </div>
        </header>
    );
};

export default StoreHeader;
