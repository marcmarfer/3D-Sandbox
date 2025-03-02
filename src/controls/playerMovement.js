import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function setupPlayerMovement(player, camera) {
    const keys = [];
    let isMoving = false;
    let canJump = true;
    const jumpForce = 10.5;
    const airControl = 0.8;
    
    player.isMoving = false;

    player.body.addEventListener('collide', (event) => {
        const contact = event.contact;
        const normalY = contact.ni.y;

        if (normalY > 0.5) {
            canJump = true;
            player.body.linearDamping = 0.95;
        }
    });

    function onKeyDown(e) {
        if (["d", "a", "w", "s", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " "].includes(e.key) && keys.indexOf(e.key) === -1) {
            keys.push(e.key);

            if (e.key === " " && canJump) {
                canJump = false;
                player.body.linearDamping = 0.25;
                const jumpImpulse = new CANNON.Vec3(0, jumpForce, 0);
                player.body.velocity.vadd(jumpImpulse, player.body.velocity);
                player.setAnimation("Jump");
            }
        }
    }

    function onKeyUp(e) {
        if (["d", "a", "w", "s", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
            keys.splice(keys.indexOf(e.key), 1);
        }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    player.updateMovement = () => {
        // Get the camera's forward direction and flatten it to the XZ plane
        const cameraForward = player.cameraDirection.clone();
        cameraForward.y = 0;
        cameraForward.normalize();

        // Calculate camera's right vector (crossing UP with FORWARD gives us RIGHT)
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraForward, new THREE.Vector3(0, 1, 0)).normalize();

        // Initialize movement direction
        const moveDirection = new THREE.Vector3(0, 0, 0);

        // Add movement based on input
        if (keys.includes('w') || keys.includes('ArrowUp')) {
            moveDirection.add(cameraForward);
        }
        if (keys.includes('s') || keys.includes('ArrowDown')) {
            moveDirection.sub(cameraForward);
        }
        if (keys.includes('d') || keys.includes('ArrowRight')) {
            moveDirection.add(cameraRight);
        }
        if (keys.includes('a') || keys.includes('ArrowLeft')) {
            moveDirection.sub(cameraRight);
        }

        const wasMoving = isMoving;
        isMoving = moveDirection.length() > 0;
        player.isMoving = isMoving;

        if (isMoving !== wasMoving && canJump && !player.isJumping) {
            player.setAnimation(isMoving ? "Walking" : "Idle");
        }

        if (isMoving) {
            moveDirection.normalize();
            
            const currentSpeed = canJump ? player.speed : player.speed * airControl;
            
            // Update position using the camera-relative movement
            player.body.position.vadd(
                new CANNON.Vec3(
                    moveDirection.x * currentSpeed,
                    0,
                    moveDirection.z * currentSpeed
                ),
                player.body.position
            );

            // Rotate player model to face movement direction
            const angle = Math.atan2(moveDirection.x, moveDirection.z);
            player.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);
        }

        // Update camera
        player.updateCamera();
    };
}
