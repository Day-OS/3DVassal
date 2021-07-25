import * as THREE from 'three';
import * as CANNON from "cannon-es"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

class Entity {
    geometryTypes = {OBJ:"obj", DEFAULTCUBE:"default"};
    materialTypes = {MTL:"obj", DEFAULTMATERIAL:"default"};
    constructor(scene, world, mass = 1, scale = {x: 1,y: 1,z:1}, geometry = "default", material = "default"){
        var body = new CANNON.Body({mass})
        body.addShape(new CANNON.Box(new CANNON.Vec3(scale.x/2,scale.y/2,scale.z/2)));
        world.addBody(body)
        
        this.Physic = body
        if (geometry == this.geometryTypes.DEFAULTCUBE){
            geometry = new THREE.BoxGeometry(scale.x,scale.y,scale.z );
        }
        if (material == this.materialTypes.DEFAULTMATERIAL){
            material = new THREE.MeshPhongMaterial( {
                color: 0xFFFFFF, 
                flatShading: true,
                transparent: true,
                opacity: 0.9,
            } );
        }
        else{

        }
        
        this.Mesh = new THREE.Mesh( geometry, material);
        scene.add(this.Mesh);
        world.addBody(this.Physic);

    }
    update(){
        this.Mesh.position.copy(this.Physic.position)
        this.Mesh.quaternion.copy(this.Physic.quaternion)
    }
};
export default Entity;