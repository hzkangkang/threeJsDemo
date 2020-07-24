import {
    AxesHelper,
    BoxGeometry,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGL1Renderer
} from 'three';
import {OrbitControls} from '../../assets/js/OrbitControls';
import Stats from 'stats.js/src/Stats';
import * as dat from 'dat.gui/build/dat.gui';


class ThreeFn {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGL1Renderer;
    private stats: Stats;
    private domWrapId = 'canvas-frame';
    private width = window.innerWidth;
    private height = window.innerHeight;
    private guiControls = new function() {
        this.rotationSpeed = 0.02;
    };

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
        const boxGeometry = new BoxGeometry(2, 2, 2);
        const textureLoader = new TextureLoader();
        const boxTexture = await textureLoader.load('./static/img/box.jpeg');
        // 生成方块
        const meshBasicMaterial = new MeshBasicMaterial({map: boxTexture, side: DoubleSide});
        const mesh = new Mesh(boxGeometry, meshBasicMaterial);
        mesh.position.set(1, 1, 1);
        // 给这个几何体起名字，方便在 this.render()里控制动画旋转
        mesh.name = 'box';
        this.scene.add(mesh);
        // 生成环境，贴图顺序左右上下前后
        const skyGeometry = new BoxGeometry(200, 200, 200);
        const shyBasicMaterial = [];
        const skyLeft = await textureLoader.load('./static/img/posx.jpg');
        const skyRight = await textureLoader.load('./static/img/negx.jpg');
        const skyTop = await textureLoader.load('./static/img/posy.jpg');
        const skyBottom = await textureLoader.load('./static/img/negy.jpg');
        const skyFront = await textureLoader.load('./static/img/posz.jpg');
        const skyBack = await textureLoader.load('./static/img/negz.jpg');
        shyBasicMaterial.push(
            new MeshBasicMaterial({map: skyLeft, side: DoubleSide}),
            new MeshBasicMaterial({map: skyRight, side: DoubleSide}),
            new MeshBasicMaterial({map: skyTop, side: DoubleSide}),
            new MeshBasicMaterial({map: skyBottom, side: DoubleSide}),
            new MeshBasicMaterial({map: skyFront, side: DoubleSide}),
            new MeshBasicMaterial({map: skyBack, side: DoubleSide}),
        );
        const skyMesh = new Mesh(skyGeometry, shyBasicMaterial);
        this.scene.add(skyMesh);


        // 初始化的仅一次渲染
        this.onceRender();
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
        this.renderer.setClearColor(0xEEEEEE, 1);

        // 坐标
        const axesHelper = new AxesHelper(100);
        this.scene.add(axesHelper);

        // 生成其它相关threeJs组件
        this.createBox();
    }
    // 初始化的仅一次渲染
    private onceRender() {
        // fps显示器
        this.stats = new Stats();
        this.stats.showPanel(0);
        window.document.body.appendChild(this.stats.dom);
        // dat.gui
        const gui = new dat.GUI();
        gui.add(this.guiControls, 'rotationSpeed', 0, 0.5);

        // controls
        new OrbitControls(this.camera, this.renderer.domElement);
        this.render();
    }
    // 渲染到浏览器
    private render() {
        this.stats.begin();
        window.requestAnimationFrame(() => {
            this.render()
        });
        const box = this.scene.getObjectByName('box');
        box.rotation.x += this.guiControls.rotationSpeed;
        box.rotation.y += this.guiControls.rotationSpeed;
        box.rotation.z += this.guiControls.rotationSpeed;
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
