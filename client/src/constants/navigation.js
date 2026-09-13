import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Package,
    Boxes,
    Tags,
    Layers,
} from "lucide-react";

export const navigationItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },

    {
        label: "Orders",
        path: "/orders",
        icon: ShoppingCart,
    },

    {
        label: "Customers",
        path: "/customers",
        icon: Users,
    },

    {
        label: "Products",
        path: "/products",
        icon: Package,
    },

    {
        label: "Inventory",
        path: "/inventory",
        icon: Boxes,
    },

    {
        label: "Categories",
        path: "/categories",
        icon: Tags,
    },

    {
        label: "Variants",
        path: "/variants",
        icon: Layers,
    },
];