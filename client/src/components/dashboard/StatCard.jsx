import "./StatCard.css";

const StatCard = ({
    label,
    value,
    description,
    icon: Icon,
    trend,
    variant = "default",
}) => {
    return (
        <article className={`stat-card stat-card--${variant}`}>
            <div className="stat-card__top">
                <div className="stat-card__icon">
                    {Icon && (
                        <Icon
                            size={18}
                            strokeWidth={1.8}
                        />
                    )}
                </div>

                {trend && (
                    <span className="stat-card__trend">
                        {trend}
                    </span>
                )}
            </div>

            <div className="stat-card__content">
                <span className="stat-card__label">
                    {label}
                </span>

                <strong className="stat-card__value">
                    {value}
                </strong>

                {description && (
                    <span className="stat-card__description">
                        {description}
                    </span>
                )}
            </div>
        </article>
    );
};

export default StatCard;