import * as THREE from 'three';
import { Block } from '../objects/Block.js';
import { TextureManager } from '../utils/TextureLoader.js';
import { COLORS } from '../config/constants.js';

export class World {
    constructor(scene, renderer) {
        this.scene = scene;
        this.textureManager = new TextureManager(renderer);
        this.blocks = [];
        
        this.initLighting();
        this.createGround();
        this.generateBlocks();
    }

    initLighting() {
        const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75).normalize();
        this.scene.add(light);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        groundGeometry.rotateX(-Math.PI / 2);

        const groundTexture = this.textureManager.loadTexture('textures/grass.png');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(COLORS.GROUND.REPEAT, COLORS.GROUND.REPEAT);

        const groundMaterial = new THREE.MeshPhongMaterial({
            map: groundTexture,
            shininess: COLORS.GROUND.SHININESS
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.scene.add(ground);
    }

    generateBlocks() {
        const block = new Block(this.textureManager);
        
        for (let i = 0; i < 500; i++) {
            const position = new THREE.Vector3(
                Math.floor(Math.random() * 20 - 10) * 20,
                Math.floor(Math.random() * 20) * 20 + 10,
                Math.floor(Math.random() * 20 - 10) * 20
            );

            const colorIndex = Math.floor(Math.random() * 8);
            let blockMesh;

            if (colorIndex > 5) {
                // Textured blocks
                const textureName = colorIndex === 6 ? 'crate' : 'brick';
                blockMesh = block.createBlock(textureName, position);
            } else {
                // Colored blocks
                const color = COLORS.PALETTE[colorIndex];
                blockMesh = block.createBlock('color', position, color);
            }

            this.blocks.push(blockMesh);
            this.scene.add(blockMesh);
        }
    }

    update(delta) {
        // Future implementation: block updates, animations, etc.
    }

    removeBlock(block) {
        this.scene.remove(block);
        this.blocks = this.blocks.filter(b => b !== block);
    }

    addBlock(position, type) {
        const block = new Block(this.textureManager);
        const blockMesh = block.createBlock(type, position);
        this.blocks.push(blockMesh);
        this.scene.add(blockMesh);
        return blockMesh;
    }
}