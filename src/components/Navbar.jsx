
import React from 'react';
import { Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();

    const removeFavorite = (uid, category) => {
        dispatch({
            type: 'remove_favorite',
            payload: { uid, category }
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand mx-auto" to="/">
                    <h3 className="mb-0">Star Wars</h3>
                </Link>

                <div className="dropdown">
                    <button
                        className="btn btn-outline-light dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Favorites ({store.favorites.length})
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {store.favorites.length === 0 ? (
                            <li><span className="dropdown-item-text">No favorites yet</span></li>
                        ) : (
                            store.favorites.map((favorite) => (
                                <li key={`${favorite.category}-${favorite.uid}`} className="d-flex align-items-center px-3 py-2">
                                    <Link
                                        to={`/details/${favorite.category}/${favorite.uid}`}
                                        className="text-decoration-none flex-grow-1"
                                    >
                                        {favorite.name}
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-outline-danger ms-2"
                                        onClick={() => removeFavorite(favorite.uid, favorite.category)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};