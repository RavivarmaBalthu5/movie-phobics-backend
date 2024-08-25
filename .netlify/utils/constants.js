const TMDB_API_ID = 'tmdb_api_id';
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
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';
const TRACK_SEARCH_PROJECTION = {
    "name": 1,
    "uri": 1,
    'external_urls.spotify': 1,
    'album.name': 1,
    'album.images.url': 1, // Access the first image URL
    "preview_url": 1,
    'href': 1
};

module.exports = {
    BASE_URL,
    API_COLLECTION,
    TMDB_API_ID,
    DEFAULT_LIMIT,
    MOVIE_COLLECTION,
    TRAILERS_COLLECTION,
    ALL_MOVIES_SORT_ORDER,
    ALL_MOVIES_PROJECTIONS,
    SEARCH_MOVIE_PROJECTIONS,
    SEARCH_MOVIE_SORT_ORDER,
    TRAILERS_SORT_ORDER,
    TRAILERS_PROJECTIONS,
    SPOTIFY_TOKEN_URL,
    TRACKS_COLLECTION,
    SPOTIFY_SEARCH_URL,
    TRACK_SEARCH_PROJECTION
}
