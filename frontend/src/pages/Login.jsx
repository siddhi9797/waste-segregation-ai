import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isLogin) {

        const response = await axios.post(

          "http://localhost:5000/api/auth/login",

          {
            email: formData.email,
            password: formData.password,
          }

        );

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        alert("Login Successful");

        navigate("/upload");

      }

      else {

        await axios.post(

          "http://localhost:5000/api/auth/signup",

          formData

        );

        alert("Signup Successful");

        setIsLogin(true);

      }

    }

    catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <div className="auth-page">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h1>
          {isLogin ? "Login" : "Create Account"}
        </h1>

        {!isLogin && (

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">

          {isLogin ? "Login" : "Sign Up"}

        </button>

        <p
          style={{
            marginTop: "15px",
            cursor: "pointer",
          }}
          onClick={() =>
            setIsLogin(!isLogin)
          }
        >

          {isLogin
            ? "New User? Sign Up"
            : "Already have an account? Login"}

        </p>

      </form>

    </div>

  );

}

export default Login;