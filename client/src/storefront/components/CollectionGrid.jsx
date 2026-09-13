import React from 'react';
import { Link } from 'react-router-dom';

const CollectionGrid = ({ title, collections }) => {
    return (
        <section className="product-section">
            <h2 className="product-section__heading">{title}</h2>
            <div className="collection-grid">
                {collections.map(collection => (
                    <Link to={`/collections/${collection.id}`} key={collection.id} className="collection-card">
                        <div className="collection-card__image-wrapper">
                            <img 
                                src={collection.image} 
                                alt={collection.title} 
                                className="collection-card__image"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="collection-card__title">{collection.title}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CollectionGrid;
