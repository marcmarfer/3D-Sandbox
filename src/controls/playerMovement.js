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
        left.crossVectors(direction, camera.up);

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, direction);

        if (keys.includes('w') || keys.includes('ArrowUp')) {
            player.position.add(forward.multiplyScalar(player.speed));
        }
        if (keys.includes('s') || keys.includes('ArrowDown')) {
            player.position.add(backward.multiplyScalar(player.speed));
        }
        if (keys.includes('a') || keys.includes('ArrowLeft')) {
            player.position.sub(left.multiplyScalar(player.speed));
        }
        if (keys.includes('d') || keys.includes('ArrowRight')) {
            player.position.sub(right.multiplyScalar(player.speed));
        }

        //for third person camera case
        player.updateCamera();
    };
}
