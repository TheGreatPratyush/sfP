import { Navigate, Route, Routes } from "react-router-dom";

// Owner Imports
import OwnerLayout from "./components/layout/OwnerLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Inventory from "./pages/Inventory";
import Categories from "./pages/Categories";
import Variants from "./pages/Variants";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import OrderDetails from "./pages/OrderDetails";

// Storefront Imports
import StorefrontLayout from "./storefront/layout/StorefrontLayout";
import Home from "./storefront/pages/Home";
import Shop from "./storefront/pages/Shop";
import Collection from "./storefront/pages/Collection";
import StorefrontProductDetails from "./storefront/pages/ProductDetails";
import Cart from "./storefront/pages/Cart";
import Checkout from "./storefront/pages/Checkout";
import OrderSuccess from "./storefront/pages/OrderSuccess";

const App = () => {
    return (
        <Routes>
            {/* Storefront Routes */}
            <Route element={<StorefrontLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/collections/:collectionId" element={<Collection />} />
                <Route path="/product/:productId" element={<StorefrontProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
            </Route>

            {/* Owner Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Owner Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<OwnerLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/:id" element={<CustomerDetails />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/variants" element={<Variants />} />
                </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
