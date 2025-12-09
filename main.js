// -----------------------
// Scene + Camera + Renderer
// -----------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0e0ff);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -----------------------
// Lighting
// -----------------------
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// -----------------------
// Ground
// -----------------------
const groundGeo = new THREE.PlaneGeometry(500, 500);
const groundMat = new THREE.MeshPhongMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// -----------------------
// Car (simple box)
// -----------------------
const carGeo = new THREE.BoxGeometry(2, 1, 4);
const carMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeo, carMat);
car.position.y = 0.5;
scene.add(car);

// -----------------------
// Control Variables
// -----------------------
let speed = 0;
let maxSpeed = 0.3;
let accel = 0.01;
let friction = 0.005;
let turnSpeed = 0.03;

let keys = {};

// Key input
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

// -----------------------
// Animation Loop
// -----------------------
function animate() {
    requestAnimationFrame(animate);

    // Acceleration
    if (keys["w"] || keys["ArrowUp"]) speed += accel;
    if (keys["s"] || keys["ArrowDown"]) speed -= accel;

    // Clamp speed
    speed = Math.max(-maxSpeed, Math.min(maxSpeed, speed));

    // Turning
    if (keys["a"] || keys["ArrowLeft"]) car.rotation.y += turnSpeed;
    if (keys["d"] || keys["ArrowRight"]) car.rotation.y -= turnSpeed;

    // Apply friction
    if (!keys["w"] && !keys["s"] && !keys["ArrowUp"] && !keys["ArrowDown"]) {
        if (speed > 0) speed -= friction;
        if (speed < 0) speed += friction;
        if (Math.abs(speed) < 0.001) speed = 0;
    }

    // Move car forward
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;

    // Camera follow
    const camOffset = new THREE.Vector3(0, 5, 10).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        car.rotation.y
    );
    camera.position.copy(car.position.clone().add(camOffset));
    camera.lookAt(car.position);

    renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
