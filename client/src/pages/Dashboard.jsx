import {
    AlertTriangle,
    Boxes,
    FolderTree,
    Package,
    ShoppingBag,
} from "lucide-react";

import useDashboard from "../hooks/useDashboard";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import StatCard from "../components/dashboard/StatCard";
import InventoryOverview from "../components/dashboard/InventoryOverview";
import CategoryDistribution from "../components/dashboard/CategoryDistribution";
import LowStockTable from "../components/dashboard/LowStockTable";
import RecentProducts from "../components/dashboard/RecentProducts";

import "./Dashboard.css";

const Dashboard = () => {
    const {
        dashboard,
        loading,
        error,
        refetch,
    } = useDashboard();

    if (loading) {
        return (
            <section className="dashboard-page">
                <LoadingState message="Loading dashboard..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="dashboard-page">
                <ErrorState
                    message="Unable to load dashboard data."
                    onRetry={refetch}
                />
            </section>
        );
    }

    const summary = dashboard?.summary || {};
    const inventory = dashboard?.inventory || {};

    return (
        <section className="dashboard-page">
            <div className="dashboard-page__header">
                <div>
                    <p className="dashboard-page__eyebrow">
                        Overview
                    </p>

                    <h1 className="dashboard-page__title">
                        Dashboard
                    </h1>

                    <p className="dashboard-page__description">
                        Monitor your store, inventory, and products from
                        one place.
                    </p>
                </div>
            </div>

            <div className="dashboard-page__stats">
                <StatCard
                    label="Total Products"
                    value={summary.total_products ?? 0}
                    description="Products in your catalog"
                    icon={ShoppingBag}
                />

                <StatCard
                    label="Total Variants"
                    value={summary.total_variants ?? 0}
                    description="Product variants available"
                    icon={Boxes}
                />

                <StatCard
                    label="Categories"
                    value={summary.total_categories ?? 0}
                    description="Active product categories"
                    icon={FolderTree}
                />

                <StatCard
                    label="Total Stock"
                    value={summary.total_stock ?? 0}
                    description="Units currently in inventory"
                    icon={Package}
                />
            </div>

            <div className="dashboard-page__overview-grid">
                <InventoryOverview
                    lowStock={Number(inventory.low_stock || 0)}
                    outOfStock={Number(inventory.out_of_stock || 0)}
                />

                <CategoryDistribution
                    categories={dashboard?.categoryDistribution || []}
                />
            </div>

            <div className="dashboard-page__section">
                <LowStockTable
                    products={dashboard?.lowStockProducts || []}
                />
            </div>

            <div className="dashboard-page__section">
                <RecentProducts
                    products={dashboard?.recentProducts || []}
                />
            </div>
        </section>
    );
};

export default Dashboard;