export class CoordinatesDisplay {
    constructor() {
        this.element = this.createDisplay();
    }

    createDisplay() {
        const display = document.createElement('div');
        display.id = 'coordinates';
        display.style.position = 'absolute';
        display.style.top = '10px';
        display.style.right = '10px';
        display.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        display.style.color = 'white';
        display.style.padding = '10px';
        display.style.borderRadius = '5px';
        display.style.fontFamily = 'monospace';
        display.style.fontSize = '14px';
        display.style.zIndex = '100';
        document.body.appendChild(display);
        return display;
    }

    update(position) {
        if (!this.element) return;
        
        this.element.innerHTML = `
            X: ${position.x.toFixed(2)}<br>
            Y: ${position.y.toFixed(2)}<br>
            Z: ${position.z.toFixed(2)}
        `;
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
}