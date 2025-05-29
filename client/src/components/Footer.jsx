import React, {  useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './Footer.css';
import { useInView } from 'react-intersection-observer';
import SearchBar from './SearchBar.jsx'

function Footer() {
  const [ref, InView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  })
  const handleEffect = () => {
    const element = document.querySelector('#footer');
    if (element) {
      element.style.opacity = "1";
      element.style.marginTop = "50px";
    }
  }
  useEffect(() => {
    if (InView) {
      setTimeout(() => {
        handleEffect();
      }, 500);
    }
  }, [InView])
  return (
    <div className="footer" ref={ref} id='footer'>
      <div className="footer-container">
        <div className="footer-column">
          <img className='icon-1' src='VClogo 2.png' alt='Logo' />
          <div className="social-icons-1">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedin />
          </div>
          <h3 className='footer-head'>About Us</h3>
          <p className='footer-para'>We are committed to providing top-notch services with innovation and excellence.</p>
          <SearchBar/>
        </div>

        {/* Column 2 */}
        <div className="footer-column links-column">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Approach</li>
            <li>Impact</li>
            <li>Choose Us</li>
            <li>Careers</li>
            <li>Values</li>
            <li>Our Team</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Security</li>
            <li>Affiliate Program</li>
            <li>Help Center</li>
            <li>Support</li>
            <li>Developer API</li>
            <li>Company News</li>
            <li>Investor Relations</li>
            <li>Corporate Responsibility</li>
            <li>Press Releases</li>
            <li>Events</li>
            <li>Product Updates</li>
            <li>Case Studies</li>
            <li>Community Forum</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h3>Stay Connected</h3>
          <p>Subscribe to our newsletter for updates and insights.</p>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedin />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Virtual Classroom inc. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
