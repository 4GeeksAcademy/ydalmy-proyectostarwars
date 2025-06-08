
import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const [data, setData] = useState({ people: [], planets: [], vehicles: [] });
    const [errors, setErrors] = useState({ people: null, planets: null, vehicles: null });

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = {
                people: 'https://www.swapi.tech/api/people/',
                planets: 'https://www.swapi.tech/api/planets/',
                vehicles: 'https://www.swapi.tech/api/vehicles/'
            };

            for (const [category, url] of Object.entries(endpoints)) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to fetch ${category}`);
                    const result = await response.json();
                    setData(prev => ({ ...prev, [category]: result.results || [] }));
                } catch (error) {
                    setErrors(prev => ({ ...prev, [category]: error.message }));
                }
            }
        };

        fetchData();
    }, []);

    const toggleFavorite = (item, category) => {
        const favorite = {
            uid: item.uid,
            name: item.name,
            category: category
        };

        const isAlreadyFavorite = store.favorites.find(
            fav => fav.uid === item.uid && fav.category === category
        );

        if (isAlreadyFavorite) {
            dispatch({
                type: 'remove_favorite',
                payload: { uid: item.uid, category }
            });
        } else {
            dispatch({
                type: 'add_favorite',
                payload: favorite
            });
        }
    };

    const isFavorite = (uid, category) => {
        return store.favorites.some(fav => fav.uid === uid && fav.category === category);
    };

    const renderScrollableSection = (items, category, title) => {
        if (errors[category]) {
            return (
                <div className="alert alert-danger" role="alert">
                    Error loading {title}: {errors[category]}
                </div>
            );
        }

        return (
            <div
                className="d-flex overflow-auto pb-3"
                style={{
                    gap: '1rem',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#6c757d #e9ecef'
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.uid}
                        className="card flex-shrink-0"
                        style={{ minWidth: '280px', width: '280px' }}
                    >
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{item.name}</h5>
                            <div className="mt-auto">
                                <div className="d-flex justify-content-between">
                                    <a
                                        href={`/details/${category}/${item.uid}`}
                                        className="btn btn-primary"
                                    >
                                        Learn more
                                    </a>
                                    <button
                                        className={`btn ${isFavorite(item.uid, category) ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => toggleFavorite(item, category)}
                                    >
                                        <i className={`fas fa-heart ${isFavorite(item.uid, category) ? '' : 'far'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container my-5">

            <section className="mb-5">
                <h2 className="mb-4">Characters</h2>
                {renderScrollableSection(data.people, 'people', 'Characters')}
            </section>

            <section className="mb-5">
                <h2 className="mb-4">Planets</h2>
                {renderScrollableSection(data.planets, 'planets', 'Planets')}
            </section>

            <section className="mb-5">
                <h2 className="mb-4">Vehicles</h2>
                {renderScrollableSection(data.vehicles, 'vehicles', 'Vehicles')}
            </section>
        </div>
    );
};