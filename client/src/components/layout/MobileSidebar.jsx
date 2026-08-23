import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

import { navigationItems } from "../../constants/navigation";

import "./MobileSidebar.css";

const MobileSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    className="mobile-sidebar__overlay"
                    onClick={onClose}
                    aria-label="Close navigation"
                />
            )}

            <aside
                className={`mobile-sidebar ${
                    isOpen ? "mobile-sidebar--open" : ""
                }`}
            >
                <div className="mobile-sidebar__header">
                    <div className="mobile-sidebar__brand">
                        <div className="mobile-sidebar__logo">
                            sfP
                        </div>

                        <div className="mobile-sidebar__brand-info">
                            <span className="mobile-sidebar__brand-name">
                                sfP
                            </span>

                            <span className="mobile-sidebar__brand-label">
                                Owner Panel
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="mobile-sidebar__close"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <X size={20} strokeWidth={1.8} />
                    </button>
                </div>

                <nav className="mobile-sidebar__navigation">
                    <p className="mobile-sidebar__section-title">
                        Management
                    </p>

                    <div className="mobile-sidebar__links">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `mobile-sidebar__link ${
                                            isActive
                                                ? "mobile-sidebar__link--active"
                                                : ""
                                        }`
                                    }
                                >
                                    <Icon
                                        className="mobile-sidebar__link-icon"
                                        size={18}
                                        strokeWidth={1.8}
                                    />

                                    <span className="mobile-sidebar__link-label">
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                <div className="mobile-sidebar__footer">
                    <div className="mobile-sidebar__status">
                        <span className="mobile-sidebar__status-dot" />

                        <div className="mobile-sidebar__status-info">
                            <span className="mobile-sidebar__status-title">
                                System Status
                            </span>

                            <span className="mobile-sidebar__status-text">
                                All systems operational
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default MobileSidebar;