import { Edit3, FolderTree, Trash2 } from "lucide-react";

import "./CategoryTable.css";

const CategoryTable = ({
    categories = [],
    onEdit,
    onDelete,
}) => {
    if (categories.length === 0) {
        return (
            <div className="category-table__empty">
                <div className="category-table__empty-icon">
                    <FolderTree size={20} strokeWidth={1.8} />
                </div>

                <h3 className="category-table__empty-title">
                    No categories found
                </h3>

                <p className="category-table__empty-text">
                    Categories you add to your store will appear here.
                </p>
            </div>
        );
    }

    return (
        <section className="category-table">
            <div className="category-table__header">
                <div>
                    <p className="category-table__eyebrow">
                        Catalog Structure
                    </p>

                    <h2 className="category-table__title">
                        All Categories
                    </h2>
                </div>

                <span className="category-table__count">
                    {categories.length}{" "}
                    {categories.length === 1
                        ? "category"
                        : "categories"}
                </span>
            </div>

            <div className="category-table__wrapper">
                <table className="category-table__table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Created</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>
                                    <div className="category-table__category">
                                        <div className="category-table__icon">
                                            <FolderTree
                                                size={16}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="category-table__category-info">
                                            <span className="category-table__name">
                                                {category.name ||
                                                    "Unnamed Category"}
                                            </span>

                                            <span className="category-table__id">
                                                Category #{category.id}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="category-table__description">
                                        {category.description || "—"}
                                    </span>
                                </td>

                                <td>
                                    <span className="category-table__date">
                                        {category.created_at
                                            ? new Date(
                                                  category.created_at
                                              ).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                  }
                                              )
                                            : "—"}
                                    </span>
                                </td>

                                <td>
                                    <div className="category-table__actions">
                                        <button
                                            type="button"
                                            className="category-table__action"
                                            aria-label={`Edit ${category.name}`}
                                            title="Edit category"
                                            onClick={() =>
                                                onEdit?.(category)
                                            }
                                        >
                                            <Edit3
                                                size={14}
                                                strokeWidth={1.8}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            className="category-table__action category-table__action--danger"
                                            aria-label={`Delete ${category.name}`}
                                            title="Delete category"
                                            onClick={() =>
                                                onDelete?.(category)
                                            }
                                        >
                                            <Trash2
                                                size={14}
                                                strokeWidth={1.8}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default CategoryTable;