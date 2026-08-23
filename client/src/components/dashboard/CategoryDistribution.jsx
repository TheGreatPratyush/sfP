import "./CategoryDistribution.css";

const CategoryDistribution = ({ categories = [] }) => {
    const totalProducts = categories.reduce(
        (total, category) => total + Number(category.product_count || 0),
        0
    );

    return (
        <section className="category-distribution">
            <div className="category-distribution__header">
                <div>
                    <p className="category-distribution__eyebrow">
                        Catalog
                    </p>

                    <h2 className="category-distribution__title">
                        Category Distribution
                    </h2>
                </div>

                <span className="category-distribution__total">
                    {totalProducts} products
                </span>
            </div>

            {categories.length === 0 ? (
                <div className="category-distribution__empty">
                    <span className="category-distribution__empty-title">
                        No category data
                    </span>

                    <span className="category-distribution__empty-text">
                        Products will appear here once categories have
                        been added.
                    </span>
                </div>
            ) : (
                <div className="category-distribution__list">
                    {categories.map((category) => {
                        const productCount = Number(
                            category.product_count || 0
                        );

                        const percentage =
                            totalProducts > 0
                                ? (productCount / totalProducts) * 100
                                : 0;

                        return (
                            <div
                                className="category-distribution__item"
                                key={category.id}
                            >
                                <div className="category-distribution__item-header">
                                    <div className="category-distribution__name-wrapper">
                                        <span className="category-distribution__indicator" />

                                        <span className="category-distribution__name">
                                            {category.name}
                                        </span>
                                    </div>

                                    <span className="category-distribution__count">
                                        {productCount}
                                    </span>
                                </div>

                                <div className="category-distribution__bar">
                                    <span
                                        className="category-distribution__bar-fill"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default CategoryDistribution;