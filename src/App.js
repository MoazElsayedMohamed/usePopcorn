import Main from "./components/Main";
import NavBar from "./components/Navbar";
import { useEffect, useState } from "react";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Box from "./components/ListBox";
import MovieList from "./components/MovieList";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMovieList from "./components/WatchedMovieList";
// import StarRating from "./components/StarRating";
import MovieDetails from "./components/MovieDetails";
import Loader from "./components/Loader";

const KEY = "91356a83";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
          console.log(data.Search);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
          setError("");
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovie();
    },
    [query]
  );

  return (
    <div>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />}</Box> */}
          {!error && !isLoading && (
            <MovieList movies={movies} onSelect={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
          {isLoading && <Loader />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails selectedId={selectedId} onClose={handleCloseMovie} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

// function MovieDetails({ selectedId, onClose }) {
//   const [movie, setMovie] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     Title: title,
//     Poster: poster,
//     Runtime: runtime,
//     imdbRating,
//     Plot: plot,
//     Released: released,
//     Actors: actors,
//     Director: director,
//     Genre: genre,
//   } = movie;

//   useEffect(() => {
//     setIsLoading(true);
//     async function getMovieDetails() {
//       const res = await fetch(
//         `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
//       );
//       const data = await res.json();
//       setMovie(data);
//       setIsLoading(false);
//     }
//     getMovieDetails();
//   }, [selectedId]);

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div className="details">
//           <header>
//             <button className="btn-back" onClick={onClose}>
//               &larr;
//             </button>
//             <img src={poster} alt={`Poster of ${movie} movie`} />
//             <div className="details-overview">
//               <h2>{title}</h2>
//               <p>
//                 {released} &bull; {runtime}
//               </p>
//               <p>{genre}</p>
//               <p>
//                 <span>⭐</span>
//                 {imdbRating} IMDb rating
//               </p>
//             </div>
//           </header>
//           <section>
//             <div className="rating">
//               <StarRating maxRating={10} size={24} />
//             </div>
//             <p>
//               <em>{plot}</em>
//             </p>
//             <p>Starring {actors}</p>
//             <p>Directed by {director}</p>
//           </section>
//         </div>
//       )}
//     </>
//   );
// }

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

export default App;
