import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Hide the loading spinner once the models are loaded
const hideLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('visible');
    const content = document.getElementById('content');
    content.classList.add('visible');
};

// Show the loading spinner initially
const showLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('visible');
    const content = document.getElementById('content');
    content.classList.remove('visible');
};

// Function to create a new scene, camera, and renderer
const createScene = (containerId) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffca91, 1); // White background to highlight the model
    renderer.shadowMap.enabled = true; // Enable shadow map
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow map type
    document.getElementById(containerId).appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(0, 10, 0); // Coming from above
    // directionalLight.castShadow = true; // Enable shadow casting for the directional light
    scene.add(directionalLight);

    return { scene, camera, renderer };
};

// Create scenes for both models
const chairScene = createScene('chair');
const somethingScene = createScene('something');

showLoadingSpinner();

// Load the GLTF model into a given scene
const loadModel = (scene, url, scale = 1) => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
        const model = gltf.scene;
        model.scale.set(scale, scale, scale); // Scale the model up for better visibility
        model.traverse((node) => {
            if (node.isMesh) {
                // node.castShadow = true; // Enable shadow casting for meshes
                // node.receiveShadow = true; // Enable shadow receiving for meshes
                node.material.metalness = 0.1; // Decrease metalness if too shiny
                node.material.roughness = 0.7; // Adjust roughness to make more realistic
            }
        });
        scene.add(model);
        hideLoadingSpinner(); // Hide the loading spinner once the model is loaded
    }, undefined, (error) => {
        console.error('An error happened while loading the model', error);
    });
};

// Load models into respective scenes
loadModel(chairScene.scene, 'https://raw.githubusercontent.com/mtm-naylinhtoo/3dChair/master/models/leather_chair.gltf', 3);
loadModel(somethingScene.scene, 'https://raw.githubusercontent.com/mtm-naylinhtoo/3dChair/master/models/burger.glb', 1); // Update the URL to your second GLB file

// Add a plane to receive shadows
const addShadowPlane = (scene) => {
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1; // Adjust as needed
    plane.receiveShadow = true;
    scene.add(plane);
};

addShadowPlane(chairScene.scene);
addShadowPlane(somethingScene.scene);

// Camera initial positions
chairScene.camera.position.set(0, 3, 5); // Higher and further back
chairScene.camera.lookAt(chairScene.scene.position);

somethingScene.camera.position.set(0, 3, 5); // Higher and further back
somethingScene.camera.lookAt(somethingScene.scene.position);

// Animation loop for both scenes
const animate = (scene, camera, renderer) => {
    const animateFunction = () => {
        requestAnimationFrame(animateFunction);
        renderer.render(scene, camera);
    };
    animateFunction();
};

// Handle scroll event
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    chairScene.scene.traverse((object) => {
        if (object.isMesh) {
            object.rotation.y = scrollTop * 0.007; 
            object.rotation.x = scrollTop * 0.002;
        }
    });
    somethingScene.scene.traverse((object) => {
        if (object.isMesh) {
            object.rotation.y = scrollTop * 0.002; 
        }
    });
});

// Check if the device is a phone
function isPhone() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Handle window resize only on non-phone devices
if (!isPhone()) {
    window.addEventListener('resize', () => {
        chairScene.camera.aspect = window.innerWidth / window.innerHeight;
        chairScene.camera.updateProjectionMatrix();
        chairScene.renderer.setSize(window.innerWidth, window.innerHeight);

        somethingScene.camera.aspect = window.innerWidth / window.innerHeight;
        somethingScene.camera.updateProjectionMatrix();
        somethingScene.renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initial calls to animate
animate(chairScene.scene, chairScene.camera, chairScene.renderer);
animate(somethingScene.scene, somethingScene.camera, somethingScene.renderer);
