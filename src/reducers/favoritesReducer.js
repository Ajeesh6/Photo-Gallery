function favoritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const photoId = action.payload;

      if (state.includes(photoId)) {
        return state.filter((id) => id !== photoId);
      }

      return [...state, photoId];
    }

    default:
      return state;
  }
}

export default favoritesReducer;
