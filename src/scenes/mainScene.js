import * as THREE from 'three';
import Stats from 'stats.js';
import Cannon from 'cannon';

import { createFirstPersonCamera } from '../cameras/firstPersonCamera.js';
import { createThirdPersonCamera } from '../cameras/thirdPersonCamera.js';
import { setupPlayerMovement } from '../controls/playerMovement.js';
import { addFloor } from '../shapes/floor.js';
import { addCube } from '../shapes/cube.js';
import { addPlayer } from '../entities/playerUtils.js';

export function setupScene() {
    const textureLoader = new THREE.TextureLoader();
    const stats = new Stats();
    const world = new Cannon.World();
    world.gravity.set(0, -9.82, 0); // Set gravity for Cannon.js world

    let currentCamera;
    let scene, renderer;
    let player;

    function init() {
        scene = new THREE.Scene();

        // Add player to the scene and Cannon.js world
        player = addPlayer(world);
        scene.add(player);

        // Initialize renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add the stats panel to the document
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        stats.dom.classList.add('stats-panel');

        // Set initial camera
        currentCamera = createThirdPersonCamera(player);
        setupPlayerMovement(player, currentCamera);

        // Instance objects to the scene with Cannon.js integration
        addCube(0, 15, 0, scene, world);
        addCube(1, 15, -2, scene, world);
        addCube(-1, 20, -4, scene, world);
        addCube(-1.5, 13, -4, scene, world);

        // Add floor with Cannon.js physics
        addFloor(scene, textureLoader, world);

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
        stats.update();

        // Step the Cannon.js physics simulation
        world.step(1 / 60);

        // Update positions of Three.js objects based on Cannon.js physics
        scene.traverse((child) => {
            if (child.userData.physicsBody) {
                child.position.copy(child.userData.physicsBody.position);
                child.quaternion.copy(child.userData.physicsBody.quaternion);
            }
        });
    }

    init();
}