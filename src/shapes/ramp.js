import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function createRamp(scene, world, position, options) {
    const {
        width,
        length,
        height,
        angle,
        rotation
    } = options;

    if (width === undefined || length === undefined || height === undefined || 
        angle === undefined || rotation === undefined) {
        throw new Error('All ramp parameters (width, length, height, angle, rotation) are required');
    }

    const rampGeometry = new THREE.BoxGeometry(width, 1, length);
    const rampMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.3,
        metalness: 0.1
    });
    
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.copy(position);
    ramp.position.y += height/2;
    ramp.rotation.x = angle;
    ramp.rotation.y = rotation;
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    scene.add(ramp);

    const rampShape = new CANNON.Box(new CANNON.Vec3(width/2, 0.5, length/2));
    const rampBody = new CANNON.Body({ mass: 0, shape: rampShape });
    rampBody.position.copy(ramp.position);
    rampBody.quaternion.copy(ramp.quaternion);
    world.addBody(rampBody);

    return { mesh: ramp, body: rampBody };
} 