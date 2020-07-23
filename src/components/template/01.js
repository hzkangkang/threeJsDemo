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
        this.initScene();
        this.initLight();
        this.initCamera();
        this.initObject();
        this.run();
    }

    run() {
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    initThree() {
        this.createEl();
        this.width = document.getElementById('canvas-frame').clientWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor('#EEEEEE', 1);
        // 显示坐标
    }

    createEl() {
        let el = document.createElement('div');
        let body = document.getElementsByTagName('body')[0];
        el.id = 'canvas-frame';
        body.appendChild(el);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 0.1, 1000);
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

    initLight() {

    }

    initObject() {

    }
}

new Three01().threeStart();
