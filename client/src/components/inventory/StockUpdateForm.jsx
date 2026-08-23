import { useEffect, useState } from "react";
import { Package, X } from "lucide-react";

import "./StockUpdateForm.css";

const StockUpdateForm = ({
    inventoryItem = null,
    loading = false,
    onSubmit,
    onCancel,
}) => {
    const [quantity, setQuantity] = useState("");
    const [threshold, setThreshold] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (inventoryItem) {
            setQuantity(inventoryItem.quantity ?? "");
            setThreshold(
                inventoryItem.low_stock_threshold ?? ""
            );
        } else {
            setQuantity("");
            setThreshold("");
        }

        setErrors({});
    }, [inventoryItem]);

    if (!inventoryItem) {
        return null;
    }

    const validate = () => {
        const nextErrors = {};

        if (
            quantity === "" ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            nextErrors.quantity =
                "Quantity must be a non-negative integer.";
        }

        if (
            threshold === "" ||
            !Number.isInteger(Number(threshold)) ||
            Number(threshold) < 0
        ) {
            nextErrors.threshold =
                "Threshold must be a non-negative integer.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit?.({
            id: inventoryItem.id,
            variantId: inventoryItem.variant_id,
            quantity: Number(quantity),
            lowStockThreshold: Number(threshold),
        });
    };

    return (
        <form
            className="stock-update-form"
            onSubmit={handleSubmit}
        >
            <div className="stock-update-form__header">
                <div>
                    <p className="stock-update-form__eyebrow">
                        Inventory
                    </p>

                    <h2 className="stock-update-form__title">
                        Update Stock
                    </h2>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        className="stock-update-form__close"
                        onClick={onCancel}
                        aria-label="Close form"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                )}
            </div>

            <div className="stock-update-form__product">
                <div className="stock-update-form__product-icon">
                    <Package size={17} strokeWidth={1.8} />
                </div>

                <div>
                    <span className="stock-update-form__product-name">
                        {inventoryItem.product_name ||
                            "Unknown Product"}
                    </span>

                    <span className="stock-update-form__product-meta">
                        {inventoryItem.size || "—"}
                        {" · "}
                        {inventoryItem.color || "—"}
                        {" · "}
                        {inventoryItem.sku || "—"}
                    </span>
                </div>
            </div>

            <div className="stock-update-form__body">
                <div className="stock-update-form__field">
                    <label htmlFor="stock-quantity">
                        Quantity
                    </label>

                    <input
                        id="stock-quantity"
                        type="number"
                        min="0"
                        step="1"
                        value={quantity}
                        onChange={(event) => {
                            setQuantity(event.target.value);
                            setErrors((current) => ({
                                ...current,
                                quantity: "",
                            }));
                        }}
                    />

                    {errors.quantity && (
                        <span className="stock-update-form__error">
                            {errors.quantity}
                        </span>
                    )}
                </div>

                <div className="stock-update-form__field">
                    <label htmlFor="stock-threshold">
                        Low Stock Threshold
                    </label>

                    <input
                        id="stock-threshold"
                        type="number"
                        min="0"
                        step="1"
                        value={threshold}
                        onChange={(event) => {
                            setThreshold(event.target.value);
                            setErrors((current) => ({
                                ...current,
                                threshold: "",
                            }));
                        }}
                    />

                    {errors.threshold && (
                        <span className="stock-update-form__error">
                            {errors.threshold}
                        </span>
                    )}
                </div>
            </div>

            <div className="stock-update-form__footer">
                {onCancel && (
                    <button
                        type="button"
                        className="stock-update-form__cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    className="stock-update-form__submit"
                    disabled={loading}
                >
                    {loading
                        ? "Updating..."
                        : "Update Stock"}
                </button>
            </div>
        </form>
    );
};

export default StockUpdateForm;