const BASE_URL = `https://api.themoviedb.org/3/`;
const DEFAULT_LIMIT = 100;
const MOVIE_COLLECTION = 'movies';
const SEARCH_MOVIE_SORT_ORDER = { "release_date": -1, "createdDate": -1 };
const SEARCH_MOVIE_PROJECTIONS = { "title": 1, "overview": 1, "poster_path": 1, "id": 1, "release_date": 1, "vote_average": 1, "overview": 1, "original_title": 1 };

module.exports = {
    BASE_URL,
    DEFAULT_LIMIT,
    MOVIE_COLLECTION,
    SEARCH_MOVIE_PROJECTIONS,
    SEARCH_MOVIE_SORT_ORDER,
}
