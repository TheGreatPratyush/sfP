import { ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./RecentProducts.css";

const RecentProducts = ({ products = [] }) => {
    const navigate = useNavigate();

    return (
        <section className="recent-products">
            <div className="recent-products__header">
                <div>
                    <p className="recent-products__eyebrow">
                        Catalog
                    </p>

                    <h2 className="recent-products__title">
                        Recent Products
                    </h2>
                </div>

                <button
                    type="button"
                    className="recent-products__view-all"
                    onClick={() => navigate("/products")}
                >
                    View all
                    <ArrowRight size={14} strokeWidth={1.8} />
                </button>
            </div>

            {products.length === 0 ? (
                <div className="recent-products__empty">
                    <div className="recent-products__empty-icon">
                        <Package size={18} strokeWidth={1.8} />
                    </div>

                    <h3 className="recent-products__empty-title">
                        No products yet
                    </h3>

                    <p className="recent-products__empty-text">
                        Recently added products will appear here.
                    </p>
                </div>
            ) : (
                <div className="recent-products__list">
                    {products.map((product) => (
                        <button
                            type="button"
                            className="recent-products__item"
                            key={product.id}
                            onClick={() =>
                                navigate(`/products/${product.id}`)
                            }
                        >
                            <div className="recent-products__product-icon">
                                <Package
                                    size={17}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="recent-products__product-info">
                                <span className="recent-products__product-name">
                                    {product.name}
                                </span>

                                <span className="recent-products__product-category">
                                    {product.category_name ||
                                        "Uncategorized"}
                                </span>
                            </div>

                            <div className="recent-products__product-meta">
                                <span className="recent-products__price">
                                    ₹{Number(product.price || 0).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>

                                <span
                                    className={`recent-products__status recent-products__status--${String(
                                        product.status || "unknown"
                                    ).toLowerCase()}`}
                                >
                                    {product.status || "Unknown"}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RecentProducts;