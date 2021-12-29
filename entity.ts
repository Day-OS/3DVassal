import * as THREE from 'three';
import * as CANNON from "cannon-es"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

class Entity {
    geometryTypes = {GLTF:"gltf", DEFAULTCUBE:"default"};
    materialTypes = {MTL:"obj", DEFAULTMATERIAL:"default"};
    Physic;
    Mesh;
    RotationOffset;
    constructor(scene, world, mass = 1, scale = {x: 1,y: 1,z:1}, geometry = "default", material = "default", rotationOffset = {x: 0,y: 0,z:0}){
        this.RotationOffset = rotationOffset;
        (async()=>{
        var mesh,shape;
        const notLoadedModel = new THREE.BoxGeometry(scale.x,scale.y,scale.z );
        
        //Loading Assets
        
        if (geometry.endsWith(".gltf") || geometry.endsWith(".glb")){
            var gltf = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath( '/examples/js/libs/draco/' )
            gltf.setDRACOLoader(dracoLoader);
            var geometryobj = await gltf.loadAsync(geometry)
            mesh = geometryobj.scene

            if (mesh.constructor.name == "Group"){
                for (let index = 0; index < mesh.children.length; index++) {
                    const element = mesh.children[index];
                    if (element.constructor.name == "Mesh") {
                        mesh = element;
                        break;
                    }
                    
                    
                }
            }
            //console.log(mesh.geometry);
            var buffergeo = BufferGeometryUtils.mergeVertices(mesh.geometry)
            //console.log(geometry)
            mesh.geometry = buffergeo
            
            ////console.log(faces);
            //shape = new CANNON.ConvexPolyhedron({vertices:points,faces:faces, normals:normals}); 
            //console.log(shape);

            //Remove here after physics gets solved VVVVVVV
            shape = threeToCannon(mesh, {type: ShapeType.HULL}).shape
        }
        else{
            geometry = notLoadedModel;
            if (true/**material == this.materialTypes.DEFAULTMATERIAL */){
                material = new THREE.MeshPhongMaterial({
                    color: 0xFFFFFF, 
                    flatShading: true,
                    transparent: true,
                    opacity: 0.9,
                });
            }
            shape = new CANNON.Box(new CANNON.Vec3(scale.x/2,scale.y/2,scale.z/2))
            mesh = new THREE.Mesh(geometry, material)
        }


        var body = new CANNON.Body({mass})
        body.addShape(shape);
        this.Physic = body
        this.Mesh = mesh


        scene.add(this.Mesh);
        world.addBody(this.Physic);
        })()

    }
    update(){
        if (this.Mesh){
            this.Mesh.position.copy(this.Physic.position)
            this.Mesh.quaternion.copy(this.Physic.quaternion)
            this.Mesh.quaternion.multiplyQuaternions(this.Mesh.quaternion, new THREE.Quaternion(0,0,0,0).setFromAxisAngle(new CANNON.Vec3(1 , 0,0),this.RotationOffset.x))
            this.Mesh.quaternion.multiplyQuaternions(this.Mesh.quaternion, new THREE.Quaternion(0,0,0,0).setFromAxisAngle(new CANNON.Vec3(0 , 1,0),this.RotationOffset.y))
            this.Mesh.quaternion.multiplyQuaternions(this.Mesh.quaternion, new THREE.Quaternion(0,0,0,0).setFromAxisAngle(new CANNON.Vec3(0 , 0,1),this.RotationOffset.z))
            //this.Mesh.quaternion.setFromAxisAngle(new CANNON.Vec3(0 , 1,0),1.5)
        }
    }
    changePosition(Vec3){
        var interval = setInterval(()=>{
            if (this.Mesh && this.Physic){
                this.Physic.position.copy(Vec3);
                clearInterval(interval)
            }
        },100)

    }   
};

export default Entity;
