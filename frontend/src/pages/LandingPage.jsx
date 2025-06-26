import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <header>
        <div className="container">
          <nav className="navbar">
            <Link to="/" className="logo">
              <i className="fas fa-shield-alt" />VeriFake
            </Link>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen((m) => !m)}
            >
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Detect Deep Fake Easily in Seconds</h1>
          <p>
            Use VeriFake to analyze videos, images, and audio files for
            authenticity with our cutting-edge AI technology
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <a href="#features" className="btn btn-outline">
              See Demo
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <div className="section-title">
            <h2>About VeriFake</h2>
            <p>
              Our mission is to empower individuals and organizations with
              cutting-edge tools to detect deep fakes
            </p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>Our Mission</h3>
              <p>
                In an era where digital content is both ubiquitous and easily
                manipulated, VeriFake stands as a beacon of truth and
                authenticity. Our mission is to empower individuals,
                organizations, and communities with cutting-edge tools to detect
                and combat the growing threat of deep fakes.
              </p>

              <h3>What is VeriFake?</h3>
              <p>
                VeriFake is our state-of-the-art AI-driven platform designed to
                detect deep fake videos, audios, and images with precision and
                speed. Leveraging the latest advancements in machine learning,
                neural networks, and media analysis, we offer a powerful
                solution to identify manipulated media.
              </p>

              <h3>Our Technology</h3>
              <p>
                At the heart of VeriFake is a robust AI engine trained on vast
                datasets of authentic and synthetic media. By analyzing minute
                details such as facial expressions, voice patterns, and
                pixel-level anomalies, VeriFake can detect even the most subtle
                deep fakes.
              </p>
            </div>
            <div className="about-image">
              <i className="fas fa-brain" />
            </div>
          </div>
        </div>
      </section>

      <section className="section features" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Fantastic Features</h2>
            <p>
              Powerful tools to detect and analyze deep fakes across all media
              formats
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bolt" />
              </div>
              <h3>Real-Time Detection</h3>
              <p>
                Analyze media files in real-time with our advanced algorithms.
                Get results in seconds, not hours.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-video" />
              </div>
              <h3>Comprehensive Analysis</h3>
              <p>
                Thorough examination of videos, audio files, and images for any
                signs of manipulation or deep fakes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt" />
              </div>
              <h3>Privacy Protection</h3>
              <p>
                We prioritize your privacy and security. Your files are
                processed securely and never stored without permission.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-friends" />
              </div>
              <h3>Multi-User Support</h3>
              <p>
                Collaborate with your team. Share results and work together to
                verify media authenticity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt" />
              </div>
              <h3>Mobile Analytics</h3>
              <p>
                Access VeriFake on the go with our mobile-friendly platform.
                Analyze media anytime, anywhere.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-cloud-download-alt" />
              </div>
              <h3>Cloud Integration</h3>
              <p>
                Connect with cloud storage services to directly analyze files
                from your preferred storage platform.
              </p>
            </div>
          </div>

          <div className="upload-section">
            <h2>Analyze Your Media in One Place</h2>
            <p>
              Upload videos, audio files, or images to detect deep fakes with our
              powerful AI technology
            </p>
            <div className="upload-box">
              <i className="fas fa-cloud-upload-alt" />
              <h3>Drop your video/audio/picture here</h3>
              <p>Or click to browse files</p>
            </div>
            <div className="file-types">
              <div className="file-type">MP4, MOV, AVI</div>
              <div className="file-type">MP3, WAV, AAC</div>
              <div className="file-type">JPG, PNG, GIF</div>
            </div>
            <div className="stats">
              <div className="stat-card">
                <i className="fas fa-clock" />
                <h3>60+ min</h3>
                <p>User Time/Day</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-users" />
                <h3>250K+</h3>
                <p>Active Users</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-check-circle" />
                <h3>98.7%</h3>
                <p>Accuracy Rate</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-file-medical" />
                <h3>5M+</h3>
                <p>Files Analyzed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>VeriFake</h3>
              <p>
                The most advanced platform for detecting deep fakes and
                manipulated media. Join us in the fight against misinformation.
              </p>
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#">
                  <i className="fab fa-linkedin-in" />
                </a>
                <a href="#">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h3>Features</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Real-Time Detection</a>
                </li>
                <li>
                  <a href="#">Video Analysis</a>
                </li>
                <li>
                  <a href="#">Audio Verification</a>
                </li>
                <li>
                  <a href="#">Image Authentication</a>
                </li>
                <li>
                  <a href="#">API Integration</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Tutorials</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Case Studies</a>
                </li>
                <li>
                  <a href="#">Research Papers</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Partners</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2024 VeriFake Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
