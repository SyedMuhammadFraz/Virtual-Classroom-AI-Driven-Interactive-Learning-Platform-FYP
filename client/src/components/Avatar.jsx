// Avatar.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Avatar = () => {
  const avatarRef = useRef(null);

  useEffect(() => {
    // Set up the scene, camera, and renderer for Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300); // Set size for the scene (adjust if needed)
    avatarRef.current.appendChild(renderer.domElement); // Attach renderer to div

    // Add ambient light to the scene for better visibility
    const light = new THREE.AmbientLight(0x404040); // Ambient light
    scene.add(light);

    // Load the avatar model (replace with your own model path)
    const loader = new GLTFLoader();
    loader.load(
      'https://example.com/path/to/your/avatar_model.glb', // URL or local path to the .glb model
      (gltf) => {
        scene.add(gltf.scene); // Add the loaded model to the scene
        gltf.scene.scale.set(1, 1, 1); // Scale the model if needed
        gltf.scene.position.set(0, -1, 0); // Position the model
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); // Show loading progress
      },
      (error) => {
        console.error('Error loading the model:', error); // Error handling
      }
    );

    camera.position.z = 3; // Position the camera to view the avatar

    // Animation loop for the scene
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera); // Render the scene from the camera
    };

    animate(); // Start animation loop

    // Cleanup function to dispose the renderer when the component unmounts
    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={avatarRef} style={{ width: '100%', height: '100%' }} />;
};

export default Avatar;
