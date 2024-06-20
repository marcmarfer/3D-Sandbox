import * as THREE from 'three';

import { createFirstPersonCamera } from '../cameras/firstPersonCamera.js';
import { createThirdPersonCamera } from '../cameras/thirdPersonCamera.js';
import { setupPlayerMovement } from '../controls/playerMovement.js';
import { addCube } from '../shapes/cube.js';
import { addFloor } from '../shapes/floor.js';
import { Player } from '../entities/player.js';

export function setupScene() {
    const textureLoader = new THREE.TextureLoader();
    let currentCamera;
    let scene, renderer;
    let player;

    function init() {
        scene = new THREE.Scene();

        player = new Player();
        scene.add(player);

        // Initialize renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Set initial camera
        currentCamera = createThirdPersonCamera(player);
        setupPlayerMovement(player, currentCamera);

        // Instance objects to the scene
        addCube(0, 0, -2, scene);
        addCube(1, 0, -5, scene);
        addFloor(scene, textureLoader);

        // Set up event listener to switch cameras
        window.addEventListener('keydown', switchCamera);

        animate();
    }

    function switchCamera(event) {
        if (event.key === '1') {
            currentCamera = createFirstPersonCamera(player);
        } else if (event.key === '3') {
            currentCamera = createThirdPersonCamera(player);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, currentCamera);
        player.updateMovement();
    }

    init();
}
