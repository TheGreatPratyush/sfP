import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    X,
    SlidersHorizontal,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

import "./Products.css";

const PRODUCTS_PER_PAGE = 10;

const Products = () => {
    const location = useLocation();
    const navigate = useNavigate();

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

    // Search
    const [searchQuery, setSearchQuery] =
        useState("");

    // Filters
    const [categoryFilter, setCategoryFilter] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    // Sorting
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });

    // Pagination
    const [currentPage, setCurrentPage] =
        useState(1);

    /*
     * Opens the create product form.
     */
    const openCreateForm = () => {
        setEditingProduct(null);
        setFormOpen(true);
    };

    /*
     * Opens the edit product form.
     */
    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormOpen(true);
    };

    /*
     * Opens the existing ProductForm when coming
     * from Product Details.
     */
    useEffect(() => {
        const productToEdit =
            location.state?.editProduct;

        if (!productToEdit) {
            return;
        }

        const product =
            products.find(
                (item) =>
                    Number(item.id) ===
                    Number(productToEdit.id)
            ) || productToEdit;

        setEditingProduct(product);
        setFormOpen(true);

        /*
         * Clear navigation state so refreshing
         * the Products page does not reopen
         * the modal.
         */
        navigate(location.pathname, {
            replace: true,
            state: {},
        });
    }, [
        location.state,
        location.pathname,
        navigate,
        products,
    ]);

    /*
     * Get unique statuses from the products.
     */
    const availableStatuses = useMemo(() => {
        const statuses = products
            .map((product) =>
                String(
                    product.status || ""
                ).trim()
            )
            .filter(Boolean);

        return [...new Set(statuses)].sort(
            (a, b) =>
                a.localeCompare(b)
        );
    }, [products]);

    /*
     * Step 1:
     * Search + category + status filtering.
     */
    const filteredProducts = useMemo(() => {
        const query = searchQuery
            .trim()
            .toLowerCase();

        return products.filter((product) => {
            const name = String(
                product.name || ""
            ).toLowerCase();

            const id = String(
                product.id || ""
            ).toLowerCase();

            const categoryName = String(
                product.category_name || ""
            ).toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                id.includes(query) ||
                categoryName.includes(query);

            const matchesCategory =
                !categoryFilter ||
                String(
                    product.category_id || ""
                ) === String(categoryFilter);

            const matchesStatus =
                !statusFilter ||
                String(
                    product.status || ""
                ).toLowerCase() ===
                    statusFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }, [
        products,
        searchQuery,
        categoryFilter,
        statusFilter,
    ]);

    /*
     * Step 2:
     * Sort the complete filtered result.
     *
     * Sorting happens BEFORE pagination.
     */
    const sortedProducts = useMemo(() => {
        if (
            !sortConfig.key ||
            !sortConfig.direction
        ) {
            return filteredProducts;
        }

        const sorted = [
            ...filteredProducts,
        ];

        sorted.sort((a, b) => {
            let comparison = 0;

            switch (sortConfig.key) {
                case "name": {
                    const valueA = String(
                        a.name || ""
                    ).toLowerCase();

                    const valueB = String(
                        b.name || ""
                    ).toLowerCase();

                    comparison =
                        valueA.localeCompare(
                            valueB
                        );

                    break;
                }

                case "category": {
                    const valueA = String(
                        a.category_name || ""
                    ).toLowerCase();

                    const valueB = String(
                        b.category_name || ""
                    ).toLowerCase();

                    comparison =
                        valueA.localeCompare(
                            valueB
                        );

                    break;
                }

                case "price": {
                    const valueA = Number(
                        a.price || 0
                    );

                    const valueB = Number(
                        b.price || 0
                    );

                    comparison =
                        valueA - valueB;

                    break;
                }

                case "discount": {
                    const valueA = Number(
                        a.discount_percentage ||
                            0
                    );

                    const valueB = Number(
                        b.discount_percentage ||
                            0
                    );

                    comparison =
                        valueA - valueB;

                    break;
                }

                case "status": {
                    const valueA = String(
                        a.status || ""
                    ).toLowerCase();

                    const valueB = String(
                        b.status || ""
                    ).toLowerCase();

                    comparison =
                        valueA.localeCompare(
                            valueB
                        );

                    break;
                }

                case "created": {
                    const valueA =
                        a.created_at
                            ? new Date(
                                  a.created_at
                              ).getTime()
                            : 0;

                    const valueB =
                        b.created_at
                            ? new Date(
                                  b.created_at
                              ).getTime()
                            : 0;

                    comparison =
                        valueA - valueB;

                    break;
                }

                default:
                    comparison = 0;
            }

            return sortConfig.direction ===
                "desc"
                ? -comparison
                : comparison;
        });

        return sorted;
    }, [
        filteredProducts,
        sortConfig,
    ]);

    /*
     * Step 3:
     * Pagination happens AFTER sorting.
     */
    const totalPages = Math.max(
        1,
        Math.ceil(
            sortedProducts.length /
                PRODUCTS_PER_PAGE
        )
    );

    const paginatedProducts = useMemo(() => {
        const startIndex =
            (currentPage - 1) *
            PRODUCTS_PER_PAGE;

        const endIndex =
            startIndex +
            PRODUCTS_PER_PAGE;

        return sortedProducts.slice(
            startIndex,
            endIndex
        );
    }, [
        sortedProducts,
        currentPage,
    ]);

    /*
     * Generate page numbers.
     */
    const pageNumbers = useMemo(() => {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }, [totalPages]);

    /*
     * Reset to page 1 whenever the search,
     * filters, or sorting changes.
     */
    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchQuery,
        categoryFilter,
        statusFilter,
        sortConfig,
    ]);

    /*
     * Make sure the current page remains valid
     * after products are created/deleted/filtered.
     */
    useEffect(() => {
        setCurrentPage((previousPage) =>
            Math.min(
                previousPage,
                totalPages
            )
        );
    }, [totalPages]);

    /*
     * Handle sorting.
     *
     * First click  = ascending
     * Second click = descending
     * Third click  = reset
     */
    const handleSort = (key) => {
        setSortConfig((previous) => {
            if (previous.key !== key) {
                return {
                    key,
                    direction: "asc",
                };
            }

            if (
                previous.direction ===
                "asc"
            ) {
                return {
                    key,
                    direction: "desc",
                };
            }

            return {
                key: null,
                direction: null,
            };
        });
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const clearFilters = () => {
        setCategoryFilter("");
        setStatusFilter("");
    };

    const hasActiveFilters =
        Boolean(categoryFilter) ||
        Boolean(statusFilter);

    const closeForm = () => {
        if (mutationLoading) {
            return;
        }

        setFormOpen(false);
        setEditingProduct(null);
    };

    const handleProductSubmit = async (
        productData
    ) => {
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

    const handleDeleteRequest = (
        product
    ) => {
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

            await removeProduct(
                productToDelete.id
            );

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

    const goToPreviousPage = () => {
        setCurrentPage((previousPage) =>
            Math.max(
                previousPage - 1,
                1
            )
        );
    };

    const goToNextPage = () => {
        setCurrentPage((previousPage) =>
            Math.min(
                previousPage + 1,
                totalPages
            )
        );
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    /*
     * Results range.
     */
    const startItem =
        sortedProducts.length === 0
            ? 0
            : (currentPage - 1) *
                  PRODUCTS_PER_PAGE +
              1;

    const endItem = Math.min(
        currentPage *
            PRODUCTS_PER_PAGE,
        sortedProducts.length
    );

    if (
        productsLoading ||
        categoriesLoading
    ) {
        return (
            <section className="products-page">
                <LoadingState message="Loading products..." />
            </section>
        );
    }

    if (
        productsError ||
        categoriesError
    ) {
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

            {/* Search and Filters */}
            <div className="products-page__toolbar">
                <div className="products-page__search">
                    <Search
                        size={16}
                        strokeWidth={1.8}
                    />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        placeholder="Search products..."
                        aria-label="Search products"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            aria-label="Clear search"
                        >
                            <X
                                size={15}
                                strokeWidth={1.8}
                            />
                        </button>
                    )}
                </div>

                <div className="products-page__filters">
                    <div className="products-page__filter">
                        <SlidersHorizontal
                            size={15}
                            strokeWidth={1.8}
                        />

                        <select
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by category"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map(
                                (category) => (
                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {
                                            category.name
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="products-page__filter">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by status"
                        >
                            <option value="">
                                All Statuses
                            </option>

                            {availableStatuses.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="products-page__clear-filters"
                            onClick={
                                clearFilters
                            }
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="products-page__results">
                Showing{" "}
                <strong>
                    {startItem}-{endItem}
                </strong>{" "}
                of{" "}
                <strong>
                    {sortedProducts.length}
                </strong>{" "}
                products
            </div>

            {/* Product Table */}
            <div className="products-page__content">
                <ProductTable
                    products={
                        paginatedProducts
                    }
                    onEdit={openEditForm}
                    onDelete={
                        handleDeleteRequest
                    }
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />
            </div>

            {/* Pagination */}
            {sortedProducts.length > 0 &&
                totalPages > 1 && (
                    <div className="products-page__pagination">
                        <button
                            type="button"
                            className="products-page__pagination-button"
                            onClick={
                                goToPreviousPage
                            }
                            disabled={
                                currentPage ===
                                1
                            }
                        >
                            ← Previous
                        </button>

                        <div className="products-page__pagination-pages">
                            {pageNumbers.map(
                                (page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        className={`products-page__pagination-page ${
                                            currentPage ===
                                            page
                                                ? "products-page__pagination-page--active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            goToPage(
                                                page
                                            )
                                        }
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            type="button"
                            className="products-page__pagination-button"
                            onClick={
                                goToNextPage
                            }
                            disabled={
                                currentPage ===
                                totalPages
                            }
                        >
                            Next →
                        </button>
                    </div>
                )}

            {/* Product Form */}
            {formOpen && (
                <Modal
                    open={formOpen}
                    onClose={closeForm}
                >
                    <ProductForm
                        initialData={
                            editingProduct
                        }
                        categories={
                            categories
                        }
                        loading={
                            mutationLoading
                        }
                        onSubmit={
                            handleProductSubmit
                        }
                        onCancel={
                            closeForm
                        }
                    />
                </Modal>
            )}

            {/* Delete Confirmation */}
            {productToDelete && (
                <ConfirmDialog
                    open={Boolean(
                        productToDelete
                    )}
                    title="Delete Product"
                    message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
                    loading={
                        mutationLoading
                    }
                    onConfirm={
                        handleDeleteConfirm
                    }
                    onCancel={
                        handleDeleteCancel
                    }
                />
            )}
        </section>
    );
};

export default Products;