const BASE_URL = `https://api.themoviedb.org/3/`;
const DEFAULT_LIMIT = 100;
const MOVIE_COLLECTION = 'movies';
// For the "now playing" list, we fetch multiple TMDB pages per UI "current page"
// so the frontend can page through larger chunks.
// TMDB returns 20 items per page, so 2 pages ~= 40 movies per hit.
const NOW_PLAYING_PAGES_PER_HIT = 2;
const SEARCH_MOVIE_SORT_ORDER = { "release_date": -1, "createdDate": -1 };
const SEARCH_MOVIE_PROJECTIONS = { "title": 1, "overview": 1, "poster_path": 1, "id": 1, "release_date": 1, "vote_average": 1, "overview": 1, "original_title": 1 };

module.exports = {
    BASE_URL,
    DEFAULT_LIMIT,
    MOVIE_COLLECTION,
    NOW_PLAYING_PAGES_PER_HIT,
    SEARCH_MOVIE_PROJECTIONS,
    SEARCH_MOVIE_SORT_ORDER,
}
