import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCatalog } from '../hooks/useCatalog';

const StoreHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { customer, logout } = useCustomerAuth();
    const { categories } = useCatalog();
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

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
                {categories.slice(0, 5).map(cat => (
                    <Link key={cat.id} to={`/collections/${cat.id}`} className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>{cat.title}</Link>
                ))}
            
                {customer ? (
                    <>
                        <Link to="/account" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                        <Link to="/account/orders" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                        <button className="store-header__nav-link" style={{background:'none',border:'none',fontFamily:'inherit',fontSize:'inherit'}} onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="store-header__nav-link" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                    </>
                )}
            </nav>


            <div className="store-header__logo">
                <Link to="/">
                    <h1>RANGRASIYA</h1>
                </Link>
            </div>

            <div className="store-header__icons">
                <div className="store-header__icon"><Search size={20} /></div>

                <div className="store-header__icon store-header__account-wrapper" 
                     onMouseEnter={() => setAccountDropdownOpen(true)} 
                     onMouseLeave={() => setAccountDropdownOpen(false)}>
                    <Link to={customer ? "/account" : "/login"} style={{color: 'inherit', display: 'flex', alignItems: 'center'}}>
                        <User size={20} />
                    </Link>
                    {accountDropdownOpen && (
                        <div className="store-header__account-dropdown">
                            {customer ? (
                                <>
                                    <Link to="/account" className="dropdown-item" style={{fontWeight: 'bold', color: 'var(--sf-color-primary)'}}>Hi, {customer.name}</Link>
                                    <Link to="/account/orders" className="dropdown-item">My Orders</Link>
                                    <button onClick={logout} className="dropdown-item" style={{color: '#d32f2f'}}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="dropdown-item">Login</Link>
                                    <Link to="/register" className="dropdown-item">Register</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button className="store-header__icon store-header__cart-btn" onClick={toggleCart} aria-label="Open Cart">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && <span className="store-header__cart-count">{cartCount}</span>}
                </button>
            </div>
        </header>
    );
};

export default StoreHeader;
