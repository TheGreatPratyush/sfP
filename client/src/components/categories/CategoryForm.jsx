import { useEffect, useState } from "react";
import { X } from "lucide-react";

import "./CategoryForm.css";

const emptyForm = {
    name: "",
    description: "",
};

const CategoryForm = ({
    initialData = null,
    loading = false,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");

    useEffect(() => {
        setForm({
            name: initialData?.name || "",
            description: initialData?.description || "",
        });
        setError("");
    }, [initialData]);

    const handleChange = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (field === "name") {
            setError("");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = form.name.trim();

        if (!name) {
            setError("Category name is required.");
            return;
        }

        onSubmit?.({
            name,
            description: form.description.trim(),
        });
    };

    return (
        <form
            className="category-form"
            onSubmit={handleSubmit}
        >
            <div className="category-form__header">
                <div>
                    <p className="category-form__eyebrow">
                        Catalog
                    </p>

                    <h2 className="category-form__title">
                        {initialData
                            ? "Edit Category"
                            : "Add Category"}
                    </h2>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        className="category-form__close"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Close form"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                )}
            </div>

            <div className="category-form__body">
                <div className="category-form__field">
                    <label htmlFor="category-name">
                        Category Name
                    </label>

                    <input
                        id="category-name"
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                            handleChange(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="e.g. Men's Clothing"
                        disabled={loading}
                        autoFocus
                    />

                    {error && (
                        <span className="category-form__error">
                            {error}
                        </span>
                    )}
                </div>

                <div className="category-form__field">
                    <label htmlFor="category-description">
                        Description
                    </label>

                    <textarea
                        id="category-description"
                        value={form.description}
                        onChange={(event) =>
                            handleChange(
                                "description",
                                event.target.value
                            )
                        }
                        placeholder="Briefly describe this category"
                        rows={4}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="category-form__footer">
                {onCancel && (
                    <button
                        type="button"
                        className="category-form__cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    className="category-form__submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : initialData
                          ? "Save Changes"
                          : "Create Category"}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;