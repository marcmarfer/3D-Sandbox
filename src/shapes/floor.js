import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createParkour } from './parkour.js';
import { addCube } from './cube.js';

export function addFloor(scene, world) {
    // Arena dimensions
    const arenaSize = 30;
    
    // Floor material - pure white
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        roughness: 0.1,
        metalness: 0.0
    });

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(arenaSize, arenaSize);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor physics
    const floorShape = new CANNON.Box(new CANNON.Vec3(arenaSize/2, 0.1, arenaSize/2));
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
    floorBody.position.set(0, -0.1, 0);
    world.addBody(floorBody);

    // Static cubes (red)
    addCube(-2, 0.5, -3, scene, world, false);
    addCube(2, 0.5, -3, scene, world, false);
    addCube(0, 0.5, -5, scene, world, false);

    // Movable cubes (green)
    addCube(0, 0.5, -2, scene, world, true);
    addCube(-1, 0.5, -4, scene, world, true);
    addCube(1, 0.5, -4, scene, world, true); 

    // Parkour course
    return createParkour(scene, world, { x: -arenaSize/4, y: 0, z: -arenaSize/4 });
}
