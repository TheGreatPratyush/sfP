import React from 'react';
import { Link } from 'react-router-dom';

const StoreFooter = () => {
    return (
        <footer className="store-footer">
            <div className="store-footer__grid">
                <div className="store-footer__column">
                    <h4 className="store-footer__column-title">Quick Links</h4>
                    <nav className="store-footer__link-list">
                        <Link to="#" className="store-footer__link">About Us</Link>
                        <Link to="#" className="store-footer__link">Contact Us</Link>
                        <Link to="#" className="store-footer__link">Privacy Policy</Link>
                        <Link to="#" className="store-footer__link">Terms of Service</Link>
                        <Link to="#" className="store-footer__link">Refund Policy</Link>
                        <Link to="#" className="store-footer__link">Shipping Policy</Link>
                        <a href="mailto:pratushgupta27199@gmail.com" className="store-footer__link">Designed &amp; Developed</a>
                    </nav>
                </div>
            </div>
            
            <div className="store-footer__bottom">
                <p className="store-footer__copyright">
                    &copy; 2026 RANGRASIYA
                </p>
            </div>
        </footer>
    );
};

export default StoreFooter;
