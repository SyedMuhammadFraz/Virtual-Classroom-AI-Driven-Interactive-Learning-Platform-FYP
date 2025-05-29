import React from "react";
import "./OurValues.css";
import { FaLightbulb, FaLaptop, FaChalkboardTeacher, FaAccessibleIcon } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const OurValues = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <section className="ourvalues-container" ref={ref}>
            <motion.p 
                className="health-text"
                initial={{ opacity: 0, y: -20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <FaLaptop className="health-icon" /> Our Values
            </motion.p>
            <motion.h2 
                className="ourvalues-heading"
                initial={{ opacity: 0, y: -20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Empowering <span className="highlight-text">interactive learning</span> through AI
            </motion.h2>
            <motion.p 
                className="ourvalues-description"
                initial={{ opacity: 0, y: -20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                Our AI-powered virtual classroom provides students with an engaging, interactive, and personalized learning experience.
            </motion.p>

            <div className="ourvalues-cards">
                {[{
                    icon: <FaLightbulb className="ourvalues-icon" />, 
                    title: "Innovative Learning", 
                    text: "We utilize AI to create adaptive learning paths, providing each student with a personalized experience that fits their unique learning style and pace."
                }, {
                    icon: <FaChalkboardTeacher className="ourvalues-icon" />, 
                    title: "AI-Driven Teaching", 
                    text: "Our AI-driven 3D models serve as virtual teachers, guiding students through lessons and offering real-time feedback to enhance learning outcomes."
                }, {
                    icon: <FaAccessibleIcon className="ourvalues-icon" />, 
                    title: "Inclusive Education", 
                    text: "Our platform ensures that every student, regardless of location or background, has access to high-quality education and resources."
                }].map((value, index) => (
                    <motion.div 
                        className="ourvalues-card" 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <div className="ourvalues-icon-circle">{value.icon}</div>
                        <h4 className="ourvalues-title">{value.title}</h4>
                        <p className="ourvalues-text">{value.text}</p>
                    </motion.div>
                ))}
            </div>

            <motion.p 
                className="ourvalues-footer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <span className="ourvalues-badge">Free</span> Let’s revolutionize education together. {" "}
                <a href="#google.com" className="ourvalues-link">Get Free Quote</a>
            </motion.p>
        </section>
    );
};

export default OurValues;
