///<reference path="../../typings/tsd.d.ts" />
///<reference path="Earth.ts" />
///<reference path="Point.ts" />
///<reference path="Line.ts" />

window.addEventListener("load", ()=> {
  new demo.Main();
});

module demo {

  /**
   * Three,jsを用いた三角関数モーションのクラスです。
   * @author Takayoshi Sawada
   */
  export class Main {

    /** シーンオブジェクト */
    public scene:THREE.Scene;
    /** カメラオブジェクト */
    public camera:THREE.PerspectiveCamera;
    /** レンダラーオブジェクト */
    public renderer:THREE.WebGLRenderer;
    /** コントローラー **/
    public controller:THREE.TrackballControls;
    /** HTML要素 */
    public containerElement:HTMLElement;

    /** 地球 **/
    public earth:demo.Earth;

    /** 日本 **/
    public japan:demo.Point;

    /** 主要都市一覧 **/
    public cities:Point[] = [];
    public citiesLine:Line[] = [];

    /** 主要都市緯度経度一覧 **/
    public citiesPoints:number[][] = [
      [51.2838, 0],   // イギリス
      [39, -116],      // 北京
      [34, 118],     // ロサンゼルス
      [-33, 151],    // シドニー
      [-23, -46],      // サンパウロ
      [1, 103],       // シンガポール
      [90, 0],       // 北極
      [-90, 0],       // 南極
    ];

    /** 人工衛星 **/
    public satellite:demo.Point;


    constructor() {
      this.setup();
    }


    /**
     * セットアップ
     */
    private setup():void {
      this.containerElement = document.createElement('div');
      document.body.appendChild(this.containerElement);

      // シーン
      this.scene = new THREE.Scene();

      // カメラ
      this.camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 1, 2000
      );
      this.camera.position.set(-250, 0, -250);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      // レンダラー
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.shadowMap.enabled = true;
      this.containerElement.appendChild(this.renderer.domElement);

      // カメラコントローラー
      this.controller = new THREE.TrackballControls(this.camera, this.renderer.domElement);
      this.controller.noPan = true;
      this.controller.minDistance = 200;
      this.controller.maxDistance = 1000;

      // 環境光
      let ambientLight:THREE.AmbientLight = new THREE.AmbientLight(0x111111);
      this.scene.add(ambientLight);

      // スポットライト
      let spotLight:THREE.SpotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-10000, 0, 0);
      spotLight.castShadow = true;//影
      this.scene.add(spotLight);

      // 地球
      this.earth = new Earth();
      this.scene.add(this.earth);

      // 背景
      let geometry2:THREE.SphereGeometry = new THREE.SphereGeometry(1000, 60, 40);
      geometry2.scale(-1, 1, 1);
      let material2:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("img/star.jpg")
      });
      let background:THREE.Mesh = new THREE.Mesh(geometry2, material2);
      this.scene.add(background);

      // 日本
      this.japan = new Point(0xFFFF00);
      this.japan.setLatitude(35.658651);
      this.japan.setLongitude(139.742689);
      this.scene.add(this.japan);

      // 主要都市をプロットして線を引く
      this.citiesPoints.forEach(point => {
        // 都市
        let place:Point = new Point(0xFF00FF);
        place.setLatitude(point[0]);
        place.setLongitude(point[1]);
        this.cities.push(place);
        this.scene.add(place);

        // 線を引く
        let line:Line = new Line(this.japan, place);
        this.citiesLine.push(line);
        this.scene.add(line);
      });

      // 赤道上衛星3
      this.satellite = new Point(0xFF0000);
      this.scene.add(this.satellite);

      // フレーム毎のレンダーを登録
      this.render();
    }


    /**
     * フレーム毎にさせる処理
     */
    render() {
      requestAnimationFrame(_.bind(this.render, this));

      // 公転させる
      this.satellite.setLongitude(this.satellite.getLongitude() + 1);

      // 地球を更新
      this.earth.update();

      // 日本を更新
      this.japan.update();

      // 主要都市を更新
      for (let index = 0; index < this.cities.length; index++) {
        this.cities[index].update();
        this.citiesLine[index].update();
      }

      // 人工衛星を更新
      this.satellite.update();

      // カメラコントローラーの更新
      this.controller.update();

      this.renderer.render(this.scene, this.camera);
    }
  }
}