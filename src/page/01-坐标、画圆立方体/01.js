import './01.css';
import * as THREE from 'three';

class Three01 {
    constructor() {
        this.renderer = {};
        this.camera = {};
        this.scene = {};
        this.light = {};
        this.cube = {};
        this.width = 0;
        this.height = 0;
    }

    threeStart() {
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initObject();
        this.run();
    }

    run() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    initThree() {
        this.createEl();
        this.width = document.getElementById('canvas-frame').clientWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer();
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
    }

    initScene() {
        this.scene = new THREE.Scene();
        // 显示坐标
        const axes = new THREE.AxesHelper(100);
        this.scene.add(axes);
    }

    initLight() {

    }

    initObject() {
        //将水平面添加到场景中
        const planeGeometry = new THREE.PlaneGeometry(60, 60);
        const planeMaterial = new THREE.MeshBasicMaterial({color: '#ddd'});
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.set(-0.5 * Math.PI, 0, 30);
        plane.position.set(15, 0, 0);
        this.scene.add(plane);

        //将方块添加到场景中
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        this.scene.add(cube);

        //将球体添加到场景中
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 5, 2);
        this.scene.add(sphere);

        //将相机位置和视点放在场景中间
        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(this.scene.position);
    }
}

new Three01().threeStart();
