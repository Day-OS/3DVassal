// Simple three.js example
import * as CANNON from "https://pmndrs.github.io/cannon-es/dist/cannon-es.js"
import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejs.org/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejs.org/examples/jsm/loaders/MTLLoader.js";

var mesh, renderer, scene, camera, controls;
var cursor, floor;

const timeStep = 1 / 60 // seconds
let lastCallTime 
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.82,0),
    //broadphase: new CANNON.NaiveBroadphase(),
    iterations: 10,
});
world.solver.iterations = 10;


var body = new CANNON.Body({mass:1})
body.addShape(new CANNON.Box(new CANNON.Vec3(1,0.05,1)));
world.addBody(body)

floor = new CANNON.Body({mass:0})
floor.addShape(new CANNON.Box(new CANNON.Vec3(10,0.2,10)));
world.addBody(floor)

init();
animate();

function init() {
    
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 20, 20, 20 );

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional
    controls.enableDamping = true;
    controls.dampingFactor = 1.2;

    controls.keys = {
        LEFT: 'KeyA', //left arrow
        UP: 'KeyW', // up arrow
        RIGHT: 'KeyD', // right arrow
        BOTTOM: 'KeyS' // down arrow
    }
    controls.keyPanSpeed = 20;

    
    // ambient
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    
    // light
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 20,20, 0 );
    scene.add( light );
    
    // axes
    scene.add( new THREE.AxesHelper( 20 ) );
    scene.add( new THREE.GridHelper( 20 ) );

    // geometry
    var geometry = new THREE.BoxGeometry( 10, 0.2, 10 );
    
    // material
    var material = new THREE.MeshPhongMaterial( {
        color: 0x00ffff, 
        flatShading: true,
        transparent: true,
        opacity: 0.9,
    } );
    
    // mesh
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    floor.position.y = -1

    
    
    const mtl = new MTLLoader();
    mtl.setPath("../models/")
    mtl.load("mouse.mtl", (mtl) =>{
        mtl.preload()
        const objloader = new OBJLoader();
        objloader.setMaterials(mtl)
        objloader.setPath("../models/")
        objloader.load("mouse.obj", (obj)=> {
            scene.add(obj)
            cursor = obj
        });
    });
    

    //objloader.setPath("")
    
}
function animate() {
    controls.update()
    requestAnimationFrame( animate );
    cursor.position.copy(body.position)
    cursor.quaternion.copy(body.quaternion)
    mesh.position.copy(floor.position)
    mesh.quaternion.copy(floor.quaternion)
    
    const time = performance.now() / 1000 // seconds
    if (!lastCallTime) {
        world.step(timeStep)
    } else {
        const dt = time - lastCallTime
        world.step(timeStep, dt)
    }
    lastCallTime = time

    renderer.render( scene, camera );

}