import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./LowStockTable.css";

const LowStockTable = ({ products = [] }) => {
    const navigate = useNavigate();

    return (
        <section className="low-stock-table">
            <div className="low-stock-table__header">
                <div>
                    <p className="low-stock-table__eyebrow">
                        Inventory
                    </p>

                    <h2 className="low-stock-table__title">
                        Low Stock Products
                    </h2>
                </div>

                <button
                    type="button"
                    className="low-stock-table__view-all"
                    onClick={() => navigate("/inventory")}
                >
                    View inventory
                    <ArrowRight size={14} strokeWidth={1.8} />
                </button>
            </div>

            {products.length === 0 ? (
                <div className="low-stock-table__empty">
                    <div className="low-stock-table__empty-icon">
                        <AlertTriangle
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <h3 className="low-stock-table__empty-title">
                            Inventory looks healthy
                        </h3>

                        <p className="low-stock-table__empty-text">
                            There are currently no low-stock products
                            requiring attention.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="low-stock-table__table-wrapper">
                    <table className="low-stock-table__table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Stock</th>
                                <th>Threshold</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="low-stock-table__product">
                                            <span className="low-stock-table__product-indicator" />

                                            <span className="low-stock-table__product-name">
                                                {product.product_name ||
                                                    product.name ||
                                                    "Unknown Product"}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="low-stock-table__sku">
                                            {product.sku || "—"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="low-stock-table__stock">
                                            {product.quantity ?? 0}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="low-stock-table__threshold">
                                            {product.low_stock_threshold ?? 0}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default LowStockTable;