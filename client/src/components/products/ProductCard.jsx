import { Eye, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    if (!product) {
        return null;
    }

    const price = Number(product.price || 0);

    return (
        <article className="product-card">
            <div className="product-card__image">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name || "Product"}
                    />
                ) : (
                    <Package
                        size={28}
                        strokeWidth={1.5}
                    />
                )}

                <span
                    className={`product-card__status product-card__status--${
                        product.status || "unknown"
                    }`}
                >
                    {product.status || "Unknown"}
                </span>
            </div>

            <div className="product-card__content">
                <span className="product-card__category">
                    {product.category_name ||
                        "Uncategorized"}
                </span>

                <h3 className="product-card__name">
                    {product.name || "Unnamed Product"}
                </h3>

                <p className="product-card__description">
                    {product.description ||
                        "No description available."}
                </p>

                <div className="product-card__footer">
                    <span className="product-card__price">
                        ₹
                        {price.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>

                    <button
                        type="button"
                        className="product-card__view"
                        onClick={() =>
                            navigate(
                                `/products/${product.id}`
                            )
                        }
                    >
                        <Eye
                            size={14}
                            strokeWidth={1.8}
                        />

                        View
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;