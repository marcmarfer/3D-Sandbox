import * as THREE from 'three';

export function createThirdPersonCamera(player) {
    const thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    player.updateCamera = () => {
        // Offset the camera from the player and set the camera to the offset position
        const offset = new THREE.Vector3(0, 3, 10).applyMatrix4(player.matrixWorld);
        thirdPersonCamera.position.copy(offset);
        // Look at the player
        thirdPersonCamera.lookAt(player.position);
    };

    player.updateCamera();

    return thirdPersonCamera;
}
