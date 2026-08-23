import { useEffect, useState } from "react";
import { X } from "lucide-react";

import "./ProductForm.css";

const initialForm = {
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount_percentage: "",
    status: "active",
};

const ProductForm = ({
    initialData = null,
    categories = [],
    loading = false,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                description: initialData.description || "",
                category_id: initialData.category_id || "",
                price: initialData.price || "",
                discount_percentage:
                    initialData.discount_percentage || "",
                status: initialData.status || "active",
            });
        } else {
            setForm(initialForm);
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

        if (!form.name.trim()) {
            nextErrors.name = "Product name is required.";
        }

        if (!form.category_id) {
            nextErrors.category_id = "Select a category.";
        }

        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {
            nextErrors.price = "Enter a valid price.";
        }

        if (
            form.discount_percentage !== "" &&
            (Number(form.discount_percentage) < 0 ||
                Number(form.discount_percentage) > 100)
        ) {
            nextErrors.discount_percentage =
                "Discount must be between 0 and 100.";
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
            ...form,
            category_id: Number(form.category_id),
            price: Number(form.price),
            discount_percentage:
                form.discount_percentage === ""
                    ? 0
                    : Number(form.discount_percentage),
        });
    };

    return (
        <form
            className="product-form"
            onSubmit={handleSubmit}
        >
            <div className="product-form__header">
                <div>
                    <p className="product-form__eyebrow">
                        Product
                    </p>

                    <h2 className="product-form__title">
                        {initialData
                            ? "Edit Product"
                            : "Add Product"}
                    </h2>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        className="product-form__close"
                        onClick={onCancel}
                        aria-label="Close form"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                )}
            </div>

            <div className="product-form__body">
                <div className="product-form__field product-form__field--full">
                    <label htmlFor="product-name">
                        Product Name
                    </label>

                    <input
                        id="product-name"
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Enter product name"
                    />

                    {errors.name && (
                        <span className="product-form__error">
                            {errors.name}
                        </span>
                    )}
                </div>

                <div className="product-form__field product-form__field--full">
                    <label htmlFor="product-description">
                        Description
                    </label>

                    <textarea
                        id="product-description"
                        value={form.description}
                        onChange={(event) =>
                            updateField(
                                "description",
                                event.target.value
                            )
                        }
                        placeholder="Describe the product"
                        rows={4}
                    />
                </div>

                <div className="product-form__field">
                    <label htmlFor="product-category">
                        Category
                    </label>

                    <select
                        id="product-category"
                        value={form.category_id}
                        onChange={(event) =>
                            updateField(
                                "category_id",
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Select category
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {errors.category_id && (
                        <span className="product-form__error">
                            {errors.category_id}
                        </span>
                    )}
                </div>

                <div className="product-form__field">
                    <label htmlFor="product-status">
                        Status
                    </label>

                    <select
                        id="product-status"
                        value={form.status}
                        onChange={(event) =>
                            updateField(
                                "status",
                                event.target.value
                            )
                        }
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="draft">
                            Draft
                        </option>
                    </select>
                </div>

                <div className="product-form__field">
                    <label htmlFor="product-price">
                        Price
                    </label>

                    <div className="product-form__input-prefix">
                        <span>₹</span>

                        <input
                            id="product-price"
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
                        <span className="product-form__error">
                            {errors.price}
                        </span>
                    )}
                </div>

                <div className="product-form__field">
                    <label htmlFor="product-discount">
                        Discount
                    </label>

                    <div className="product-form__input-suffix">
                        <input
                            id="product-discount"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={
                                form.discount_percentage
                            }
                            onChange={(event) =>
                                updateField(
                                    "discount_percentage",
                                    event.target.value
                                )
                            }
                            placeholder="0"
                        />

                        <span>%</span>
                    </div>

                    {errors.discount_percentage && (
                        <span className="product-form__error">
                            {errors.discount_percentage}
                        </span>
                    )}
                </div>
            </div>

            <div className="product-form__footer">
                {onCancel && (
                    <button
                        type="button"
                        className="product-form__cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    className="product-form__submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : initialData
                          ? "Save Changes"
                          : "Create Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;