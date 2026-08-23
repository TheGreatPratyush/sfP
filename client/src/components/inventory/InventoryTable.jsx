import {
    AlertCircle,
    Package,
    Pencil,
    Trash2,
} from "lucide-react";

import "./InventoryTable.css";

const InventoryTable = ({
    inventory = [],
    onUpdateStock,
    onDelete,
}) => {
    if (inventory.length === 0) {
        return (
            <div className="inventory-table__empty">
                <div className="inventory-table__empty-icon">
                    <Package size={20} strokeWidth={1.8} />
                </div>

                <h3 className="inventory-table__empty-title">
                    No inventory records
                </h3>

                <p className="inventory-table__empty-text">
                    Inventory records will appear here once stock
                    is added.
                </p>
            </div>
        );
    }

    return (
        <section className="inventory-table">
            <div className="inventory-table__header">
                <div>
                    <p className="inventory-table__eyebrow">
                        Stock Control
                    </p>

                    <h2 className="inventory-table__title">
                        Inventory Records
                    </h2>
                </div>

                <span className="inventory-table__count">
                    {inventory.length}{" "}
                    {inventory.length === 1
                        ? "record"
                        : "records"}
                </span>
            </div>

            <div className="inventory-table__wrapper">
                <table className="inventory-table__table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Variant</th>
                            <th>SKU</th>
                            <th>Stock</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {inventory.map((item) => {
                            const quantity = Number(
                                item.quantity ?? 0
                            );

                            const threshold = Number(
                                item.low_stock_threshold ?? 0
                            );

                            const status =
                                quantity === 0
                                    ? "out-of-stock"
                                    : quantity <= threshold
                                      ? "low-stock"
                                      : "in-stock";

                            return (
                                <tr key={item.id}>
                                    <td>
                                        <div className="inventory-table__product">
                                            <div className="inventory-table__product-icon">
                                                <Package
                                                    size={16}
                                                    strokeWidth={1.8}
                                                />
                                            </div>

                                            <div className="inventory-table__product-info">
                                                <span className="inventory-table__product-name">
                                                    {item.product_name ||
                                                        "Unknown Product"}
                                                </span>

                                                <span className="inventory-table__product-id">
                                                    Product #
                                                    {item.product_id ??
                                                        "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="inventory-table__variant">
                                            <span>
                                                {item.size || "—"}
                                            </span>

                                            {item.color && (
                                                <span>
                                                    {item.color}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <span className="inventory-table__sku">
                                            {item.sku || "—"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`inventory-table__quantity inventory-table__quantity--${status}`}
                                        >
                                            {quantity}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="inventory-table__threshold">
                                            {threshold}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`inventory-table__status inventory-table__status--${status}`}
                                        >
                                            <span className="inventory-table__status-dot" />

                                            {status ===
                                            "out-of-stock"
                                                ? "Out of stock"
                                                : status ===
                                                    "low-stock"
                                                  ? "Low stock"
                                                  : "In stock"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="inventory-table__actions">
                                            <button
                                                type="button"
                                                className="inventory-table__action"
                                                aria-label={`Update stock for ${
                                                    item.product_name ||
                                                    "product"
                                                }`}
                                                title="Update stock"
                                                onClick={() =>
                                                    onUpdateStock?.(
                                                        item
                                                    )
                                                }
                                            >
                                                <Pencil
                                                    size={14}
                                                    strokeWidth={1.8}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="inventory-table__action inventory-table__action--danger"
                                                aria-label={`Delete inventory for ${
                                                    item.product_name ||
                                                    "product"
                                                }`}
                                                title="Delete inventory"
                                                onClick={() =>
                                                    onDelete?.(
                                                        item.variant_id
                                                    )
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
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="inventory-table__notice">
                <AlertCircle
                    size={14}
                    strokeWidth={1.8}
                />

                <span>
                    Stock status is calculated using each variant's
                    configured low-stock threshold.
                </span>
            </div>
        </section>
    );
};

export default InventoryTable;