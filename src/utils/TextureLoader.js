import { TextureLoader, NearestFilter } from 'three';
import { ColorManagement } from 'three';

ColorManagement.enabled = true;

export class TextureManager {
    constructor(renderer) {
        this.loader = new TextureLoader();
        this.renderer = renderer;
    }

    loadTexture(path) {
        const texture = this.loader.load(path);
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        return texture;
    }
}