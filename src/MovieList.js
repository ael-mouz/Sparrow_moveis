
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [options, setOptions] = useState({
    limit: 50,
    page: 1,
    quality: "All",
    minimum_rating: 0,
    query_term: "",
    genre: "",
    sort_by: "like_count",
    order_by: "desc",
    with_rt_ratings: false,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      const url = "https://yts.mx/api/v2/list_movies.json";

      try {
        const response = await axios.get(url, { params: options });
        setMovies(response.data.data.movies);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      const url = "https://yts.mx/api/v2/list_movies.json";

      try {
        const response = await axios.get(url);
        const uniqueGenres = Array.from(
          new Set(response.data.data.movies.flatMap((movie) => movie.genres))
        );
        setGenres(uniqueGenres);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMovies();
    fetchGenres();
  }, [options]);

  const handleOptionChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-gray-900">
      <nav className="bg-gray-100 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-black">
            SPARROW Movies
          </Link>
          <form className="flex">
            <input
              className="border border-gray-300 bg-white rounded-lg py-2 px-4 focus:outline-none "
              type="text"
              placeholder="Search"
              aria-label="Search"
              value={options.query_term}
              onChange={(e) => handleOptionChange("query_term", e.target.value)}
            />
          </form>
        </div>
      </nav>
      <div className="container bg-gray-900 mx-auto pt-8">
        <div className="bg-gray-100 py-4 rounded">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
            <div className="relative">
              <select
                className="border border-gray-300 bg-white rounded-lg py-2 px-2 focus:outline-none "
                onChange={(e) => handleOptionChange("quality", e.target.value)}
              >
                <option value="All">Quality</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="2160p">2160p</option>
                <option value="3D">3D</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="border border-gray-300 bg-white rounded-lg py-2 px-2 focus:outline-none "
                onChange={(e) =>
                  handleOptionChange("minimum_rating", parseInt(e.target.value))
                }
              >
                <option value="">Rating</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                className="border border-gray-300 bg-white rounded-lg py-2 px-2 focus:outline-none "
                onChange={(e) => handleOptionChange("genre", e.target.value)}
              >
                <option value="">Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                className="border border-gray-300 bg-white rounded-lg py-2 px-2 focus:outline-none "
                onChange={(e) => handleOptionChange("sort_by", e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="title">Title</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
                <option value="download_count">Most watched</option>
                <option value="like_count">Popular</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="border border-gray-300 bg-white rounded-lg py-2 px-2 focus:outline-none "
                onChange={(e) => handleOptionChange("order_by", e.target.value)}
              >
                <option value="">Order By</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-7">
          {movies?.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              <Link to={`/movies/${movie.id}`}>
                <img
                  src={movie.medium_cover_image}
                  className="object-cover w-full"
                  alt={movie.title}
                />
                <div className="p-4">
                  <h1 className="text-xl font-semibold mb-2">{movie.title}</h1>
                  <p className="text-sm text-gray-700">
                    {movie.rating} / 10 | {movie.year} | {movie.runtime} min
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <nav className="bg-gray-900 rounded py-4 mt-5">
          <ul className="flex justify-center">
            <li>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-lg"
                value={options.page}
                onClick={(e) =>
                  handleOptionChange("page", parseInt(e.target.value - 1))
                }
              >
                Previous
              </button>
            </li>
            {[...Array(10)].map((_, index) => {
              const uniqueId = `page-item-${index}`;
              return (
                <li
                  key={uniqueId}
                  className={`${
                    options.page === index + 1 ? "bg-blue-500" : "bg-gray-300"
                  } hover:bg-blue-500 text-white font-bold py-2 px-4`}
                >
                  <button
                    className="rounded-lg"
                    value={options.page}
                    onClick={() =>
                      handleOptionChange("page", parseInt(index + 1))
                    }
                  >
                    {index + 1}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
                value={options.page}
                onClick={(e) =>
                  handleOptionChange("page", parseInt(e.target.value + 1))
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MovieList;