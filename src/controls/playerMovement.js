import * as THREE from 'three';

export function setupPlayerMovement(player, camera) {
    const keys = [];

    function onKeyDown(e) {
        if (["d", "a", "w", "s", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " "].includes(e.key) && keys.indexOf(e.key) === -1) {
            keys.push(e.key);
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
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.normalize();
        
        const forward = new THREE.Vector3(direction.x, 0, direction.z);
        const backward = new THREE.Vector3(-direction.x, 0, -direction.z);

        const left = new THREE.Vector3();
        left.crossVectors(camera.up, direction);

        const right = new THREE.Vector3();
        right.crossVectors(direction, camera.up);

        if (keys.includes('w') || keys.includes('ArrowUp')) {
            player.body.position.vadd(forward.multiplyScalar(player.speed), player.body.position);
        }
        if (keys.includes('s') || keys.includes('ArrowDown')) {
            player.body.position.vadd(backward.multiplyScalar(player.speed), player.body.position);
        }
        if (keys.includes('a') || keys.includes('ArrowLeft')) {
            player.body.position.vadd(left.multiplyScalar(player.speed), player.body.position);
        }
        if (keys.includes('d') || keys.includes('ArrowRight')) {
            player.body.position.vadd(right.multiplyScalar(player.speed), player.body.position);
        }

        // For third person camera case
        player.updateCamera();
    };
}
