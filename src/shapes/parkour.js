import * as THREE from 'three';
import { createRamp } from './ramp.js';
import { createPlatform } from './platform.js';

export function createParkour(scene, world, startPosition = { x: 0, y: 0, z: 0 }) {
    const rampHeight = 8;

    // Initial ramp to get started
    createRamp(scene, world, startPosition, {
        width: 4,
        length: 8,
        height: 4,
        angle: Math.PI * -0.15,
        rotation: 0
    });

    // First platform after the ramp
    createPlatform(scene, world, new THREE.Vector3(
        startPosition.x,
        startPosition.y + rampHeight / 2,
        startPosition.z + 8
    ), {
        width: 4,
        depth: 4
    });

    // Second platform - higher and to the right
    createPlatform(scene, world, new THREE.Vector3(
        startPosition.x + 4,
        startPosition.y + rampHeight * 0.7,
        startPosition.z + 13
    ), {
        width: 4,
        depth: 4
    });

    // Third platform - even higher and forward
    createPlatform(scene, world, new THREE.Vector3(
        startPosition.x + 4,
        startPosition.y + rampHeight * 0.9,
        startPosition.z + 18
    ), {
        width: 4,
        depth: 4
    });

    // Fourth platform - to the left
    createPlatform(scene, world, new THREE.Vector3(
        startPosition.x - 4,
        startPosition.y + rampHeight,
        startPosition.z + 23
    ), {
        width: 4,
        depth: 4
    });

    // Final platform - larger landing area
    createPlatform(scene, world, new THREE.Vector3(
        startPosition.x,
        startPosition.y + rampHeight * 1.1,
        startPosition.z + 35
    ), {
        width: 8,
        depth: 8
    });

    return () => {};
} 