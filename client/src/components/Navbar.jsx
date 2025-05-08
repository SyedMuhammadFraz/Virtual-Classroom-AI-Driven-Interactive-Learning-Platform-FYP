import { useEffect, useState } from 'react';
import './Navbar.css';
import { useLocation,useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignInAlt } from 'react-icons/fa';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); 
    const location = useLocation();
    const isLandingPage = location.pathname === "/";
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false); // Close menu on scroll
        }
    };

    return (
        <div className={`navbar ${scrolled ? 'scrolled' : ''} ${!isLandingPage && !scrolled ? 'black-theme' : ''}`}>
            <div className='nav-bottom'>
                <div>
                    <img className='icon' src='VClogo 2.png' alt='Logo' />
                </div>
                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <button className='link' onClick={() => scrollToSection('home')}>Home</button>
                    <button className='link' onClick={() => scrollToSection('about')}>About Project</button>
                    <button className='link' onClick={() => scrollToSection('approach')}>Approach</button>
                    <button className='link' onClick={() => scrollToSection('why')}>Why Choose</button>
                    <button className='link' onClick={() => scrollToSection('impact')}>Impact</button>
                    <button className='link' onClick={() => scrollToSection('values')}>Values</button>
                    <button className='link' onClick={() => scrollToSection('team')}>Our Team</button>
                </div>
                <button className={`menu-btn ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div className='contact-container'>
                    <button className='contact-btn' onClick={() => navigate('/signin')}>
                        Login
                        <FaSignInAlt className='contact-icon'/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
