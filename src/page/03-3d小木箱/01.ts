import {PerspectiveCamera, Scene, WebGL1Renderer, AxesHelper, } from 'three';


class ThreeFn {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGL1Renderer;
    private domWrapId = 'canvas-frame';
    private width = window.innerWidth;
    private height = window.innerHeight;

    constructor() {
        this.runPlugin();
    }

    runPlugin() {
        // createDom
        this.createDom();

        // 场景
        this.scene = new Scene();

        // 相机
        this.camera = new PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(this.scene.position);

        // 渲染器
        this.renderer = new WebGL1Renderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor('#ccc', 1);

        // 坐标
        const axesHelper = new AxesHelper(100);
        this.scene.add(axesHelper);
    }

    createDom() {
        const el = document.createElement('div');
        const body = document.getElementsByTagName('body')[0];
        el.id = this.domWrapId;
        body.appendChild(el);
    }


    render() {
        this.renderer.render(this.scene, this.camera);
        document.getElementById(this.domWrapId).appendChild(this.renderer.domElement);
    }

    run() {
        this.render();
    }
}

const threeFn = new ThreeFn();
threeFn.run();
