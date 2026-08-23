import { useState } from "react";
import { Plus } from "lucide-react";

import useVariants from "../hooks/useVariants";
import useProducts from "../hooks/useProducts";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

import VariantForm from "../components/variants/VariantForm";
import VariantTable from "../components/variants/VariantTable";

import "./Variants.css";

const Variants = () => {
    const {
        variants,
        loading: variantsLoading,
        error: variantsError,
        refetch: refetchVariants,
        addVariant,
        editVariant,
        removeVariant,
    } = useVariants();

    const {
        products,
        loading: productsLoading,
        error: productsError,
        refetch: refetchProducts,
    } = useProducts();

    const [formOpen, setFormOpen] = useState(false);
    const [editingVariant, setEditingVariant] =
        useState(null);

    const [variantToDelete, setVariantToDelete] =
        useState(null);

    const [mutationLoading, setMutationLoading] =
        useState(false);

    const openCreateForm = () => {
        setEditingVariant(null);
        setFormOpen(true);
    };

    const openEditForm = (variant) => {
        setEditingVariant(variant);
        setFormOpen(true);
    };

    const closeForm = () => {
        if (mutationLoading) {
            return;
        }

        setFormOpen(false);
        setEditingVariant(null);
    };

    const handleSubmit = async (variantData) => {
        try {
            setMutationLoading(true);

            if (editingVariant) {
                await editVariant(
                    editingVariant.id,
                    variantData
                );
            } else {
                await addVariant(variantData);
            }

            setFormOpen(false);
            setEditingVariant(null);
        } catch (err) {
            console.error(
                "Failed to save variant:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleDeleteRequest = (variant) => {
        setVariantToDelete(variant);
    };

    const handleDeleteCancel = () => {
        if (mutationLoading) {
            return;
        }

        setVariantToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!variantToDelete) {
            return;
        }

        try {
            setMutationLoading(true);

            await removeVariant(variantToDelete.id);

            setVariantToDelete(null);
        } catch (err) {
            console.error(
                "Failed to delete variant:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleRetry = async () => {
        await Promise.all([
            refetchVariants(),
            refetchProducts(),
        ]);
    };

    if (variantsLoading || productsLoading) {
        return (
            <section className="variants-page">
                <LoadingState message="Loading variants..." />
            </section>
        );
    }

    if (variantsError || productsError) {
        return (
            <section className="variants-page">
                <ErrorState
                    message="Unable to load variant data."
                    onRetry={handleRetry}
                />
            </section>
        );
    }

    return (
        <section className="variants-page">
            <div className="variants-page__header">
                <div>
                    <p className="variants-page__eyebrow">
                        Product Options
                    </p>

                    <h1 className="variants-page__title">
                        Variants
                    </h1>

                    <p className="variants-page__description">
                        Manage product sizes, colors, SKUs,
                        and variant pricing.
                    </p>
                </div>

                <button
                    type="button"
                    className="variants-page__add-button"
                    onClick={openCreateForm}
                >
                    <Plus
                        size={15}
                        strokeWidth={1.8}
                    />

                    Add Variant
                </button>
            </div>

            <div className="variants-page__content">
                <VariantTable
                    variants={variants}
                    onEdit={openEditForm}
                    onDelete={handleDeleteRequest}
                />
            </div>

            {formOpen && (
                <Modal
                    open={formOpen}
                    onClose={closeForm}
                >
                    <VariantForm
                        products={products}
                        initialData={editingVariant}
                        loading={mutationLoading}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                    />
                </Modal>
            )}

            {variantToDelete && (
                <ConfirmDialog
                    open={Boolean(variantToDelete)}
                    title="Delete Variant"
                    message={`Are you sure you want to delete variant "${variantToDelete.sku || variantToDelete.id}"? This action cannot be undone.`}
                    loading={mutationLoading}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </section>
    );
};

export default Variants;