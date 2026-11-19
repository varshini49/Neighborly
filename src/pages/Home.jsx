import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  return (
    <div className="website">

      <nav className="navbar">
        <h2 className="logo">Neighborly<span>.</span></h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/login">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Your Neighbourhood,
            <br />
            Your <span>Community.</span>
          </h1>

          <p>
            Connect with your neighbours,help each other, and build a stronger community.
          </p>

       
<Link to="/login" className="text-decoration-none">
  <button className="explore-btn">
    Explore Community →
  </button>
</Link>



        </div>

        <div className="hero-image">
          <div className="image-placeholder">
            🏡
            <h3>Better Together</h3>
            <p>Connect,help and grow with your neighbour.</p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <h2>What is Neighborly?</h2>
        <p>
          Neighborly brings people together to create
          a friendly and supportive neighbourhood.
          Because a little help can make a big difference.
        </p>
      </section>

      <section className="services-section" id="services">
        <h2>How We Help Each Other</h2>

        <div className="service-cards">

          <div className="service-card">
            <div className="service-icon">🤝</div>
            <h3>Ask for Help</h3>
            <p>Get support from people living near you.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">📦</div>
            <h3>Share Resources</h3>
            <p>Share useful things and resources with neighbours.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🏘️</div>
            <h3>Build Community</h3>
            <p>Meet neighbours and build meaningful connections.</p>
          </div>

        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2>Let's Build a Better Neighbourhood!</h2>
        <p>Small acts of kindness create stronger communities.</p>
      </section>

      <footer>
        <p>© 2026 Neighborly. Together We Grow.</p>
      </footer>

    </div>
  )
}

export default Home