import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Hide the loading spinner once the model is loaded
const hideLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('visible');
    const content = document.getElementById('content');
    content.classList.add('visible');
};

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffca91, 1); // White background to highlight the model
document.getElementById('chair').appendChild(renderer.domElement);

// Show the loading spinner initially
const showLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('visible');
    const content = document.getElementById('content');
    content.classList.remove('visible');

};

showLoadingSpinner();

// Load the GLTF model
const loader = new GLTFLoader();
let model;
loader.load('https://raw.githubusercontent.com/mtm-naylinhtoo/3dChair/master/models/leather_chair.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(3, 3, 3); // Scale the model up for better visibility
    model.traverse((node) => {
        if (node.isMesh) {
            node.material.metalness = 0.1; // Decrease metalness if too shiny
            node.material.roughness = 0.7; // Adjust roughness to make more realistic
        }
    });
    scene.add(model);
    animate();
    hideLoadingSpinner(); // Hide the loading spinner once the model is loaded
}, undefined, (error) => {
    console.error('An error happened while loading the model', error);
});

// Camera initial position
camera.position.set(0, 3, 5); // Higher and further back
camera.lookAt(scene.position);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle scroll event
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    if (model) {
        model.rotation.y = scrollTop * 0.003; // Adjust the rotation speed as needed
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial call to animate
animate();
