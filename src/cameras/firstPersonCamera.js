import * as THREE from 'three';

export function createFirstPersonCamera(player) {
    const firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    firstPersonCamera.position.set(0, 1.5, 0);

    //adding the camera to the player so it's on it's head
    player.add(firstPersonCamera);

    return firstPersonCamera;
}
