import * as THREE from 'three';
import * as CANNON from "cannon-es"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import CameraControls from 'camera-controls';
import  cannonDebugger from 'cannon-es-debugger';
import Entity from './entity.ts'


CameraControls.install({THREE: THREE})
const clock = new THREE.Clock();
var mesh, renderer, scene, camera, controls;
var cursor, floor, dado, dado2;

const timeStep = 1 / 60 // seconds
let lastCallTime 
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.82,0),
    broadphase: new CANNON.NaiveBroadphase(),
    iterations: 10,
});
world.solver.iterations = 10;

var body = new CANNON.Body({mass:0})
body.addShape(new CANNON.Box(new CANNON.Vec3(1,0.05,1)));
world.addBody(body)
body.position.y = 10




init();
animate();

async function init() {
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();
    cannonDebugger(scene, world.bodies)
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 20, 20, 20 );

    // controls
    controls = new CameraControls( camera, renderer.domElement );
    controls.mouseButtons.left = CameraControls.ACTION.NONE
    controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
    // ambient
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    
    // light
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 20,20, 0 );
    scene.add( light );
    
    // axes
    scene.add( new THREE.AxesHelper( 20 ) );
    scene.add( new THREE.GridHelper( 20 ) );
    dado = new Entity(scene, world,1, {x:1,y:1,z:1},"../models/d20.gltf", "gltf")
    dado2 = new Entity(scene, world,1, {x:1,y:1,z:1},"../models/d20.gltf", )

    dado.changePosition(new CANNON.Vec3(0,10,3));
    
    dado2.changePosition(new CANNON.Vec3(0,4,2));
    floor = new Entity(scene, world,0, {x:20,y:1,z:20})
    /**.then(()=>{
        console.log(floor);
        floor.Physic.position.y = -0.5
        floor.Mesh.Color = new THREE.Color(0x0000FF )
    }) */
    
    

    const mtl = new MTLLoader();
    mtl.load("../models/mouse.mtl", (mtl) =>{
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
    const delta = clock.getDelta();
    const hasControlsUpdated = controls.update( delta );

    requestAnimationFrame( animate );
    if(cursor){

        //Y = RODAR KKKKK
        //onsole.log(body.quaternion);
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(0 , 1,0),camera.rotation.x >= -1 ? - camera.rotation.z : camera.rotation.z)
        //console.log("camera: " + camera.quaternion.z + "\n" + camera.rotation.x);
        //body.quaternion.copy(new CANNON.Quaternion(0 , -camera.quaternion.y*2,0, (camera.quaternion.y/3) - 1))//.setFromVectors(new CANNON.Vec3(camera.rotation.x, 0, camera.rotation.z), new CANNON.Vec3(camera.rotation.x, 0, camera.rotation.z) );
        cursor.position.copy(body.position)
        cursor.quaternion.copy(body.quaternion)
    }
    dado2.update()
    dado.update()
    floor.update()
    
    const time = performance.now() / 1000 // seconds
    if (!lastCallTime) {
        world.step(timeStep)
    } else {
        const dt = time - lastCallTime
        world.step(timeStep, dt)
    }
    lastCallTime = time


    renderer.render( scene, camera );
    //if ( hasControlsUpdated ) {}

}