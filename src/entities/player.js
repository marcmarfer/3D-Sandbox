import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Player extends THREE.Object3D {
    constructor(speed = 0.03) {
        super();

        this.speed = speed;
        this.mixer = null;
        this.currentAction = null;
        this.currentAnimationName = "Idle";
        this.isJumping = false;

        // Load the 3D model
        const loader = new GLTFLoader();
        loader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
            (gltf) => {
                this.remove(this.tempMesh);

                this.model = gltf.scene;
                
                this.mixer = new THREE.AnimationMixer(this.model);
                this.animations = gltf.animations;
                
                this.animationClips = {};
                this.animations.forEach(anim => {
                    this.animationClips[anim.name] = anim;
                });

                this.setAnimation("Idle");

                this.model.scale.set(0.5, 0.5, 0.5);
                this.model.position.y = -1;
                this.add(this.model);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened loading the model:', error);
            }
        );

        // Physics body (using a cylinder for better collision)
        const radius = 0.4;
        const height = 2;
        const shape = new CANNON.Cylinder(radius, radius, height, 8);
        this.body = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 10, 4),
            shape: shape,
            material: new CANNON.Material({
                friction: 0.3,
                restitution: 0.1 
            }),
            linearDamping: 0.25,
            angularDamping: 0.99,
            fixedRotation: true,
        });

        // Add Cannon.js body to the Three.js object for synchronization
        this.userData.physicsBody = this.body;

        this.position.copy(this.body.position);
        this.quaternion.copy(this.body.quaternion);

        this.body.addEventListener('collide', (event) => {
            const contact = event.contact;
            const normalY = contact.ni.y;

            if (this.isJumping && normalY > 0.5) {
                this.isJumping = false;
                this.setAnimation(this.isMoving ? "Walking" : "Idle");
            }
        });
    }

    // Method to update animations
    updateAnimations(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    // Method to change animation
    setAnimation(animationName) {
        if (!this.mixer || !this.animations) return;

        if (animationName === "Jump") {
            this.isJumping = true;
        } else if (!this.isJumping) {
            this.currentAnimationName = animationName;
        }

        let targetAnim;

        switch(animationName) {
            case "Jump":
                targetAnim = this.animationClips["Jump"];
                break;
            case "Walking":
                targetAnim = this.animationClips["Walking"];
                break;
            case "Idle":
                targetAnim = this.animationClips["Idle"];
                break;
            default:
                targetAnim = this.animationClips[animationName];
        }

        if (targetAnim && (!this.currentAction || this.currentAction._clip !== targetAnim)) {
            if (this.currentAction) {
                const fadeTime = this.isJumping ? 0.3 : 0.5;
                this.currentAction.fadeOut(fadeTime);
            }
            this.currentAction = this.mixer.clipAction(targetAnim);
            
            // Configure the jump animation to play only once
            if (animationName === "Jump") {
                this.currentAction.setLoop(THREE.LoopOnce);
                this.currentAction.clampWhenFinished = true;
            } else {
                this.currentAction.setLoop(THREE.LoopRepeat);
            }
            
            this.currentAction.reset().fadeIn(0.4).play();
        }
    }
}
