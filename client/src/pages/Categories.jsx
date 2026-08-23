import { useState } from "react";
import { Plus } from "lucide-react";

import useCategories from "../hooks/useCategories";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryTable from "../components/categories/CategoryTable";

import "./Categories.css";

const Categories = () => {
    const {
        categories,
        loading,
        error,
        refetch,
        addCategory,
        editCategory,
        removeCategory,
    } = useCategories();

    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState(null);

    const [categoryToDelete, setCategoryToDelete] =
        useState(null);

    const [mutationLoading, setMutationLoading] =
        useState(false);

    const openCreateForm = () => {
        setEditingCategory(null);
        setFormOpen(true);
    };

    const openEditForm = (category) => {
        setEditingCategory(category);
        setFormOpen(true);
    };

    const closeForm = () => {
        if (mutationLoading) {
            return;
        }

        setFormOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (categoryData) => {
        try {
            setMutationLoading(true);

            if (editingCategory) {
                await editCategory(
                    editingCategory.id,
                    categoryData
                );
            } else {
                await addCategory(categoryData);
            }

            setFormOpen(false);
            setEditingCategory(null);
        } catch (err) {
            console.error(
                "Failed to save category:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    const handleDeleteRequest = (category) => {
        setCategoryToDelete(category);
    };

    const handleDeleteCancel = () => {
        if (mutationLoading) {
            return;
        }

        setCategoryToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) {
            return;
        }

        try {
            setMutationLoading(true);

            await removeCategory(
                categoryToDelete.id
            );

            setCategoryToDelete(null);
        } catch (err) {
            console.error(
                "Failed to delete category:",
                err
            );
        } finally {
            setMutationLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="categories-page">
                <LoadingState message="Loading categories..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="categories-page">
                <ErrorState
                    message="Unable to load categories."
                    onRetry={refetch}
                />
            </section>
        );
    }

    return (
        <section className="categories-page">
            <div className="categories-page__header">
                <div>
                    <p className="categories-page__eyebrow">
                        Catalog
                    </p>

                    <h1 className="categories-page__title">
                        Categories
                    </h1>

                    <p className="categories-page__description">
                        Organize your products into store
                        categories.
                    </p>
                </div>

                <button
                    type="button"
                    className="categories-page__add-button"
                    onClick={openCreateForm}
                >
                    <Plus
                        size={15}
                        strokeWidth={1.8}
                    />

                    Add Category
                </button>
            </div>

            <div className="categories-page__content">
                <CategoryTable
                    categories={categories}
                    onEdit={openEditForm}
                    onDelete={handleDeleteRequest}
                />
            </div>

            {formOpen && (
                <Modal
                    open={formOpen}
                    onClose={closeForm}
                >
                    <CategoryForm
                        initialData={editingCategory}
                        loading={mutationLoading}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                    />
                </Modal>
            )}

            {categoryToDelete && (
                <ConfirmDialog
                    open={Boolean(categoryToDelete)}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`}
                    loading={mutationLoading}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </section>
    );
};

export default Categories;