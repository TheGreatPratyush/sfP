import { useEffect, useState } from "react";
import { X } from "lucide-react";

import "./VariantForm.css";

const emptyForm = {
    productId: "",
    size: "",
    color: "",
    sku: "",
    price: "",
};

const VariantForm = ({
    products = [],
    initialData = null,
    loading = false,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                productId: initialData.product_id ?? "",
                size: initialData.size ?? "",
                color: initialData.color ?? "",
                sku: initialData.sku ?? "",
                price: initialData.price ?? "",
            });
        } else {
            setForm(emptyForm);
        }

        setErrors({});
    }, [initialData]);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.productId) {
            nextErrors.productId = "Select a product.";
        }

        if (!form.size.trim()) {
            nextErrors.size = "Size is required.";
        }

        if (!form.color.trim()) {
            nextErrors.color = "Color is required.";
        }

        if (!form.sku.trim()) {
            nextErrors.sku = "SKU is required.";
        }

        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {
            nextErrors.price = "Enter a valid price.";
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
            productId: Number(form.productId),
            size: form.size.trim(),
            color: form.color.trim(),
            sku: form.sku.trim(),
            price: Number(form.price),
        });
    };

    return (
        <form
            className="variant-form"
            onSubmit={handleSubmit}
        >
            <div className="variant-form__header">
                <div>
                    <p className="variant-form__eyebrow">
                        Product Options
                    </p>

                    <h2 className="variant-form__title">
                        {initialData
                            ? "Edit Variant"
                            : "Add Variant"}
                    </h2>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        className="variant-form__close"
                        onClick={onCancel}
                        aria-label="Close form"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                )}
            </div>

            <div className="variant-form__body">
                <div className="variant-form__field variant-form__field--full">
                    <label htmlFor="variant-product">
                        Product
                    </label>

                    <select
                        id="variant-product"
                        value={form.productId}
                        onChange={(event) =>
                            updateField(
                                "productId",
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Select product
                        </option>

                        {products.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.name}
                            </option>
                        ))}
                    </select>

                    {errors.productId && (
                        <span className="variant-form__error">
                            {errors.productId}
                        </span>
                    )}
                </div>

                <div className="variant-form__field">
                    <label htmlFor="variant-size">
                        Size
                    </label>

                    <input
                        id="variant-size"
                        type="text"
                        value={form.size}
                        onChange={(event) =>
                            updateField(
                                "size",
                                event.target.value
                            )
                        }
                        placeholder="e.g. M"
                    />

                    {errors.size && (
                        <span className="variant-form__error">
                            {errors.size}
                        </span>
                    )}
                </div>

                <div className="variant-form__field">
                    <label htmlFor="variant-color">
                        Color
                    </label>

                    <input
                        id="variant-color"
                        type="text"
                        value={form.color}
                        onChange={(event) =>
                            updateField(
                                "color",
                                event.target.value
                            )
                        }
                        placeholder="e.g. Black"
                    />

                    {errors.color && (
                        <span className="variant-form__error">
                            {errors.color}
                        </span>
                    )}
                </div>

                <div className="variant-form__field">
                    <label htmlFor="variant-sku">
                        SKU
                    </label>

                    <input
                        id="variant-sku"
                        type="text"
                        value={form.sku}
                        onChange={(event) =>
                            updateField(
                                "sku",
                                event.target.value
                            )
                        }
                        placeholder="e.g. TS-BLK-M-001"
                    />

                    {errors.sku && (
                        <span className="variant-form__error">
                            {errors.sku}
                        </span>
                    )}
                </div>

                <div className="variant-form__field">
                    <label htmlFor="variant-price">
                        Price
                    </label>

                    <div className="variant-form__price">
                        <span>₹</span>

                        <input
                            id="variant-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={(event) =>
                                updateField(
                                    "price",
                                    event.target.value
                                )
                            }
                            placeholder="0.00"
                        />
                    </div>

                    {errors.price && (
                        <span className="variant-form__error">
                            {errors.price}
                        </span>
                    )}
                </div>
            </div>

            <div className="variant-form__footer">
                {onCancel && (
                    <button
                        type="button"
                        className="variant-form__cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    className="variant-form__submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : initialData
                          ? "Save Changes"
                          : "Create Variant"}
                </button>
            </div>
        </form>
    );
};

export default VariantForm;