import React, { useEffect, useRef } from 'react';
import './Leadership.css';
import { useInView } from 'react-intersection-observer';

function Leadership() {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Create refs for each image container
  const imRef = useRef(null);
  const im1Ref = useRef(null);
  const im2Ref = useRef(null);
  const im3Ref = useRef(null);

  useEffect(() => {
    if (inView) {
      setTimeout(() => imRef.current?.classList.add('show'), 100);
      setTimeout(() => im1Ref.current?.classList.add('show'), 500);
      setTimeout(() => im2Ref.current?.classList.add('show'), 1000);
      setTimeout(() => im3Ref.current?.classList.add('show'), 1500);
    }
  }, [inView]);

  return (
    <div className='leadership' ref={ref}>
      <h1 className='ourvalues-heading'>Our <span className='highlight-text'>Team</span></h1>
      <p className='analytics-para'>
        "A passionate team of innovators, educators, and technologists, dedicated to revolutionizing education through AI-driven, interactive learning experiences."
      </p>
      <div className='leadership-grid'>
        <div className='current-leader'>
          <div className='image-container' ref={imRef}>
            <img className='im-leader' src='Fraz.jpeg' alt='Chief Executive Officer' />
            <div className='green-bar'></div>
          </div>
          <p className='leader-name-1'>Syed Fraz</p>
          <p className='leader-name'>Chief Executive Officer</p>
        </div>
        <div className='current-leader'>
          <div className='image-container' ref={im1Ref}>
            <img className='im-leader' src='Muaaz.png' alt='President' />
            <div className='green-bar'></div>
          </div>
          <p className='leader-name-1'>Muaaz Shoaib</p>
          <p className='leader-name'>Chief Technology Officer</p>
        </div>
        <div className='current-leader'>
          <div className='image-container' ref={im2Ref}>
            <img className='im-leader' src='Umair.png' alt='Vice President' />
            <div className='green-bar'></div>
          </div>
          <p className='leader-name-1'>Umair Saleem</p>
          <p className='leader-name'>Chief Operating Officer</p>
        </div>
        <div className='current-leader'>
          <div className='image-container' ref={im3Ref}>
            <img className='im-leader' src='Aftab.png' alt='Corporate Secretary' />
            <div className='green-bar'></div>
          </div>
          <p className='leader-name-1'>Aftab Ali</p>
          <p className='leader-name'>Chief Marketing Officer</p>
        </div>
      </div>
    </div>
  );
}

export default Leadership;
