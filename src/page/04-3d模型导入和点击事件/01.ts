import {
    AnimationMixer,
    AxesHelper,
    Clock,
    Color,
    DirectionalLight,
    Fog,
    HemisphereLight,
    Mesh,
    MeshPhongMaterial,
    PCFSoftShadowMap,
    AnimationAction,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Raycaster,
    Scene,
    Object3D,
    SkeletonHelper,
    Vector2,
    WebGL1Renderer
} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from '../../assets/js/OrbitControls';
import Stats from 'stats.js/src/Stats';
import * as dat from 'dat.gui/build/dat.gui';

class ThreeFn {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGL1Renderer;
    private stats: Stats;
    private clock: Clock;
    private walkAction: AnimationAction;
    private gLTFLoader: GLTFLoader;
    private animationMixer: AnimationMixer;
    private domWrapId = 'canvas-frame';
    private width = window.innerWidth;
    private height = window.innerHeight;
    private guiControls = new function () {
        this.rotationSpeed = 0.02;
    };

    constructor() {
        this.runPlugin();
    }

    /*********** three组件 ***********/
    private async createBox() {
        // 环境
        const groundMesh = new Mesh(
            new PlaneBufferGeometry(40, 40),
            new MeshPhongMaterial({
                color: 0x999999,
                depthWrite: true
            })
        );
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);
        groundMesh.name = 'ground';
        // 光源
        const light = new HemisphereLight(0xffffff, 0x444444);
        const light2 = new DirectionalLight(0xffffff);
        light.position.set(0, 20, 0);
        light2.position.set(-3, 10, -10);
        light2.castShadow = true;
        light2.shadow.camera.top = 10;
        light2.shadow.camera.bottom = -10;
        light2.shadow.camera.left = -10;
        light2.shadow.camera.right = 10;
        light2.shadow.camera.near = 0.1;
        light2.shadow.camera.far = 40;
        this.scene.add(light);
        this.scene.add(light2);
        // 载入模型
        this.gLTFLoader.load('./static/file/Soldier.glb', (gltf) => {
            this.soldierControl(gltf);
        }, xhr => {
            // 后台打印查看模型文件加载进度
            console.log('加载完成的百分比' + (xhr.loaded / xhr.total * 100) + '%');
        });

        // 初始化的仅一次渲染
        this.onceRender();
    }

    /**
     * 3d模型载入后的控制
     * @param gltf 3d模型
     */
    private soldierControl(gltf) {
        gltf.scene.name = 'Soldier';
        this.scene.add(gltf.scene);
        const animationClip = gltf.animations.find(animationClip => animationClip.name === 'Run');
        this.walkAction = this.animationMixer.clipAction(animationClip);
        // this.walkAction.play();
        // Enable Shadows
        gltf.scene.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });

        // 骨骼
        // this.scene.add(new SkeletonHelper(gltf.scene));

        // 事件处理
        this.soldierClick();
        this.soldierKeyCodeEvent();
    }


    /*********** dom处理函数 ***********/
    private windowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private insertDom() {
        const el = document.createElement('div');
        const body = document.getElementsByTagName('body')[0];
        el.id = this.domWrapId;
        body.appendChild(el);
    }

    /**
     * 模型点击事件
     */
    private soldierClick() {
        this.renderer.domElement.addEventListener('click', (e) => {
            // 取得鼠标位置
            const {offsetX, offsetY} = e;
            // 取得对应鼠标位置的threeJs标准坐标
            const x = (offsetX / window.innerWidth) * 2 - 1;
            const y = -(offsetY / window.innerHeight) * 2 + 1;
            const point = new Vector2(x, y);
            // 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
            const raycaster = new Raycaster();
            // 设置鼠标位置和参考相机
            raycaster.setFromCamera(point, this.camera);
            // 计算物体和射线的焦点, 鼠标点击对应的物体（所有鼠标映射到的物体，包括被遮挡的）
            const intersects: any = raycaster.intersectObjects(this.scene.children, true);
            // 过滤环境
            const intersect = intersects.filter(v => v.object.name !== 'ground')[0];
            //
            if (intersect && this.isClickSoldier(intersect.object)) {
                this.walkAction.paused = !this.walkAction.paused;
            }
        });
    }

    soldierKeyCodeEvent() {
        this.renderer.domElement.addEventListener('keydown',e => {
            const { keyCode } = e;
            if (keyCode === 87) {
                if (this.walkAction.time === 0) this.walkAction.play();
                this.walkAction.paused = false;
            }
        });
        this.renderer.domElement.addEventListener('keyup',e => {
            const { keyCode } = e;
            if (keyCode === 87) {
                this.walkAction.paused = true;
            }
        });

    }

    /**
     * 递归导出是否点击的对象是Soldier
     * @param object
     */
    private isClickSoldier(object: Object3D):Object3D {
        if (object.name === 'Soldier') {
            return object;
        } else if (object.parent) {
            return this.isClickSoldier(object.parent);
        } else {
            return null;
        }
    }

    /*********** 执行函数 ***********/
    // 初始化配置
    private runPlugin() {
        // createDom
        this.insertDom();

        // 场景
        this.scene = new Scene();
        this.scene.background = new Color(0xa0a0a0);
        this.scene.fog = new Fog(0xa0a0a0, 10, 22);

        // 相机
        this.camera = new PerspectiveCamera(45, this.width / this.height, 0.1, 5000);
        this.camera.position.set(3, 6, -10);
        this.camera.lookAt(0, 1, 0);

        // 渲染器
        this.renderer = new WebGL1Renderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        // 跟踪时间
        this.clock = new Clock();

        // 动画混合器（播放器）
        this.animationMixer = new AnimationMixer(this.scene);

        // 3d loader
        this.gLTFLoader = new GLTFLoader();

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
        // 更新动画
        this.animationMixer.update(this.clock.getDelta());
        //
        this.renderer.render(this.scene, this.camera);
        // 重复触发
        window.requestAnimationFrame(() => {
            this.render();
        });
        this.stats.update();
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
