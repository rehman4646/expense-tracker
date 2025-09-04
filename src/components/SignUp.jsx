import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError(true);
      return;
    }

    try {
      let result = await fetch("http://localhost:5000/register", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      result = await result.json();
      console.log("Register result:", result);

      if (result.success) {
        toast.success(result.message || "User registered successfully");
        navigate("/"); // Redirect to login
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error, please try again later");
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">
     <div
        className="row h-60 align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-6">
          <form onSubmit={register}>
            <div className="bg-light rounded p-4 p-sm-5 my-4 me-3 shadow-sm">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <h3>Sign Up</h3>
              </div>

              {/* Username */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${error && !name ? "is-invalid" : ""}`}
                  placeholder="jhondoe"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <label htmlFor="floatingText">Username</label>
                <div className="invalid-feedback text-start ps-5">
                  *Enter Username
                </div>
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className={`form-control ${error && !email ? "is-invalid" : ""}`}
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <label htmlFor="floatingInput">Email address</label>
                <div className="invalid-feedback text-start ps-5">
                  *Enter Email
                </div>
              </div>

              {/* Password */}
              <div className="form-floating mb-4">
                <input
                  type="password"
                  className={`form-control ${error && !password ? "is-invalid" : ""}`}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback text-start ps-5">
                  *Enter Password
                </div>
              </div>

              <button type="submit" className="btn btn-primary py-2 w-100 mb-4">
                Sign Up
              </button>

              <p className="text-center mb-0">
                Already have an account? <a href="/">Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
