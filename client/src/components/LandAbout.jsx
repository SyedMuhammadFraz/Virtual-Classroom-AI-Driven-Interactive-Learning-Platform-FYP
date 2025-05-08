import React, { useEffect } from 'react';
import './LandAbout.css';
import { useInView } from 'react-intersection-observer';
import { FaLongArrowAltRight } from 'react-icons/fa';

function LandAbout() {
    const [ref, InView] = useInView({
        threshold: 0.4,
        triggerOnce: true,
    });

    const handleAnimation = () => {
        const element = document.querySelector('#my-btn');

        if (element) {
            element.style.opacity = "1";
            element.style.transform = "translateY(-30px)";
        }
    };
    const handleImage = () => {
        const element1 = document.querySelector('#im');
        if (element1) {
            element1.style.opacity = "1"
            element1.style.transform = "translateY(-30px)";

        }
    }

    useEffect(() => {
        if (InView) {
            handleImage();
            setTimeout(() => {
                handleAnimation();
            }, 500);
        }
    }, [InView]);

    return (
        <div className={`land-about ${InView ? 'InView' : ''}`} ref={ref}>
            <div className="left-column">
                <img className='land-im' alt='im' src='education.png' id='im' />
            </div>
            <div className="right-column">
                <h2 className='landabout-head'>
                  Revolutionize <span className="highlight-text">Learning</span> with AI-Powered Education
                </h2>
                <p id="my-para">
                Our platform delivers an innovative, AI-driven learning experience that removes the need for traditional teaching methods. By automating lesson creation, student progress tracking, and administrative tasks, we empower students with personalized, interactive education. Utilizing 3D AI teachers, real-time assessments, and adaptive learning paths, our system creates a futuristic classroom that is accessible, engaging, and efficient. Discover how intelligent education can shape the future of learning.
                </p>
                <button id="my-btn" className="professional-btn">Learn More<FaLongArrowAltRight className="forward-icon" size={15} /></button>
            </div>
        </div>
    );
}

export default LandAbout;
