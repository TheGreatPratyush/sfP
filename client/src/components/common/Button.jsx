import "./Button.css";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    onClick,
    icon: Icon,
    className = "",
}) => {
    const classes = [
        "owner-button",
        `owner-button--${variant}`,
        `owner-button--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading ? (
                <span className="owner-button__loader" />
            ) : (
                Icon && (
                    <Icon
                        className="owner-button__icon"
                        size={15}
                        strokeWidth={1.8}
                    />
                )
            )}

            <span className="owner-button__label">
                {loading ? "Please wait..." : children}
            </span>
        </button>
    );
};

export default Button;