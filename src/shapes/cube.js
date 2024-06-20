import * as THREE from 'three';

export function addCube(x, y, z, scene) {
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);
    scene.add(cube);
}