import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <nav className="navbar">

      <div className="logo">
        EcoAI
      </div>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/upload">Upload</Link>

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/history">History</Link>

        <Link to="/education">Learn</Link>

        {

          token ? (

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          ) : (

            <Link to="/login">
              Login
            </Link>

          )

        }

      </div>

    </nav>

  );

}

export default Navbar;