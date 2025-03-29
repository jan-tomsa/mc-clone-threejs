import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {TextureLoader} from 'three'; // Import TextureLoader

let camera, scene, renderer;
let geometry, material, mesh;
let controls;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let requestLocation = false;

// Coordinates display element
let coordinatesDisplay;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Create coordinates display element
function createCoordinatesDisplay() {
    coordinatesDisplay = document.createElement('div');
    coordinatesDisplay.id = 'coordinates';
    coordinatesDisplay.style.position = 'absolute';
    coordinatesDisplay.style.top = '10px';
    coordinatesDisplay.style.right = '10px';
    coordinatesDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    coordinatesDisplay.style.color = 'white';
    coordinatesDisplay.style.padding = '10px';
    coordinatesDisplay.style.borderRadius = '5px';
    coordinatesDisplay.style.fontFamily = 'monospace';
    coordinatesDisplay.style.fontSize = '14px';
    coordinatesDisplay.style.zIndex = '100';
    document.body.appendChild(coordinatesDisplay);
}

// Update coordinates display
function updateCoordinatesDisplay() {
    if (coordinatesDisplay && controls.object) {
        const position = controls.object.position;
        coordinatesDisplay.innerHTML = `X: ${position.x.toFixed(2)}<br>Y: ${position.y.toFixed(2)}<br>Z: ${position.z.toFixed(2)}`;
    }
}

init();
createCoordinatesDisplay();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xadd8e6); // Light blue sky
    scene.fog = new THREE.Fog(0xadd8e6, 0, 1750);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75).normalize();
    scene.add(light);

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {

        controls.lock();

    });

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });

    scene.add(controls.object);

    const onKeyDown = function (event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

            case 'KeyF':
                velocity.y += 700;
                break;

            case 'KeyL':
                requestLocation = true;
                break;

        }

    };

    const onKeyUp = function (event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // ground

    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // vertex displacement

    let position = floorGeometry.attributes.position;

    for (let i = 0, l = position.count; i < l; i++) {

        vertex.fromBufferAttribute(position, i);

        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2 - 1;
        vertex.z += Math.random() * 20 - 10;

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);

    }

    floorGeometry = floorGeometry.toNonIndexed(); // required for computing normals for flat surfaces

    position.needsUpdate = true;

    floorGeometry.computeVertexNormals();

    const floorMaterial = new THREE.MeshBasicMaterial({color: 0xbeed94});

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    // Renderer

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding; // Or THREE.LinearEncoding if your textures are already in linear space.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Or other shadow map types
    document.body.appendChild(renderer.domElement);

    // Cubes /////////////////////////////////////////////////////////////////////////////////////////////

    const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

    position = boxGeometry.attributes.position;
    const colors = [];

    for (let i = 0, l = position.count; i < l; i++) {

        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        colors.push(color.r, color.g, color.b);

    }

    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Texture loading and material creation
    const textureLoader = new TextureLoader();
    const texture1 = textureLoader.load('textures/crate.png');  // Replace with your texture path
    texture1.encoding = THREE.sRGBEncoding;
    texture1.magFilter = THREE.NearestFilter; // For zooming in
    texture1.minFilter = THREE.NearestFilter; // For zooming out (important!)
    texture1.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Use the maximum supported by the GPU

    const texture2 = textureLoader.load('textures/brick.png'); // Replace with your texture path
    texture2.encoding = THREE.sRGBEncoding;
    texture2.magFilter = THREE.NearestFilter; // For zooming in
    texture2.minFilter = THREE.NearestFilter; // For zooming out (important!)
    texture2.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Use the maximum supported by the GPU

    const col_palette = {
        0: [0.95, 0.05, 0.05],
        1: [0.05, 0.95, 0.05],
        2: [0.05, 0.05, 0.95],
        3: [0.05, 0.95, 0.95],
        4: [0.95, 0.95, 0.05],
        5: [1.00, 1.00, 1.00],
    }

    for (let i = 0; i < 500; i++) {
        let boxMaterial;

        let col_choice = Math.floor(Math.random() * 8);

        const boxMaterialCol = new THREE.MeshPhongMaterial({specular: 0xffffff, flatShading: true, vertexColors: false});

        if (col_choice > 5) {
            let tex;
            if (col_choice === 6) {
                tex = texture1;
            } else {
                tex = texture2;
            }
            boxMaterial = new THREE.MeshPhongMaterial(
                {
                    map: tex,
                    specular: 0,
                    shininess: 0,
                    flatShading: false, vertexColors: false
                });
        } else {
            let col = col_palette[col_choice]
            boxMaterialCol.color.setRGB(col[0], col[1], col[2]);
            boxMaterial = boxMaterialCol;
        }

        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        box.castShadow = true;

        scene.add(box);

    }

    //

    window.addEventListener('resize', onWindowResize);
    
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    const time = performance.now();

    if (controls.isLocked === true) {

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.object.position.y += (velocity.y * delta); // new behavior

        if (controls.object.position.y < 10) {

            velocity.y = 0;
            controls.object.position.y = 10;

            canJump = true;

        }

        if (requestLocation) {
            console.table(controls.object.position);
            requestLocation = false;
        }

    }

    prevTime = time;

    // Update coordinates display
    updateCoordinatesDisplay();
    
    renderer.render(scene, camera);

}