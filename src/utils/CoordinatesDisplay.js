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

    update(position, direction) {
        if (!this.element) return;
        
        const directionNames = {
            north: 'Z-',
            south: 'Z+',
            east: 'X+',
            west: 'X-'
        };

        // Calculate direction based on player's rotation
        let facing = 'north';
        if (direction) {
            facing = computeFacing(direction);
        }
        
        this.element.innerHTML = `
            X: ${position.x.toFixed(2)}<br>
            Y: ${position.y.toFixed(2)}<br>
            Z: ${position.z.toFixed(2)}<br>
            Facing: ${facing.toUpperCase()} (${directionNames[facing]})
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

// Change from a regular function to an exported function
export function computeFacing(direction) {
    // Convert rotation to degrees and normalize to 0-360
    const degrees = (direction * (180 / Math.PI)) % 360;

    // Determine the cardinal direction based on the angle
    if (degrees >= 315 || degrees < 45) {
        return 'north';
    } else if (degrees >= 45 && degrees < 135) {
        return 'east';
    } else if (degrees >= 135 && degrees < 225) {
        return 'south';
    } else {
        return 'west';
    }
}
