
export const initialStore = () => {
    return {
        favorites: []
    }
}

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'add_favorite':
            const newFavorite = action.payload;
            if (store.favorites.find(fav => fav.uid === newFavorite.uid && fav.category === newFavorite.category)) {
                return store;
            }
            return {
                ...store,
                favorites: [...store.favorites, newFavorite]
            };

        case 'remove_favorite':
            const { uid, category } = action.payload;
            return {
                ...store,
                favorites: store.favorites.filter(fav => !(fav.uid === uid && fav.category === category))
            };

        default:
            return store;
    }
}