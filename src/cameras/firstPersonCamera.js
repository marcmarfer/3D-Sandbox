import * as THREE from 'three';

export function createFirstPersonCamera(player) {
    const firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    let cameraRotation = {
        horizontal: 0,
        vertical: 0
    };
    
    const mouseSensitivity = 0.002;
    
    function onMouseMove(event) {
        if (document.pointerLockElement === document.body) {
            cameraRotation.horizontal -= event.movementX * mouseSensitivity;
            cameraRotation.vertical -= event.movementY * mouseSensitivity;
            
            // Limit vertical rotation to prevent camera flipping
            cameraRotation.vertical = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.vertical));
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

    const cameraHeight = 1.7;
    const cameraOffset = new THREE.Vector3(0, cameraHeight, 0);

    player.updateCamera = () => {
        firstPersonCamera.position.copy(player.position).add(cameraOffset);
        
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(cameraRotation.horizontal);
        
        const pitchMatrix = new THREE.Matrix4();
        pitchMatrix.makeRotationX(cameraRotation.vertical);
        
        rotationMatrix.multiply(pitchMatrix);
        
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyMatrix4(rotationMatrix);
        
        const target = firstPersonCamera.position.clone().add(forward);
        firstPersonCamera.lookAt(target);
        
        player.cameraDirection = forward;
    };

    player.updateCamera();
    
    return firstPersonCamera;
}
