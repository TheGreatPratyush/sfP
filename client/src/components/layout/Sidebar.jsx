import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";

import "./Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__logo">sfP</div>

                <div className="sidebar__brand-info">
                    <span className="sidebar__brand-name">sfP</span>
                    <span className="sidebar__brand-label">
                        Owner Panel
                    </span>
                </div>
            </div>

            <nav className="sidebar__navigation">
                <p className="sidebar__section-title">Management</p>

                <div className="sidebar__links">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar__link ${
                                        isActive
                                            ? "sidebar__link--active"
                                            : ""
                                    }`
                                }
                            >
                                <Icon
                                    className="sidebar__link-icon"
                                    size={18}
                                    strokeWidth={1.8}
                                />

                                <span className="sidebar__link-label">
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__status">
                    <span className="sidebar__status-dot" />

                    <div className="sidebar__status-info">
                        <span className="sidebar__status-title">
                            System Status
                        </span>

                        <span className="sidebar__status-text">
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;