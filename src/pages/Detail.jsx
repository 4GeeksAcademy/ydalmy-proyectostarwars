
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const Details = () => {
    const { category, id } = useParams();
    const [entity, setEntity] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntity = async () => {
            try {
                const response = await fetch(`https://www.swapi.tech/api/${category}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch entity details');
                const data = await response.json();
                setEntity(data.result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEntity();
    }, [category, id]);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    if (!entity) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning" role="alert">
                    Entity not found
                </div>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    const properties = entity.properties || {};

    const getFilteredProperties = () => {
        const excludeFields = {
            planets: ['created', 'edited', 'url'],
            vehicles: ['created', 'edited', 'films', 'url'],
            people: ['created', 'edited', 'homeworld', 'url']
        };

        const fieldsToExclude = excludeFields[category] || [];
        return Object.entries(properties).filter(([key]) =>
            key !== 'name' && !fieldsToExclude.includes(key)
        );
    };

    const getImageUrl = () => {
        const baseUrl = 'https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img';
        const categoryMap = {
            planets: 'planets',
            vehicles: 'vehicles',
            people: 'characters'
        };
        return `${baseUrl}/${categoryMap[category]}/${id}.jpg`;
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-10 mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title mb-0">{properties.name || 'Unknown'}</h1>
                            <small className="text-muted">{category.charAt(0).toUpperCase() + category.slice(1, -1)}</small>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <img
                                        src={getImageUrl()}
                                        alt={properties.name || 'Entity'}
                                        className="img-fluid rounded"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="row">
                                        {getFilteredProperties().map(([key, value]) => (
                                            <div key={key} className="col-md-6 mb-3">
                                                <strong className="text-capitalize">{key.replace(/_/g, ' ')}:</strong>
                                                <p className="mb-0">{Array.isArray(value) ? value.join(', ') : value || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/" className="btn btn-primary">
                                <i className="fas fa-arrow-left me-2"></i>Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};