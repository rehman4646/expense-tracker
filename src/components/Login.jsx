import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(true);
      return
    }
    let result = await fetch(`http://localhost:5000/login`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    result = await result.json();
    console.log("result is ", result)
    if (result.success === true) {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', JSON.stringify(result.auth));
      navigate('/buildings')
      window.location.href = '/view-expenses';
    } else {
      toast.error(result.message);
    }

  }

  return (
    <div className="container-fluid">
      <div
        className="row h-60 align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-6">
          <form onSubmit={login}>
            <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <h3 className='text-center mb-4'>Login</h3>

              <div className="form-floating mb-2">
                <input
                  type="email"
                  className={`form-control ${error && !email ? 'is-invalid' : ''}`}
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <div className="invalid-feedback text-start ps-5">*Enter Email</div>
                <label htmlFor="floatingInput">Email address</label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className={`form-control ${error && !password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div className="invalid-feedback text-start ps-5">*Enter Password</div>
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Check me out
                  </label>
                </div>
                <a href="#">Forgot Password</a>
              </div>

              <button type="submit" className="btn btn-primary py-2 w-100 mb-4">
                Sign In
              </button>
              <p className="text-center mb-0">
                Don't have an Account? <a href="/sign-up">Sign Up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
