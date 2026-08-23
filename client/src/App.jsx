import { Navigate, Route, Routes } from "react-router-dom";

import OwnerLayout from "./components/layout/OwnerLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Inventory from "./pages/Inventory";
import Categories from "./pages/Categories";
import Variants from "./pages/Variants";

const App = () => {
    return (
        <Routes>
            <Route element={<OwnerLayout />}>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/inventory"
                    element={<Inventory />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/variants"
                    element={<Variants />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Route>
        </Routes>
    );
};

export default App;