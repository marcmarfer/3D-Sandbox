import * as THREE from 'three';
import * as Cannon from 'cannon';

export class Player extends THREE.Object3D {
    constructor(speed = 0.03) {
        super();

        this.speed = speed;

        const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
        const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
        this.add(this.playerMesh);

        const shape = new Cannon.Box(new Cannon.Vec3(0.5, 1, 0.5));
        this.body = new Cannon.Body({
            mass: 5,
            position: new Cannon.Vec3(0, 10, 4),
            shape: shape,
        });

        // Add Cannon.js body to the Three.js object for synchronization
        this.userData.physicsBody = this.body;

        this.position.copy(this.body.position);
        this.quaternion.copy(this.body.quaternion);
    }
}