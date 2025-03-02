import * as THREE from 'three';

export function createThirdPersonCamera(player) {
    const thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    let cameraRotation = {
        horizontal: 0,
        vertical: 0
    };
    
    const mouseSensitivity = 0.002;
    
    function onMouseMove(event) {
        if (document.pointerLockElement === document.body) {
            cameraRotation.horizontal -= event.movementX * mouseSensitivity;
            cameraRotation.vertical += event.movementY * mouseSensitivity;
            
            // Limit vertical rotation to prevent awkward angles
            cameraRotation.vertical = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotation.vertical));
        }
    }

    function onPointerLockChange() {
        if (document.pointerLockElement === document.body) {
            document.addEventListener('mousemove', onMouseMove);
        } else {
            document.removeEventListener('mousemove', onMouseMove);
        }
    }

    function onPointerLockError() {
        console.error('Pointer lock failed');
    }

    function lockPointer() {
        document.body.requestPointerLock();
    }

    function unlockPointer() {
        document.exitPointerLock();
    }

    // Set up pointer lock
    document.addEventListener('click', lockPointer);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    player.updateCamera = () => {
        const distance = 6;
        const height = 3;
        
        const horizontalDistance = distance * Math.cos(cameraRotation.vertical);
        const verticalDistance = distance * Math.sin(cameraRotation.vertical);
        
        const cameraOffset = new THREE.Vector3(
            horizontalDistance * Math.sin(cameraRotation.horizontal),
            height + verticalDistance,
            horizontalDistance * Math.cos(cameraRotation.horizontal)
        );
        
        thirdPersonCamera.position.copy(player.position).add(cameraOffset);
        thirdPersonCamera.lookAt(player.position);

        const cameraDirection = new THREE.Vector3();
        thirdPersonCamera.getWorldDirection(cameraDirection);
        player.cameraDirection = cameraDirection;
    };

    player.updateCamera();
    
    return thirdPersonCamera;
}
