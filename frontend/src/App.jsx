import { useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
} from "./api/authApi";
import {
  getMovies,
  searchMovies,
  aiSearchMovies,
} from "./api/movieApi";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("cineai_token");
    if (token) {
      setIsAuth(true);
      loadMovies();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("cineai_token", res.token);
      setIsAuth(true);
      loadMovies();
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await registerUser(email, password);
      localStorage.setItem("cineai_token", res.token);
      setIsAuth(true);
      loadMovies();
    } catch (err) {
      alert("Register failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cineai_token");
    setIsAuth(false);
  };

  const loadMovies = async () => {
    const data = await getMovies();
    setMovies(data);
  };

  const handleSearch = async () => {
    const data = await searchMovies(search);
    setMovies(data);
  };

  const handleAISearch = async () => {
    const data = await aiSearchMovies(search);
    setMovies(data);
  };

  // ============================
  // AUTH UI
  // ============================
  if (!isAuth) {
    return (
      <div className="h-screen bg-black text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-6 text-red-600">CineAI</h1>

        <div className="bg-gray-900 p-8 rounded w-80">
          <input
            className="w-full p-2 mb-3 bg-gray-800"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 mb-3 bg-gray-800"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister ? (
            <button
              className="w-full bg-red-600 p-2 mb-2"
              onClick={handleRegister}
            >
              Register
            </button>
          ) : (
            <button
              className="w-full bg-red-600 p-2 mb-2"
              onClick={handleLogin}
            >
              Login
            </button>
          )}

          <p
            className="text-sm cursor-pointer text-gray-400"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register"}
          </p>
        </div>
      </div>
    );
  }

  // ============================
  // NETFLIX UI
  // ============================
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="flex justify-between p-4">
        <h1 className="text-red-600 text-3xl font-bold">CineAI</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-1"
        >
          Logout
        </button>
      </div>

      <div className="p-4 flex gap-2">
        <input
          className="p-2 text-black w-1/2"
          placeholder="Search movies..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-red-600 px-4"
        >
          Search
        </button>

        <button
          onClick={handleAISearch}
          className="bg-blue-600 px-4"
        >
          AI Search
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 p-4">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-900 p-2">
            <img
              src={movie.posterUrl}
              alt=""
              className="w-full h-40 object-cover"
            />
            <h2 className="mt-2">{movie.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;