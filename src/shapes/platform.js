import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function createPlatform(scene, world, position, options = {}) {
    const {
        width = 15,
        depth = 15,
        height = 1
    } = options;

    const platformGeometry = new THREE.BoxGeometry(width, height, depth);
    const platformMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.3,
        metalness: 0.1
    });
    
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.copy(position);
    platform.castShadow = true;
    platform.receiveShadow = true;
    scene.add(platform);

    const platformShape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
    const platformBody = new CANNON.Body({ mass: 0, shape: platformShape });
    platformBody.position.copy(platform.position);
    world.addBody(platformBody);

    return { mesh: platform, body: platformBody };
} 