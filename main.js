import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffca91, 1); // White background to highlight the model
document.getElementById('chair').appendChild(renderer.domElement);

// Improved lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7); // Slightly more intense light
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1); // More intense directional light
dirLight.position.set(-3, 10, -10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

// Add ambient light for softer overall lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

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
