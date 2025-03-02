import * as THREE from 'three';

export function createThirdPersonCamera(player) {
    const thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Camera rotation variables
    let cameraRotation = {
        horizontal: 0,
        vertical: 0
    };
    
    let isMouseDown = false;
    const mouseSensitivity = 0.002;
    
    function onMouseDown(event) {
        isMouseDown = true;
    }
    
    function onMouseUp(event) {
        isMouseDown = false;
    }
    
    function onMouseMove(event) {
        if (!isMouseDown) return;
        
        cameraRotation.horizontal -= event.movementX * mouseSensitivity;
        cameraRotation.vertical -= event.movementY * mouseSensitivity;
        
        cameraRotation.vertical = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.vertical));
    }
    
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    player.updateCamera = () => {
        const distance = 10;
        const height = 3;
        
        // Calculate camera offset using spherical coordinates
        const horizontalDistance = distance * Math.cos(cameraRotation.vertical);
        const verticalDistance = distance * Math.sin(cameraRotation.vertical);
        
        const cameraOffset = new THREE.Vector3(
            horizontalDistance * Math.sin(cameraRotation.horizontal),
            height + verticalDistance,
            horizontalDistance * Math.cos(cameraRotation.horizontal)
        );
        
        // Set camera position relative to player
        thirdPersonCamera.position.copy(player.position).add(cameraOffset);
        
        // Look at the player
        thirdPersonCamera.lookAt(player.position);
    };

    player.updateCamera();

    return thirdPersonCamera;
}
