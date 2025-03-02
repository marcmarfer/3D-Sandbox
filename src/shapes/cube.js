import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function addCube(x, y, z, scene, world, isMovable = false) {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
        color: isMovable ? 0x00ff00 : 0xff0000,  // Green for movable, Red for static
        roughness: 0.4,
        metalness: 0.4
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const cubeBody = new CANNON.Body({ 
        mass: isMovable ? 1 : 0,  // Mass 1 for movable, 0 for static
        shape: cubeShape,
        material: new CANNON.Material({
            friction: 0.3,
            restitution: 0.2
        })
    });
    cubeBody.position.set(x, y, z);
    world.addBody(cubeBody);

    cube.userData.physicsBody = cubeBody;
}
