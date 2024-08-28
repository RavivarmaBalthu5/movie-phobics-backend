const API_COLLECTION = 'api_keys'
const BASE_URL = `https://api.themoviedb.org/3/`;
const DEFAULT_LIMIT = 100;
const MOVIE_COLLECTION = 'movies';
const TRAILERS_COLLECTION = 'trailers';
const TRACKS_COLLECTION = 'tracks';
const ALL_MOVIES_SORT_ORDER = { "release_date": -1, "createdDate": -1 };
const ALL_MOVIES_PROJECTIONS = { "title": 1, "overview": 1, "poster_path": 1, "id": 1, "release_date": 1, "vote_average": 1, "overview": 1, "original_title": 1 };
const SEARCH_MOVIE_SORT_ORDER = { "release_date": -1, "createdDate": -1 };
const SEARCH_MOVIE_PROJECTIONS = { "title": 1, "overview": 1, "poster_path": 1, "id": 1, "release_date": 1, "vote_average": 1, "overview": 1, "original_title": 1 };
const TRAILERS_SORT_ORDER = {};
const TRAILERS_PROJECTIONS = { "results.key": 1, "results.type": 1 };
const TRACK_SEARCH_PROJECTION = {
};

module.exports = {
    BASE_URL,
    API_COLLECTION,
    DEFAULT_LIMIT,
    MOVIE_COLLECTION,
    TRAILERS_COLLECTION,
    ALL_MOVIES_SORT_ORDER,
    ALL_MOVIES_PROJECTIONS,
    SEARCH_MOVIE_PROJECTIONS,
    SEARCH_MOVIE_SORT_ORDER,
    TRAILERS_SORT_ORDER,
    TRAILERS_PROJECTIONS,
    TRACKS_COLLECTION,
    TRACK_SEARCH_PROJECTION
}
