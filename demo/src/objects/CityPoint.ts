import * as THREE from "three";

/**
 * 都市の3Dポイントの表示クラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export class CityPoint extends THREE.Group {
  /** 球 */
  sphere: THREE.Mesh;

  /** 点光源 */
  pointLight: THREE.PointLight;

  /** 地球からポイントまでの距離 */
  radius = 110;

  /** 緯度 */
  latitude = 0;

  /** 経度 */
  longitude = 0;

  /**
   * 緯度・経度・半径の情報をまとめて取得します。
   */
  getCoords(): { latitude: number; longitude: number; radius: number } {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      radius: this.radius,
    };
  }

  /**
   * コンストラクタ
   * @param color ポイントの色
   * @param coords 緯度・経度
   */
  constructor(color: number, coords: [number, number]) {
    super();

    // 球
    const geometry = new THREE.SphereGeometry(2, 10, 10);
    const material = new THREE.MeshLambertMaterial({ color });

    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.receiveShadow = true;
    this.add(this.sphere);

    // 点光源
    this.pointLight = new THREE.PointLight(color, 2, 0);
    this.add(this.pointLight);

    this.latitude = coords[0];
    this.longitude = coords[1];
  }
}
