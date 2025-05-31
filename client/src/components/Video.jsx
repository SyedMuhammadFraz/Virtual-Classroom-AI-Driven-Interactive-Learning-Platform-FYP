import React from 'react';
import './Video.css';
import { FaStar, FaRobot } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';
import { useNavigate } from 'react-router-dom';
function Video() {

    const navigate = useNavigate();
    return (
        <div className='video'>
            <video autoPlay loop muted className='video-bg'>
                <source src="AIvideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="overlay"></div>
            <div className="video-content">
                <p className="health-text">
                    <FaRobot className="health-icon" />Learning Redefined with AI
                </p>
                <h1>
                    <Typewriter
                        options={{
                            strings: ['Your Personalized Classroom, Powered by AI'],
                            autoStart: true,
                            loop: true,  // Ensure the typing effect loops continuously
                            delay: 100,  // Adjust the typing speed (lower is faster)
                        }}
                    />
                </h1>
                <p>Engage in an immersive, teacher-less learning experience. Our platform brings knowledge to life through interactive 3D models and smart lesson delivery..</p>
                <div className='video-btns'>
                    <button className='video-btn' onClick={() => navigate('/signin')}>Get Started</button>
                    <button className='video-btn' onClick={() => navigate('/signup')}>Register Now</button>
                </div>
                <hr className='video-line' />
                <div className="rating">
                    <p className='rating-text'>
                        Student Satisfaction 5.0
                        <span className="stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </span>
                        Based On 100+ early  Reviews
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Video;
