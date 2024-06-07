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
renderer.shadowMap.enabled = true; // Enable shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow map type
document.getElementById('chair').appendChild(renderer.domElement);

// Show the loading spinner initially
const showLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('visible');
    const content = document.getElementById('content');
    content.classList.remove('visible');
};

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
directionalLight.position.set(0, 10, 0); // Coming from above
// directionalLight.castShadow = true; // Enable shadow casting for the directional light
scene.add(directionalLight);

// // Configure shadow properties for the directional light
// directionalLight.shadow.mapSize.width = 2048; // Increase shadow map resolution
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.near = 0.5; // Near clipping plane
// directionalLight.shadow.camera.far = 50; // Far clipping plane
// directionalLight.shadow.camera.left = -10;
// directionalLight.shadow.camera.right = 10;
// directionalLight.shadow.camera.top = 10;
// directionalLight.shadow.camera.bottom = -10;
// directionalLight.shadow.bias = -0.0001; // Adjust bias to reduce shadow acne

showLoadingSpinner();

// Load the GLTF model
const loader = new GLTFLoader();
let model;
loader.load('https://raw.githubusercontent.com/mtm-naylinhtoo/3dChair/master/models/leather_chair.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(3, 3, 3); // Scale the model up for better visibility
    model.traverse((node) => {
        if (node.isMesh) {
            // node.castShadow = true; // Enable shadow casting for meshes
            // node.receiveShadow = true; // Enable shadow receiving for meshes
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

// Add a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1; // Adjust as needed
plane.receiveShadow = true;
scene.add(plane);

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
        model.rotation.y = scrollTop * 0.007; 
        model.rotation.x = scrollTop * 0.002;
    }
});

// Check if the device is a phone
function isPhone() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Handle window resize only on non-phone devices
if (!isPhone()) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initial call to animate
animate();
