import {
    ArrowLeft,
    Edit3,
    Package,
    Tag,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getProductById,
    uploadProductImage,
    deleteProductImage,
} from "../api/products.api";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import ProductImageUpload from "../components/products/ProductImageUpload";

import "./ProductDetails.css";

const ProductDetails = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getProductById(productId);

            setProduct(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    // Upload product image
    const handleImageUpload = async ({
        productId,
        file,
    }) => {
        try {
            setImageLoading(true);

            const response =
                await uploadProductImage(
                    productId,
                    file
                );

            console.log(
                "Image uploaded successfully:",
                response
            );

            await fetchProduct();

            return response;
        } catch (err) {
            console.error(
                "Failed to upload product image:",
                err
            );

            throw err;
        } finally {
            setImageLoading(false);
        }
    };

    // Remove product image
    const handleImageRemove = async (imageId) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this product image?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setImageLoading(true);

            await deleteProductImage(
                productId,
                imageId
            );

            await fetchProduct();
        } catch (err) {
            console.error(
                "Failed to remove product image:",
                err
            );
        } finally {
            setImageLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="product-details-page">
                <LoadingState message="Loading product..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="product-details-page">
                <button
                    type="button"
                    className="product-details-page__back"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    <ArrowLeft
                        size={15}
                        strokeWidth={1.8}
                    />

                    Back to products
                </button>

                <ErrorState
                    message={
                        error.message ||
                        "Unable to load product."
                    }
                    onRetry={fetchProduct}
                />
            </section>
        );
    }

    if (!product) {
        return (
            <section className="product-details-page">
                <button
                    type="button"
                    className="product-details-page__back"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    <ArrowLeft
                        size={15}
                        strokeWidth={1.8}
                    />

                    Back to products
                </button>

                <div className="product-details-page__not-found">
                    <Package
                        size={22}
                        strokeWidth={1.8}
                    />

                    <h2>Product not found</h2>

                    <p>
                        The requested product could
                        not be found.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="product-details-page">
            <div className="product-details-page__topbar">
                <button
                    type="button"
                    className="product-details-page__back"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    <ArrowLeft
                        size={15}
                        strokeWidth={1.8}
                    />

                    Back to products
                </button>

                <button
                    type="button"
                    className="product-details-page__edit"
                    onClick={() => {
                        navigate("/products", {
                            state: {
                                editProduct: product,
                            },
                        });
                    }}
                >
                    <Edit3
                        size={14}
                        strokeWidth={1.8}
                    />

                    Edit Product
                </button>
            </div>

            <div className="product-details-page__header">
                <div className="product-details-page__product-icon">
                    {product.name
                        ?.charAt(0)
                        .toUpperCase() || "P"}
                </div>

                <div className="product-details-page__heading">
                    <div className="product-details-page__eyebrow">
                        Product #{product.id}
                    </div>

                    <h1 className="product-details-page__title">
                        {product.name}
                    </h1>

                    <div className="product-details-page__meta">
                        <span>
                            {product.category_name ||
                                "Uncategorized"}
                        </span>

                        <span className="product-details-page__meta-separator">
                            •
                        </span>

                        <span
                            className={`product-details-page__status product-details-page__status--${String(
                                product.status ||
                                    "unknown"
                            ).toLowerCase()}`}
                        >
                            {product.status ||
                                "Unknown"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="product-details-page__grid">
                <div className="product-details-page__card">
                    <div className="product-details-page__card-header">
                        <Tag
                            size={16}
                            strokeWidth={1.8}
                        />

                        <h2>
                            Product Information
                        </h2>
                    </div>

                    <div className="product-details-page__fields">
                        <div className="product-details-page__field">
                            <span>Name</span>

                            <strong>
                                {product.name || "—"}
                            </strong>
                        </div>

                        <div className="product-details-page__field">
                            <span>Category</span>

                            <strong>
                                {product.category_name ||
                                    "Uncategorized"}
                            </strong>
                        </div>

                        <div className="product-details-page__field">
                            <span>Price</span>

                            <strong>
                                ₹
                                {Number(
                                    product.price || 0
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </strong>
                        </div>

                        <div className="product-details-page__field">
                            <span>Discount</span>

                            <strong>
                                {Number(
                                    product.discount_percentage ||
                                        0
                                ).toFixed(2)}
                                %
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="product-details-page__card">
                    <div className="product-details-page__card-header">
                        <Package
                            size={16}
                            strokeWidth={1.8}
                        />

                        <h2>Description</h2>
                    </div>

                    <p className="product-details-page__description">
                        {product.description ||
                            "No description has been added for this product."}
                    </p>
                </div>
            </div>

            <ProductImageUpload
                productId={product.id}
                images={product.images || []}
                loading={imageLoading}
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
            />
        </section>
    );
};

export default ProductDetails;