import { BoxGeometry, MeshPhongMaterial, Mesh, Color } from 'three';

export class Block {
    constructor(textureManager, size = 20) {
        this.geometry = new BoxGeometry(size, size, size).toNonIndexed();
        this.textures = {
            crate: textureManager.loadTexture('textures/crate.png'),
            brick: textureManager.loadTexture('textures/brick.png')
        };
    }

    createBlock(type, position, color) {
        const material = this.createMaterial(type, color);
        const block = new Mesh(this.geometry, material);
        block.position.copy(position);
        block.castShadow = true;
        block.receiveShadow = true;
        return block;
    }

    createMaterial(type, color) {
        if (type === 'color') {
            return new MeshPhongMaterial({
                specular: 0xffffff,
                flatShading: true,
                color: new Color(color[0], color[1], color[2]),
                shininess: 30
            });
        }

        return new MeshPhongMaterial({
            specular: 0xffffff,
            flatShading: true,
            map: this.textures[type],
            shininess: 30
        });
    }

    dispose() {
        this.geometry.dispose();
        Object.values(this.textures).forEach(texture => texture.dispose());
    }
}