// Simple three.js example

import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejs.org/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejs.org/examples/jsm/loaders/MTLLoader.js";

var mesh, renderer, scene, camera, controls;

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
    var geometry = new THREE.SphereGeometry( 5, 12, 8 );
    
    // material
    var material = new THREE.MeshPhongMaterial( {
        color: 0x00ffff, 
        flatShading: true,
        transparent: true,
        opacity: 0.7,
    } );
    
    // mesh
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );


    
    const mtl = new MTLLoader();
    mtl.setPath("../models/")
    mtl.load("mouse.mtl", (mtl) =>{
        console.log(mtl);
        mtl.preload()
        //V -- dando ruim
        const objloader = new OBJLoader();
        objloader.setMaterials(mtl)
        objloader.setPath("../models/")
        objloader.load("mouse.obj", (obj)=> {
            scene.add(obj)
        });
    });
    

    //objloader.setPath("")
    
}

    function animate() {
        controls.update()
        requestAnimationFrame( animate );
        
        //controls.update();

        renderer.render( scene, camera );

    }