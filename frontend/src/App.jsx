import { useEffect, useState } from "react";
import { loginUser, registerUser } from "./api/authApi";
import {
  aiSearchMovies,
  getMovies,
  searchMovies,
  uploadMovie,
} from "./api/movieApi";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("cineai_token");
    if (token) {
      setIsAuth(true);
      loadMovies();
    }
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
    } catch {
      localStorage.removeItem("cineai_token");
      setIsAuth(false);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("cineai_token", res.token);
      setIsAuth(true);
      loadMovies();
    } catch {
      alert("Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await registerUser(email, password);
      localStorage.setItem("cineai_token", res.token);
      setIsAuth(true);
      loadMovies();
    } catch {
      alert("Register failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cineai_token");
    setIsAuth(false);
    setMovies([]);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      loadMovies();
      return;
    }
    const data = await searchMovies(query);
    setMovies(data);
  };

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    const data = await aiSearchMovies(query);
    setMovies(data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.target);
      await uploadMovie(formData);
      e.target.reset();
      setShowUpload(false);
      loadMovies();
    } finally {
      setUploading(false);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl w-96">
          <h1 className="text-4xl font-extrabold text-red-600 mb-6 text-center">
            CINEAI
          </h1>

          <input
            className="w-full mb-4 px-4 py-3 rounded bg-zinc-900 border border-zinc-700 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-4 px-4 py-3 rounded bg-zinc-900 border border-zinc-700 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={isRegister ? handleRegister : handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p
            onClick={() => setIsRegister(!isRegister)}
            className="text-zinc-400 text-sm mt-4 text-center cursor-pointer"
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 bg-black/80 backdrop-blur border-b border-zinc-800">
        <h1 className="text-3xl font-extrabold text-red-600">CINEAI</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded font-semibold"
          >
            Upload
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="pt-32 px-8 py-24 bg-gradient-to-r from-black via-zinc-950 to-zinc-900">
        <p className="text-red-500 font-semibold mb-3">
          AI-Powered Streaming Platform
        </p>

        <h2 className="text-5xl md:text-6xl font-extrabold mb-5 max-w-3xl">
          Stream Movies with Smart AI Search
        </h2>

        <p className="text-zinc-300 text-lg max-w-2xl">
          Netflix-style video streaming with JWT authentication, Spring Boot,
          React, MinIO, Ollama and DevSecOps.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-3 max-w-3xl">
          <input
            className="flex-1 px-5 py-4 rounded bg-zinc-900 border border-zinc-700 outline-none focus:border-red-600"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-4 rounded font-semibold"
          >
            Search
          </button>

          <button
            onClick={handleAiSearch}
            className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded font-semibold"
          >
            AI Search
          </button>
        </div>
      </section>

      {showUpload && (
        <section className="px-8 py-10 bg-zinc-950 border-y border-zinc-800">
          <h3 className="text-2xl font-bold mb-6">Upload New Movie</h3>

          <form
            onSubmit={handleUpload}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl"
          >
            <input name="title" placeholder="Movie title" required className="px-4 py-3 rounded bg-zinc-900 border border-zinc-700" />
            <input name="genre" placeholder="Genre" required className="px-4 py-3 rounded bg-zinc-900 border border-zinc-700" />
            <input name="posterUrl" placeholder="Poster image URL" className="px-4 py-3 rounded bg-zinc-900 border border-zinc-700" />
            <input name="file" type="file" accept="video/mp4" required className="px-4 py-3 rounded bg-zinc-900 border border-zinc-700" />

            <textarea
              name="description"
              placeholder="Movie description"
              required
              rows="4"
              className="md:col-span-2 px-4 py-3 rounded bg-zinc-900 border border-zinc-700"
            />

            <button
              disabled={uploading}
              className="md:col-span-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 px-5 py-3 rounded font-semibold"
            >
              {uploading ? "Uploading..." : "Upload Movie"}
            </button>
          </form>
        </section>
      )}

      <section className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Movies</h3>
          <p className="text-zinc-400">{movies.length} movies found</p>
        </div>

        {movies.length === 0 ? (
          <div className="text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            No movies found. Upload a movie or try another search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-red-950/40 transition cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={
                      movie.posterUrl && movie.posterUrl.trim() !== ""
                        ? movie.posterUrl
                        : "https://placehold.co/300x450/111111/ffffff?text=CineAI"
                    }
                    alt={movie.title}
                    className="h-72 w-full object-cover bg-zinc-800"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-bold text-lg">{movie.title}</h4>
                    <p className="text-sm text-red-400">{movie.genre}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-zinc-300 line-clamp-3">
                    {movie.summary || movie.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-950 rounded-xl max-w-5xl w-full overflow-hidden border border-zinc-800">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800">
              <div>
                <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                <p className="text-red-400">{selectedMovie.genre}</p>
              </div>

              <button
                onClick={() => setSelectedMovie(null)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
              >
                Close
              </button>
            </div>

            <video
              controls
              autoPlay
              className="w-full bg-black max-h-[70vh]"
              src={`http://localhost:8081/api/movies/stream/${selectedMovie.id}`}
            />

            <div className="p-5">
              <p className="text-zinc-300">
                {selectedMovie.summary || selectedMovie.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;