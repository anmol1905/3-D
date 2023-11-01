import * as THREE from 'three';
// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere
const geometry = new THREE.SphereGeometry(5, 32, 32);

// Load a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('moon-texture-4k.jpg'); // Replace with the actual path to your image

// Apply the texture to the sphere
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create a starfield
const starGeometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < 1000; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);

    positions.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animate Stars Hover and Blink
function animateStars() {
    stars.geometry.attributes.position.array.forEach((position, index) => {
        stars.geometry.attributes.position.array[index] += (Math.random() - 0.5) * 0.1; // Adjust hover intensity
    });

    stars.geometry.attributes.position.needsUpdate = true;

    starMaterial.opacity = Math.random(); // Adjust blink intensity

    requestAnimationFrame(animateStars);
}

let rotationDirection = 1; // 1 for clockwise, -1 for counterclockwise

animateStars();
// Set up rotation animation
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01 * rotationDirection; // Adjust the speed of rotation here
    renderer.render(scene, camera);
}
animate();

document.addEventListener('click', () => {
    rotationDirection *= -1; // Toggle rotation direction
});

// Set camera position
camera.position.z = 15;

//setting up our rotation based on arrow key
function animationBuilder(direction) {
    return function animateRotate() {
        //based on key pressed, rotate +-x or +-y
        switch (direction) {
            case 'up':
                sphere.rotation.x -= 0.1;
                break;
            case 'down':
                sphere.rotation.x += 0.1;
                break;
            case 'left':
                sphere.rotation.y -= 0.1;
                break;
            case 'right':
                sphere.rotation.y += 0.1;
                break;
            default:
                break;
        }
    }
}

//store animation call in directions object
var animateDirection = {
    up: animationBuilder('up'),
    down: animationBuilder('down'),
    left: animationBuilder('left'),
    right: animationBuilder('right')
}

//callback function for key press event listener
function checkKey(e) {

    e = e || window.event;

    e.preventDefault();

    //based on keycode, trigger appropriate animation
    if (e.keyCode == '38') {
        animateDirection.up();
    }
    else if (e.keyCode == '40') {
        animateDirection.down();
    }
    else if (e.keyCode == '37') {
        animateDirection.left();
    }
    else if (e.keyCode == '39') {
        animateDirection.right();
    }
}

//on key down, call checkKey
document.onkeydown = checkKey;


// Store our previous touch move; start value is at center
var lastMove = [window.innerWidth/2, window.innerHeight/2];

// Callback function for touch move event listener
function rotateOnTouchMove(e) {
    e = e || window.event;

    // Calculate difference between current and last touch position
    const moveX = ( e.touches[0].clientX - lastMove[0]);
    const moveY = ( e.touches[0].clientY - lastMove[1]);

    // Rotate the sphere based on distance of touch moves (x and y)
    sphere.rotation.y += ( moveX * .005);
    sphere.rotation.x += ( moveY * .005);

    // Store new position in lastMove
    lastMove[0] = e.touches[0].clientX;
    lastMove[1] = e.touches[0].clientY;
}

//callback function for mouse move event listener
function rotateOnMouseMove(e) {
    e = e || window.event;

    //calculate difference between current and last mouse position
    const moveX = ( e.clientX - lastMove[0]);
    const moveY = ( e.clientY - lastMove[1]);

    //rotate the sphere based on distance of mouse moves (x and y)
    sphere.rotation.y += ( moveX * .005);
    sphere.rotation.x += ( moveY * .005);

    //store new position in lastMove
    lastMove[0] = e.clientX;
    lastMove[1] = e.clientY;
}

//on mousemove, call rotateOnMouseMove
document.addEventListener('mousemove', rotateOnMouseMove);

// On touchmove, call rotateOnTouchMove
document.addEventListener('touchmove', rotateOnTouchMove);




// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});