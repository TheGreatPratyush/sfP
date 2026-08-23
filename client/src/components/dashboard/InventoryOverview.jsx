import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import "./InventoryOverview.css";

const InventoryOverview = ({
    lowStock = 0,
    outOfStock = 0,
}) => {
    const totalIssues = lowStock + outOfStock;

    return (
        <section className="inventory-overview">
            <div className="inventory-overview__header">
                <div>
                    <p className="inventory-overview__eyebrow">
                        Inventory
                    </p>

                    <h2 className="inventory-overview__title">
                        Inventory Health
                    </h2>
                </div>

                <span
                    className={`inventory-overview__status ${
                        totalIssues === 0
                            ? "inventory-overview__status--healthy"
                            : "inventory-overview__status--warning"
                    }`}
                >
                    {totalIssues === 0 ? "Healthy" : "Needs attention"}
                </span>
            </div>

            <div className="inventory-overview__summary">
                <div className="inventory-overview__summary-icon">
                    {totalIssues === 0 ? (
                        <CheckCircle2 size={22} strokeWidth={1.8} />
                    ) : (
                        <AlertTriangle size={22} strokeWidth={1.8} />
                    )}
                </div>

                <div className="inventory-overview__summary-content">
                    <strong className="inventory-overview__summary-value">
                        {totalIssues}
                    </strong>

                    <span className="inventory-overview__summary-label">
                        inventory issues requiring attention
                    </span>
                </div>
            </div>

            <div className="inventory-overview__items">
                <div className="inventory-overview__item">
                    <div className="inventory-overview__item-left">
                        <span className="inventory-overview__item-icon inventory-overview__item-icon--warning">
                            <AlertTriangle
                                size={15}
                                strokeWidth={1.8}
                            />
                        </span>

                        <span className="inventory-overview__item-label">
                            Low Stock
                        </span>
                    </div>

                    <strong className="inventory-overview__item-value">
                        {lowStock}
                    </strong>
                </div>

                <div className="inventory-overview__item">
                    <div className="inventory-overview__item-left">
                        <span className="inventory-overview__item-icon inventory-overview__item-icon--danger">
                            <XCircle
                                size={15}
                                strokeWidth={1.8}
                            />
                        </span>

                        <span className="inventory-overview__item-label">
                            Out of Stock
                        </span>
                    </div>

                    <strong className="inventory-overview__item-value">
                        {outOfStock}
                    </strong>
                </div>
            </div>
        </section>
    );
};

export default InventoryOverview;