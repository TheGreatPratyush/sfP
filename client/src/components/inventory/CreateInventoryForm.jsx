import { useEffect, useState } from "react";
import { PackagePlus } from "lucide-react";

import { getVariants } from "../../api/variants.api";

import "./CreateInventoryForm.css";

const CreateInventoryForm = ({
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [variants, setVariants] = useState([]);
    const [variantsLoading, setVariantsLoading] = useState(true);
    const [variantsError, setVariantsError] = useState(null);

    const [formData, setFormData] = useState({
        variantId: "",
        quantity: "",
        lowStockThreshold: 6,
    });

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                setVariantsLoading(true);
                setVariantsError(null);

                const response = await getVariants();

                setVariants(response.data || []);
            } catch (error) {
                console.error(
                    "Failed to load variants:",
                    error
                );

                setVariantsError(
                    error.message ||
                        "Unable to load product variants."
                );
            } finally {
                setVariantsLoading(false);
            }
        };

        fetchVariants();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.variantId) {
            return;
        }

        if (
            formData.quantity === "" ||
            Number(formData.quantity) < 0
        ) {
            return;
        }

        if (
            formData.lowStockThreshold === "" ||
            Number(formData.lowStockThreshold) < 0
        ) {
            return;
        }

        await onSubmit({
            variantId: Number(formData.variantId),
            quantity: Number(formData.quantity),
            lowStockThreshold: Number(
                formData.lowStockThreshold
            ),
        });
    };

    return (
        <form
            className="create-inventory-form"
            onSubmit={handleSubmit}
        >
            <div className="create-inventory-form__header">
                <div className="create-inventory-form__icon">
                    <PackagePlus
                        size={18}
                        strokeWidth={1.8}
                    />
                </div>

                <div>
                    <p className="create-inventory-form__eyebrow">
                        Stock Control
                    </p>

                    <h2 className="create-inventory-form__title">
                        Add Inventory
                    </h2>

                    <p className="create-inventory-form__description">
                        Add stock for an existing product
                        variant.
                    </p>
                </div>
            </div>

            <div className="create-inventory-form__fields">
                <div className="create-inventory-form__field">
                    <label htmlFor="variantId">
                        Product Variant
                    </label>

                    {variantsLoading ? (
                        <div className="create-inventory-form__loading">
                            Loading variants...
                        </div>
                    ) : variantsError ? (
                        <div className="create-inventory-form__error">
                            {variantsError}
                        </div>
                    ) : (
                        <select
                            id="variantId"
                            name="variantId"
                            value={formData.variantId}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        >
                            <option value="">
                                Select a variant
                            </option>

                            {variants.map((variant) => (
                                <option
                                    key={variant.id}
                                    value={variant.id}
                                >
                                    {variant.product_name ||
                                        "Unknown Product"}{" "}
                                    —{" "}
                                    {variant.size || "No size"}{" "}
                                    /{" "}
                                    {variant.color ||
                                        "No color"}{" "}
                                    —{" "}
                                    {variant.sku ||
                                        `Variant #${variant.id}`}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="create-inventory-form__row">
                    <div className="create-inventory-form__field">
                        <label htmlFor="quantity">
                            Quantity
                        </label>

                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="create-inventory-form__field">
                        <label htmlFor="lowStockThreshold">
                            Low Stock Threshold
                        </label>

                        <input
                            id="lowStockThreshold"
                            name="lowStockThreshold"
                            type="number"
                            min="0"
                            value={
                                formData.lowStockThreshold
                            }
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="create-inventory-form__actions">
                <button
                    type="button"
                    className="create-inventory-form__cancel"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="create-inventory-form__submit"
                    disabled={
                        loading ||
                        variantsLoading ||
                        !formData.variantId
                    }
                >
                    {loading
                        ? "Creating..."
                        : "Create Inventory"}
                </button>
            </div>
        </form>
    );
};

export default CreateInventoryForm;