import { Bell, Search } from "lucide-react";

import "./Header.css";

const Header = () => {
    return (
        <header className="owner-header">
            <div className="owner-header__left">
                <div className="owner-header__search">
                    <Search
                        className="owner-header__search-icon"
                        size={17}
                        strokeWidth={1.8}
                    />

                    <input
                        type="search"
                        className="owner-header__search-input"
                        placeholder="Search products, SKU..."
                        aria-label="Search products"
                    />
                </div>
            </div>

            <div className="owner-header__right">
                <button
                    type="button"
                    className="owner-header__notification"
                    aria-label="Notifications"
                >
                    <Bell size={19} strokeWidth={1.8} />

                    <span className="owner-header__notification-dot" />
                </button>

                <div className="owner-header__divider" />

                <div className="owner-header__profile">
                    <div className="owner-header__avatar">
                        O
                    </div>

                    <div className="owner-header__profile-info">
                        <span className="owner-header__profile-name">
                            Owner
                        </span>

                        <span className="owner-header__profile-role">
                            Store Administrator
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;