import { 
    Scene, 
    PerspectiveCamera, 
    WebGLRenderer, 
    Color, 
    Fog 
} from 'three';
import { Controls } from './Controls.js';
import { World } from './World.js';
import { CoordinatesDisplay } from '../utils/CoordinatesDisplay.js';
import { COLORS } from '../config/constants.js';

export class Game {
    constructor() {
        this.prevTime = performance.now();
        
        this.initRenderer();
        this.initScene();
        this.initCamera();
        
        this.controls = new Controls(this.camera, document.body);
        this.world = new World(this.scene, this.renderer);
        this.coordinates = new CoordinatesDisplay();
        
        this.bindEvents();
        this.animate();
    }

    initRenderer() {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    }

    initScene() {
        this.scene = new Scene();
        this.scene.background = new Color(COLORS.SKY);
        this.scene.fog = new Fog(COLORS.SKY, 0, 1750);
    }

    initCamera() {
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.y = 10;
    }

    bindEvents() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Setup pointer lock
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');

        instructions.addEventListener('click', () => {
            this.controls.lock();
        });

        this.controls.addEventListener('lock', () => {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        });

        this.controls.addEventListener('unlock', () => {
            blocker.style.display = 'block';
            instructions.style.display = '';
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = performance.now();
        const delta = (time - this.prevTime) / 1000;

        if (this.controls.isLocked) {
            this.controls.update(delta);
            this.coordinates.update(this.camera.position);
        }

        this.prevTime = time;
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        // Cleanup resources
        this.coordinates.remove();
        this.renderer.dispose();
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}