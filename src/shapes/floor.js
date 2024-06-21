import * as THREE from 'three';
import * as CANNON from 'cannon';

export function addFloor(scene, textureLoader, world) {
    // Grid size
    const numTiles = 3;
    const tileSize = 3;

    const floorTexture = textureLoader.load('floorTexture.png');
    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });

    for (let i = -numTiles; i < numTiles; i++) {
        for (let j = -numTiles; j < numTiles; j++) {
            // Create a floor tile in Three.js for visualization
            const floorGeometry = new THREE.PlaneGeometry(tileSize, tileSize, 1, 1);
            const floorTile = new THREE.Mesh(floorGeometry, floorMaterial);
            floorTile.rotation.x = -Math.PI / 2;
            floorTile.position.set(i * tileSize, 0, j * tileSize);
            scene.add(floorTile);

            // Create a floor tile in Cannon.js for physics
            const floorShape = new CANNON.Box(new CANNON.Vec3(tileSize / 2, 0.1, tileSize / 2));
            const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
            floorBody.position.set(i * tileSize, -0.1, j * tileSize);
            world.addBody(floorBody);
        }
    }
}
