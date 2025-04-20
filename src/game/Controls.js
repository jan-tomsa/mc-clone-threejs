import { Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { PHYSICS } from '../config/constants.js';

export class Controls {
    constructor(camera, domElement) {
        this.controls = new PointerLockControls(camera, domElement);
        this.velocity = new Vector3();
        this.direction = new Vector3();
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = false;
        this.requestLocation = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                if (this.canJump) {
                    this.velocity.y += PHYSICS.JUMP_FORCE;
                    this.canJump = false;
                }
                break;
            case 'KeyF':
                this.velocity.y += PHYSICS.FLY_FORCE;
                break;
            case 'KeyL':
                this.requestLocation = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }

    update(delta) {
        if (!this.controls.isLocked) return;

        this.updateVelocity(delta);
        this.updatePosition(delta);
        this.checkGroundCollision();
        this.logLocationIfRequested();
    }

    updateVelocity(delta) {
        this.velocity.x -= this.velocity.x * PHYSICS.FRICTION * delta;
        this.velocity.z -= this.velocity.z * PHYSICS.FRICTION * delta;
        this.velocity.y -= PHYSICS.GRAVITY * PHYSICS.MASS * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) {
            this.velocity.z -= this.direction.z * PHYSICS.MOVEMENT_SPEED * delta;
        }
        if (this.moveLeft || this.moveRight) {
            this.velocity.x -= this.direction.x * PHYSICS.MOVEMENT_SPEED * delta;
        }
    }

    updatePosition(delta) {
        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
        this.controls.object.position.y += (this.velocity.y * delta);
    }

    checkGroundCollision() {
        if (this.controls.object.position.y < 10) {
            this.velocity.y = 0;
            this.controls.object.position.y = 10;
            this.canJump = true;
        }
    }

    logLocationIfRequested() {
        if (this.requestLocation) {
            console.table(this.controls.object.position);
            this.requestLocation = false;
        }
    }

    lock() {
        this.controls.lock();
    }

    unlock() {
        this.controls.unlock();
    }

    get isLocked() {
        return this.controls.isLocked;
    }

    addEventListener(event, callback) {
        this.controls.addEventListener(event, callback);
    }
}