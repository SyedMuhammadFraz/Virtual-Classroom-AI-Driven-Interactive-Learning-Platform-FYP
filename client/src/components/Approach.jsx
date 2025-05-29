import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaStethoscope } from "react-icons/fa";
import "./Approach.css";

function Approach() {
  const mission = "Our mission is to provide innovative, AI-driven education that enhances personalized learning experiences.";

const vision = "Our vision is to transform education by creating a dynamic, technology-powered learning environment for all students.";

  const [para, setPara] = useState(mission);

  useEffect(() => {
    const btn1 = document.getElementById("btn-1");
    btn1.style.backgroundColor = "#e67e22";
    btn1.style.color = "white";
  }, []);

  const changePara = () => {
    setPara(vision);
    // Change the color of the buttons
    document.getElementById("btn-1").style.backgroundColor = "#e67e22";
    document.getElementById("btn-1").style.color = "white";
    document.getElementById("btn-2").style.backgroundColor = "white";
    document.getElementById("btn-2").style.color = "black";
  };
  
  const changePara1 = () => {
    setPara(mission);
    // Change the color of the buttons
    document.getElementById("btn-1").style.backgroundColor = "white";
    document.getElementById("btn-1").style.color = "black";
    document.getElementById("btn-2").style.backgroundColor = "#e67e22";
    document.getElementById("btn-2").style.color = "white";
  };

  // Intersection Observer Hooks
  const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: imgRef, inView: imgInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: btnRef, inView: btnInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="approach">
      <motion.div
        ref={imgRef}
        className="approach-left"
        initial={{ opacity: 0, x: -50 }}
        animate={imgInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img src="/teacher-student.jpeg" className="approach-im" alt="approach" />
      </motion.div>

      <div className="approach-next">
        <motion.p
          ref={textRef}
          className="approach-text"
          initial={{ opacity: 0, y: -30 }}
          animate={textInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <FaStethoscope className="health-icon" /> Our Approach
        </motion.p>

        <motion.h2
          className="approach-head"
          initial={{ opacity: 0, y: 30 }}
          animate={textInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        >
          Providing <span className="highlight-text"> Personalized </span> AI Education
        </motion.h2>

        <motion.p
          className="approach-para"
          initial={{ opacity: 0, y: 30 }}
          animate={textInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        >
        We deliver personalized care tailored to each individual’s needs—merging innovation with compassion for a truly patient-centered approach.
        </motion.p>

        <motion.div
          ref={btnRef}
          className="approach-btn-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={btnInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          <button className="approach-btn left-approach-button" id="btn-1" onClick={changePara}>
            Our Vision
          </button>
          <button className="approach-btn" id="btn-2" onClick={changePara1}>
            Our Mission
          </button>
        </motion.div>

        <div className="approach-bottom">
          <motion.div
            className="approach-bottom-left"
            initial={{ opacity: 0, x: -30 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            <img className="approach-im-1" src="/working.png" alt="a" />
          </motion.div>

          <motion.div
            className="approach-bottom-next"
            initial={{ opacity: 0, x: 30 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
          >
            <img className="chat-im" src="/chat.jpg" alt="a" />
            <div className="chat-text">{para}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Approach;
