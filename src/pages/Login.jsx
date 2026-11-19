
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [ShowRegister, setShowRegister] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/register',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setMessage('Registration successful! Please login.')
      setShowRegister(false)
      setName('')
      setEmail('')
      setPassword('')

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save logged-in user details
      localStorage.setItem('user', JSON.stringify(data))

      navigate('/dashboard')

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">

          {ShowRegister ? (

            <div className="card p-4 shadow">
              <h2 className="text-center">
                <b>Register</b>
              </h2>

              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="form-control mb-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-control mb-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account?

                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setShowRegister(false)
                    setMessage('')
                  }}
                >
                  Login
                </button>
              </p>
            </div>

          ) : (

            <div className="card p-4 shadow">
              <h1 className="text-center">
                <b><i>Neighborly</i></b>
              </h1>

              <p>Login to the Account</p>

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="form-control mb-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center mt-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgotten Password?
                </a>
              </p>

              <hr />

              <button
                type="button"
                className="btn btn-primary mx-auto d-block"
                onClick={() => {
                  setShowRegister(true)
                  setMessage('')
                  setPassword('')
                }}
              >
                Create New Account
              </button>
            </div>

          )}

          {message && (
            <div className="alert alert-info mt-3">
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Login
