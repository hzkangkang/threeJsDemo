import * as THREE from 'three/build/three.module.js';
import 'three/'
import * as dat from 'dat.gui';

const gui = new dat.GUI();

class Three01 {
    constructor() {
        this.renderer = {};
        this.camera = {};
        this.scene = {};
        this.controls = {};
        this.light = {};
        this.cube = {};
        this.width = 0;
        this.height = 0;
        this.plane = {};
        this.sphere = {};
    }

    threeStart() {
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initObject();
        this.initShadow();
        this.initPlugin();
        this.run();
    }

    run() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    initPlugin() {

    }

    initThree() {
        this.createEl();
        this.width = document.getElementById('canvas-frame').clientWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xEEEEEE, 1);
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
    }

    createEl() {
        let el = document.createElement('div');
        let body = document.getElementsByTagName('body')[0];
        el.id = 'canvas-frame';
        body.appendChild(el);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        //将相机位置和视点放在场景中间
        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(this.scene.position);
    }

    initScene() {
        this.scene = new THREE.Scene();
        // 显示坐标
        const axes = new THREE.AxesHelper(100);
        this.scene.add(axes);
    }

    initShadow() {
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        this.cube.castShadow = true;
        this.sphere.castShadow = true;
        this.light.castShadow = true;
        this.plane.receiveShadow = true;
        // this.light.shadowMap.height = 1024;
        // this.light.shadowMap.width = 1024;
    }

    initLight() {

    }

    initObject() {
        // 光源
        this.light = new THREE.SpotLight(0xffffff);
        this.light.position.set(-40, 60, -10);
        this.scene.add(this.light);

        // 水平面
        const planeGeometry = new THREE.PlaneGeometry(60, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.set(15, 0, 0);
        this.scene.add(this.plane);

        //创建一个方块
        var cubeGeometry = new THREE.BoxGeometry(6, 6, 6);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.set(-4, 3, 0);
        this.scene.add(this.cube);

        // 球体
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({color: 'yellow'});
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(20, 4, 2);
        this.scene.add(this.sphere);
    }
}

new Three01().threeStart();
