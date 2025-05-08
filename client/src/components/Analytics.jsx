import React from 'react';
import './Analytics.css';
import './LandAbout.css'

function Analytics() {
  return (
    <div className='analytics'>
      <div className='analytics-content'>
        <h2 className='analytics-head'>
          By the numbers: <span className="highlight-text">AI-driven </span> Education in action
        </h2>
        <p className='analytics-para-1'>
        Our AI-powered virtual classroom is transforming education, and the numbers show its impact. From personalized lesson plans to real-time performance tracking, we’re redefining the learning experience.
        </p>
      </div>

      <div className='analytics-circle'>
        <div className='current-circle current-circle-1'>
          <h2 className='analytics-number'>80%</h2>
          <p className='analytics-para'>
          Of students report improved engagement through personalized learning paths
          </p>
        </div>
        <div className='current-circle current-circle-2'>
          <h2 className='analytics-number'>90%</h2>
          <p className='analytics-para'>
          Of administrative tasks are automated, saving valuable time for instructors
          </p>
        </div>
        <div className='current-circle current-circle-3'>
          <h2 className='analytics-number'>75%</h2>
          <p className='analytics-para'>
          Of students complete lessons ahead of schedule due to adaptive learning technology
          </p>
        </div>
        <div className='current-circle current-circle-4'>
          <h2 className='analytics-number'>85%</h2>
          <p className='analytics-para'>
          Of students show increased retention of knowledge with AI-driven content delivery
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;