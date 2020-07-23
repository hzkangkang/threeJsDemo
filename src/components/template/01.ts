import {PerspectiveCamera, Scene, WebGL1Renderer, AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial} from 'three';

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
    private createBox() {
        // 生成方块
        const boxGeometry = new BoxGeometry(2 ,2, 2);
        const meshBasicMaterial = new MeshBasicMaterial({color: 'green'});
        const mesh = new Mesh(boxGeometry, meshBasicMaterial);
        mesh.position.set(0, 5, 5);
        this.scene.add(mesh);
    }
    /*********** 执行函数 ***********/
    // 初始化配置
    private runPlugin() {
        // createDom
        this.insertDom();

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

        // 生成其它相关threeJs组件
        this.createBox();
    }
    // 渲染到浏览器
    private render() {
        this.renderer.render(this.scene, this.camera);
        document.getElementById(this.domWrapId).appendChild(this.renderer.domElement);
    }
    // 执行渲染
    public run() {
        this.render();
        window.addEventListener('resize', () => {
            this.windowResize();
        });
    }
}

const threeFn = new ThreeFn();
threeFn.run();
