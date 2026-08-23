import "./StatusBadge.css";

const StatusBadge = ({ status = "unknown" }) => {
    const normalizedStatus = String(status)
        .toLowerCase()
        .replace(/\s+/g, "-");

    const labels = {
        active: "Active",
        inactive: "Inactive",
        draft: "Draft",
        "in-stock": "In Stock",
        "low-stock": "Low Stock",
        "out-of-stock": "Out of Stock",
        pending: "Pending",
        unknown: "Unknown",
    };

    const label =
        labels[normalizedStatus] ||
        String(status).replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );

    return (
        <span
            className={`owner-status-badge owner-status-badge--${normalizedStatus}`}
        >
            <span className="owner-status-badge__dot" />
            {label}
        </span>
    );
};

export default StatusBadge;