export const addToFavorites = (episodeData) => {
    const favorites = JSON.parse(localStorage.getItem('podcastFavorites') || '[]');
    
    // Check if already in favorites
    const existingIndex = favorites.findIndex(fav => 
        fav.episodeId === episodeData.episodeId && 
        fav.podcastId === episodeData.podcastId
    );
    
    if (existingIndex === -1) {
        const newFavorite = {
            ...episodeData,
            dateAdded: new Date().toISOString()
        };
        favorites.push(newFavorite);
        localStorage.setItem('podcastFavorites', JSON.stringify(favorites));
        return true;
    }
    return false;
};

export const removeFromFavorites = (episodeId, podcastId) => {
    const favorites = JSON.parse(localStorage.getItem('podcastFavorites') || '[]');
    const updatedFavorites = favorites.filter(fav => 
        !(fav.episodeId === episodeId && fav.podcastId === podcastId)
    );
    localStorage.setItem('podcastFavorites', JSON.stringify(updatedFavorites));
    return updatedFavorites;
};

export const getFavorites = () => {
    return JSON.parse(localStorage.getItem('podcastFavorites') || '[]');
};

export const isEpisodeFavorited = (episodeId, podcastId) => {
    const favorites = getFavorites();
    return favorites.some(fav => 
        fav.episodeId === episodeId && fav.podcastId === podcastId
    );
};