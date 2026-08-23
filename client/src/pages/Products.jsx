import { useState } from "react";
import { Plus } from "lucide-react";

import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

import "./Products.css";

const Products = () => {
    const {
        products,
        loading: productsLoading,
        error: productsError,
        refetch: refetchProducts,
        addProduct,
        editProduct,
        removeProduct,
    } = useProducts();

    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories,
    } = useCategories();

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState(null);

    const [productToDelete, setProductToDelete] =
        useState(null);

    const [mutationLoading, setMutationLoading] =
        useState(false);

    const openCreateForm = () => {
        setEditingProduct(null);
        setFormOpen(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormOpen(true);
    };

    const closeForm = () => {
        if (mutationLoading) {
            return;
        }

        setFormOpen(false);
        setEditingProduct(null);
    };

    const handleProductSubmit = async (productData) => {
        try {
            setMutationLoading(true);

            if (editingProduct) {
                await editProduct(
                    editingProduct.id,
                    productData
                );
            } else {
                await addProduct(productData);
            }

            setFormOpen(false);
            setEditingProduct(null);
        } catch (err) {
            console.error(
                "Failed to save product:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleDeleteRequest = (product) => {
        setProductToDelete(product);
    };

    const handleDeleteCancel = () => {
        if (mutationLoading) {
            return;
        }

        setProductToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) {
            return;
        }

        try {
            setMutationLoading(true);

            await removeProduct(productToDelete.id);

            setProductToDelete(null);
        } catch (err) {
            console.error(
                "Failed to delete product:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleRetry = async () => {
        await Promise.all([
            refetchProducts(),
            refetchCategories(),
        ]);
    };

    if (productsLoading || categoriesLoading) {
        return (
            <section className="products-page">
                <LoadingState message="Loading products..." />
            </section>
        );
    }

    if (productsError || categoriesError) {
        return (
            <section className="products-page">
                <ErrorState
                    message="Unable to load product data."
                    onRetry={handleRetry}
                />
            </section>
        );
    }

    return (
        <section className="products-page">
            <div className="products-page__header">
                <div>
                    <p className="products-page__eyebrow">
                        Catalog
                    </p>

                    <h1 className="products-page__title">
                        Products
                    </h1>

                    <p className="products-page__description">
                        Manage your store products and
                        their information.
                    </p>
                </div>

                <button
                    type="button"
                    className="products-page__add-button"
                    onClick={openCreateForm}
                >
                    <Plus
                        size={15}
                        strokeWidth={1.8}
                    />

                    Add Product
                </button>
            </div>

            <div className="products-page__content">
                <ProductTable
                    products={products}
                    onEdit={openEditForm}
                    onDelete={handleDeleteRequest}
                />
            </div>

            {formOpen && (
                <Modal
                    open={formOpen}
                    onClose={closeForm}
                >
                    <ProductForm
                        initialData={editingProduct}
                        categories={categories}
                        loading={mutationLoading}
                        onSubmit={handleProductSubmit}
                        onCancel={closeForm}
                    />
                </Modal>
            )}

            {productToDelete && (
                <ConfirmDialog
                    open={Boolean(productToDelete)}
                    title="Delete Product"
                    message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
                    loading={mutationLoading}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </section>
    );
};

export default Products;