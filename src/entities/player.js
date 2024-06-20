import * as THREE from 'three';

export class Player extends THREE.Object3D {
    constructor(speed = 0.03) {
        super();
        
        this.speed = speed;

        this.add(new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        ));

        // Player spawn position
        this.position.set(0, 0, 4);

    }
}
