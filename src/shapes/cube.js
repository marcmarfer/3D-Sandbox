import * as THREE from 'three';
import * as CANNON from 'cannon';

export function addCube(x, y, z, scene, world) {
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);
    scene.add(cube);

    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const cubeBody = new CANNON.Body({ mass: 1, shape: cubeShape });
    cubeBody.position.set(x, y, z);
    world.addBody(cubeBody);

    cube.userData.physicsBody = cubeBody;
}
