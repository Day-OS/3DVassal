import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene3D, PhysicsLoader, Project, ExtendedObject3D } from 'enable3d';
import * as THREE from 'three'

export class ThreePhysicsComponent extends Scene3D {

  constructor() {
    super()
  }

  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  async preload() {

  }

  async create() {
    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed()

    // position camera
    this.camera.position.set(13, 10, 23)
    //this.physics.debug.enable()

    new GLTFLoader().loadAsync('models/d20.glb').then(gltf => {

      const d20: any = gltf.scene.children[0]
      d20.position.y = 20
      const object = new ExtendedObject3D();
      object.add(d20)
      object.position.z = 6
      this.add.existing(object,)
      //this.physics.add.existing(object, { shape: 'box', width: 2, height: 2, depth: 2 })

      // d20.position.z = 6
      // this.scene.add(d20 as any)
       this.physics.add.existing(d20, { shape: 'convex', depth:2, collisionFlags:0})
    })
    new GLTFLoader().loadAsync('models/mouse.gltf').then(gltf => {

        const cursor: any = gltf.scene.children[0]
        cursor.position.y = 3
        const object = new ExtendedObject3D()
        object.add(cursor)
        object.position.z = -6
        this.add.existing(object)
        console.log(object);
        
        //this.physics.add.existing(object, { shape: 'box', width: 2, height: 2, depth: 2 })
  
        // cursor.position.z = 6
        // this.scene.add(cursor as any)
         this.physics.add.existing(cursor, { shape: 'convex', })
      })
  }

  update() {

  }

}

// set your project configs
const config = { scenes: [ThreePhysicsComponent], antialias: true, gravity: { x: 0, y: -9.81, z: 0 } }
PhysicsLoader('/ammo', () => new Project(config))
