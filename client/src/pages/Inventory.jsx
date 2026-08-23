import { useState } from "react";

import {
    PackagePlus,
    PackageSearch,
    RefreshCw,
} from "lucide-react";

import useInventory from "../hooks/useInventory";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Modal from "../components/common/Modal";

import InventoryTable from "../components/inventory/InventoryTable";
import StockUpdateForm from "../components/inventory/StockUpdateForm";
import CreateInventoryForm from "../components/inventory/CreateInventoryForm";

import "./Inventory.css";

const Inventory = () => {
    const {
        inventory,
        loading,
        error,
        refetch,
        addInventory,
        updateStock,
        removeInventory,
    } = useInventory();

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [createModalOpen, setCreateModalOpen] =
        useState(false);

    const [mutationLoading, setMutationLoading] =
        useState(false);

    const openUpdateForm = (item) => {
        setSelectedItem(item);
    };

    const closeUpdateForm = () => {
        if (mutationLoading) {
            return;
        }

        setSelectedItem(null);
    };

    const openCreateForm = () => {
        if (mutationLoading) {
            return;
        }

        setCreateModalOpen(true);
    };

    const closeCreateForm = () => {
        if (mutationLoading) {
            return;
        }

        setCreateModalOpen(false);
    };

    const handleCreateInventory = async (inventoryData) => {
        try {
            setMutationLoading(true);

            await addInventory(inventoryData);

            setCreateModalOpen(false);
        } catch (err) {
            console.error(
                "Failed to create inventory:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleUpdateStock = async (stockData) => {
        try {
            setMutationLoading(true);

            await updateStock(
                stockData.variantId,
                stockData.quantity,
                stockData.lowStockThreshold
            );

            setSelectedItem(null);
        } catch (err) {
            console.error(
                "Failed to update inventory:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleDeleteInventory = async (variantId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this inventory record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setMutationLoading(true);

            await removeInventory(variantId);
        } catch (err) {
            console.error(
                "Failed to delete inventory:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="inventory-page">
                <LoadingState message="Loading inventory..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="inventory-page">
                <ErrorState
                    message={
                        error.message ||
                        "Unable to load inventory."
                    }
                    onRetry={refetch}
                />
            </section>
        );
    }

    return (
        <section className="inventory-page">
            <div className="inventory-page__header">
                <div>
                    <p className="inventory-page__eyebrow">
                        Operations
                    </p>

                    <h1 className="inventory-page__title">
                        Inventory
                    </h1>

                    <p className="inventory-page__description">
                        Monitor stock levels and keep your
                        product inventory up to date.
                    </p>
                </div>

                <div className="inventory-page__actions">
                    <button
                        type="button"
                        className="inventory-page__refresh"
                        onClick={refetch}
                        disabled={
                            loading ||
                            mutationLoading
                        }
                    >
                        <RefreshCw
                            size={15}
                            strokeWidth={1.8}
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        className="inventory-page__add"
                        onClick={openCreateForm}
                        disabled={mutationLoading}
                    >
                        <PackagePlus
                            size={15}
                            strokeWidth={1.8}
                        />

                        Add Inventory
                    </button>
                </div>
            </div>

            <div className="inventory-page__summary">
                <div className="inventory-page__summary-icon">
                    <PackageSearch
                        size={18}
                        strokeWidth={1.8}
                    />
                </div>

                <div>
                    <span className="inventory-page__summary-label">
                        Inventory Records
                    </span>

                    <strong className="inventory-page__summary-value">
                        {inventory.length}
                    </strong>
                </div>
            </div>

            <div className="inventory-page__content">
                <InventoryTable
                    inventory={inventory}
                    onUpdateStock={openUpdateForm}
                    onDelete={handleDeleteInventory}
                />
            </div>

            {/* Create Inventory Modal */}
            {createModalOpen && (
                <Modal
                    open={createModalOpen}
                    onClose={closeCreateForm}
                >
                    <CreateInventoryForm
                        loading={mutationLoading}
                        onSubmit={handleCreateInventory}
                        onCancel={closeCreateForm}
                    />
                </Modal>
            )}

            {/* Update Inventory Modal */}
            {selectedItem && (
                <Modal
                    open={Boolean(selectedItem)}
                    onClose={closeUpdateForm}
                >
                    <StockUpdateForm
                        inventoryItem={selectedItem}
                        loading={mutationLoading}
                        onSubmit={handleUpdateStock}
                        onCancel={closeUpdateForm}
                    />
                </Modal>
            )}
        </section>
    );
};

export default Inventory;