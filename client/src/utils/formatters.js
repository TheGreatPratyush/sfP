export const formatCurrency = (
    value,
    currency = "INR"
) => {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "₹0.00";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatNumber = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return new Intl.NumberFormat("en-IN").format(number);
};

export const formatDate = (
    value,
    options = {}
) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
    }).format(date);
};

export const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const formatPercentage = (
    value,
    decimals = 2
) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0%";
    }

    return `${number.toFixed(decimals)}%`;
};

export const truncateText = (
    text,
    maxLength = 80
) => {
    if (!text) {
        return "";
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
};