import React, { useEffect, useRef, useState } from 'react';
import '../styles/lecture.css';
import * as THREE from 'three';

const VirtualClassroom = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const avatarRef = useRef(null); // Reference to the avatar div

  // Initialize Three.js avatar when component mounts
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300); // Avatar size
    avatarRef.current.appendChild(renderer.domElement);

    // Cube for avatar placeholder
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation loop for avatar
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  // Handle user input for chatbot
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      setChatMessages([...chatMessages, { sender: 'user', text: message }]);
      setMessage('');
      setTimeout(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'This is a response from the AI.' },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="container">
      {/* Avatar Section */}
      <div className="avatar" ref={avatarRef}></div>

      {/* Video Content Section */}
      <div className="video-content">
        <iframe
          title="Video Lesson"
          src="https://www.youtube.com/embed/H5hUF86jHn0?si=PhU5i-6tdnJMj2zJ"
          frameBorder="0"
          allowFullScreen
          width="100%"
          height="500px"
        />
      </div>

      {/* Chatbot Section */}
      <div className="chatbot">
        <div className="chat-box">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={message.sender === 'user' ? 'user-message' : 'bot-message'}
            >
              {message.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          onKeyUp={handleSendMessage}
          className="chat-input"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default VirtualClassroom;
