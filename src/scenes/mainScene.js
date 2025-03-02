import * as THREE from 'three';
import Stats from 'stats.js';
import * as CANNON from 'cannon-es';

import { createFirstPersonCamera } from '../cameras/firstPersonCamera.js';
import { createThirdPersonCamera } from '../cameras/thirdPersonCamera.js';
import { setupPlayerMovement } from '../controls/playerMovement.js';
import { addFloor } from '../shapes/floor.js';
import { addCube } from '../shapes/cube.js';
import { addPlayer } from '../entities/playerUtils.js';

export function setupScene() {
    const stats = new Stats();
    const world = new CANNON.World();
    world.gravity.set(0, -15, 0); // Reduced gravity from -20 to -15 for longer jumps
    world.defaultContactMaterial.friction = 0.2; // Reduced global friction
    world.defaultContactMaterial.restitution = 0.1; // Slight bounce

    let currentCamera;
    let scene, renderer;
    let player;
    let clock;
    let updateParkour;

    function handleResize() {
        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update camera aspect ratio
        currentCamera.aspect = window.innerWidth / window.innerHeight;
        currentCamera.updateProjectionMatrix();
    }

    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Light sky blue color
        clock = new THREE.Clock();

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased ambient light intensity
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased directional light intensity
        directionalLight.position.set(10, 15, 10); // Adjusted light position for better shadows
        directionalLight.castShadow = true;
        
        // Improve shadow quality
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.bias = -0.0001;
        
        scene.add(directionalLight);

        // Add player to the scene and Cannon.js world
        player = addPlayer(world);
        scene.add(player);

        // Initialize renderer with shadow support
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(renderer.domElement);

        // Add the stats panel to the document
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        stats.dom.classList.add('stats-panel');

        // Set initial camera
        currentCamera = createThirdPersonCamera(player);
        setupPlayerMovement(player, currentCamera);

        // Add floor with Cannon.js physics and get parkour update function
        updateParkour = addFloor(scene, world);

        // Set up event listeners
        window.addEventListener('keydown', switchCamera);
        window.addEventListener('resize', handleResize);

        animate();
    }

    function switchCamera(event) {
        if (event.key === '1' || event.key === '3') {
            // Store the current pointer lock state
            const wasLocked = document.pointerLockElement === document.body;
            
            // Clean up previous camera event listeners
            if (player.cleanupCamera) {
                player.cleanupCamera();
            }

            // Switch camera
            if (event.key === '1') {
                currentCamera = createFirstPersonCamera(player);
            } else if (event.key === '3') {
                currentCamera = createThirdPersonCamera(player);
            }

            // Update camera aspect ratio after switching
            currentCamera.aspect = window.innerWidth / window.innerHeight;
            currentCamera.updateProjectionMatrix();

            // Restore pointer lock if it was active
            if (wasLocked && document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        const deltaTime = clock.getDelta();

        // Update physics with fixed timestep
        const fixedTimeStep = 1.0 / 60.0;
        const maxSubSteps = 3;
        world.step(fixedTimeStep, deltaTime, maxSubSteps);

        // Update parkour platforms
        if (updateParkour) {
            updateParkour(deltaTime);
        }

        renderer.render(scene, currentCamera);
        player.updateMovement(deltaTime);
        player.updateAnimations(deltaTime);
        stats.update();

        // Update positions of Three.js objects based on Cannon.js physics
        scene.traverse((child) => {
            if (child.userData.physicsBody) {
                child.position.copy(child.userData.physicsBody.position);
                child.quaternion.copy(child.userData.physicsBody.quaternion);
            }
        });
    }

    init();

    // Cleanup function
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', switchCamera);
        // Additional cleanup if needed
    };
}