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

// Set up rotation animation
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01; // Adjust the speed of rotation here
    renderer.render(scene, camera);
}
animate();

// Set camera position
camera.position.z = 15;

// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});