import React from 'react';
import './Black.css';
import { FaStethoscope, FaCheckCircle, FaBrain, FaLightbulb,FaUsers ,FaRegCalendarAlt } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

function Black() {
    const { ref: left1Ref, inView: left1Visible } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: left2Ref, inView: left2Visible } = useInView({ triggerOnce: true, threshold: 0.2 });
    const { ref: rightRef, inView: rightVisible } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div className="black">
            <div className='black-left'>
                <div ref={left1Ref} className={`black-left-1 ${left1Visible ? 'slide-in-left' : 'hidden-left'}`}>
                    <p className="health-text">
                        <FaStethoscope className="health-icon" /> Why Choose Virtual Classroom
                    </p>
                    <h1 className='black-head'>
                    Revolutionizing  <span className="highlight-text">Education  </span>  with AI Automation
                    </h1>
                    <p className='black-para'>
                        Our commitment to excellence, compassion, and personalized treatment has earned the trust of countless patients. Discover what sets our care apart.
                    </p>
                </div>
                <div ref={left2Ref} className={`black-left-2 ${left2Visible ? 'slide-in-right' : 'hidden-right'}`}>
                    <ul className="styled-list">
                        <li><FaCheckCircle className="icon" /> Automatically generates personalized lesson plans based on student progress.</li>
                        <li><FaCheckCircle className="icon" />  AI tracks and evaluates student performance without manual grading.</li>
                        <li><FaCheckCircle className="icon" />Eliminates administrative workload with automated scheduling and content management.</li>
                        <li><FaCheckCircle className="icon" /> Adaptive learning paths that adjust based on the student’s strengths and weaknesses.</li>
                    </ul>
                </div>
            </div>
            <div
                ref={rightRef}
                className={`black-right ${rightVisible ? 'slide-in-bottom' : 'hidden-bottom'}`}
                style={{
                    backgroundImage: `url('AIeducation.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '50px',
                    height: '580px',
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingBottom: '20px'
                }}
            >
                <div className="content-container">
                    <hr className='video-line' />
                    <div className='im-inner'>
                        <div className='inner-current'>
                            <div className='im-icon'>
                                <FaRegCalendarAlt  className='icon-black' size={30} />
                            </div>
                            <div className='im-content'>
                                <h2 className='inner-black-head'>AI-Powered Automation</h2>
                                <p className='inner-black-text'>Automates administrative tasks, lesson creation, and student assessments.</p>
                            </div>
                        </div>
                        <div className='inner-current'>
                            <div className='im-icon'>
                                <FaLightbulb className='icon-black' size={30} />
                            </div>
                            <div className='im-content'>
                                <h2 className='inner-black-head'>Automated Scheduling</h2>
                                <p className='inner-black-text'>The system automatically schedules lessons and learning activities based on the student’s progress.</p>
                            </div>
                        </div>
                        <div className='inner-current'>
                            <div className='im-icon'>
                                <FaUsers className='icon-black' size={30} />
                            </div>
                            <div className='im-content'>
                                <h2 className='inner-black-head'>Personalized Learning</h2>
                                <p className='inner-black-text'>The system tailors lessons to the needs of each student, ensuring the best learning path for them.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Black;
