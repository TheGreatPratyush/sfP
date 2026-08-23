import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

import "./OwnerLayout.css";

const OwnerLayout = () => {
    return (
        <div className="owner-layout">
            <Sidebar />

            <div className="owner-layout__main">
                <Header />

                <main className="owner-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;