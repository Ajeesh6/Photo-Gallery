import { useState, useCallback, useMemo, useReducer, useEffect } from "react";
import useFetchPhotos from "./hooks/useFetchPhotos";
import favoritesReducer from "./reducers/favoritesReducer";

function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState("");

  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    undefined,
    () => {
      try {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
      } catch {
        return [];
      }
    }
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);

  const toggleFavorite = (photoId) => {
    dispatch({
      type: "TOGGLE_FAVORITE",
      payload: photoId,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Celebrare Photo Gallery
      </h1>

      <div className="mx-auto mb-8 max-w-xl">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search photos by author..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {filteredPhotos.length === 0 ? (
        <p className="text-center text-gray-600">No photos found.</p>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => {
            const isFavorite = favorites.includes(photo.id);

            return (
              <div
                key={photo.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <img
                  src={photo.download_url}
                  alt={`Photo by ${photo.author}`}
                  className="h-56 w-full object-cover"
                />

                <div className="flex items-center justify-between p-4">
                  <p className="font-medium">{photo.author}</p>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(photo.id)}
                    aria-label={
                      isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    aria-pressed={isFavorite}
                    className={`text-2xl ${
                      isFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {isFavorite ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Gallery;
