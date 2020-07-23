import {PerspectiveCamera, Scene, WebGL1Renderer, AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, TextureLoader, DoubleSide} from 'three';
import {OrbitControls} from '../../assets/js/OrbitControls';

import Stats from 'stats.js/src/Stats';
class ThreeFn {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGL1Renderer;
    private stats: Stats;
    private domWrapId = 'canvas-frame';
    private width = window.innerWidth;
    private height = window.innerHeight;
    constructor() {
        this.runPlugin();
    }

    /*********** 辅助函数 ***********/
    private windowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    private insertDom() {
        const el = document.createElement('div');
        const body = document.getElementsByTagName('body')[0];
        el.id = this.domWrapId;
        body.appendChild(el);
    }
    /*********** three组件 ***********/
    private async createBox() {
        // 木箱图片
        const textureLoader = new TextureLoader();
        const boxTexture = await textureLoader.load('./static/img/box.jpeg');
        // 生成方块
        const boxGeometry = new BoxGeometry(2 ,2, 2);
        const meshBasicMaterial = new MeshBasicMaterial({map: boxTexture, side: DoubleSide});
        const mesh = new Mesh(boxGeometry, meshBasicMaterial);
        mesh.position.set(1, 1, 1);
        mesh.name = 'box';
        this.scene.add(mesh);

        // fps显示器
        this.stats = new Stats();
        this.stats.showPanel(0);
        window.document.body.appendChild(this.stats.dom);
        // controls
        new OrbitControls(this.camera, this.renderer.domElement);
        // 渲染
        this.render();

    }
    /*********** 执行函数 ***********/
    // 初始化配置
    private runPlugin() {
        // createDom
        this.insertDom();

        // 场景
        this.scene = new Scene();

        // 相机
        this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(this.scene.position);

        // 渲染器
        this.renderer = new WebGL1Renderer({antialias: true});
        this.renderer.setSize(this.width, this.height);

        // 坐标
        // const axesHelper = new AxesHelper(100);
        // this.scene.add(axesHelper);

        // 生成其它相关threeJs组件
        this.createBox();
    }
    // 渲染到浏览器
    private render() {
        this.stats.begin();
        window.requestAnimationFrame(() => {this.render()});
        const box = this.scene.getObjectByName('box');
        // box.rotation.x += 0.01;
        // box.rotation.y += 0.01;
        // box.rotation.z += 0.01;
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }
    // 执行渲染
    public run() {
        document.getElementById(this.domWrapId).appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => {
            this.windowResize();
        });
    }
}

const threeFn = new ThreeFn();
threeFn.run();
