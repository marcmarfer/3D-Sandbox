import * as THREE from 'three';

export function addFloor(scene, textureLoader) {
    // Grid size
    const numTiles = 8;
    const tileSize = 3;

    const floorTexture = textureLoader.load('floorTexture.png');

    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });

    for (let i = -numTiles; i < numTiles; i++) {
        for (let j = -numTiles; j < numTiles; j++) {
            const floorGeometry = new THREE.PlaneGeometry(tileSize, tileSize, 1, 1);

            const floorTile = new THREE.Mesh(floorGeometry, floorMaterial);
            floorTile.rotation.x = -Math.PI / 2;
            floorTile.position.set(i * tileSize, -1.5, j * tileSize);

            scene.add(floorTile);
        }
    }
}
