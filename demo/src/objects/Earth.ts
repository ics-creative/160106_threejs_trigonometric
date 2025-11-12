import * as THREE from "three";
import groundImage from "../assets/images/ground.jpg";
import bumpImage from "../assets/images/bump.jpg";
import specularImage from "../assets/images/specular.png";
import cloudImage from "../assets/images/cloud.jpg";

/**
 * 地球の表示クラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export class Earth extends THREE.Group {
  /** 球 **/
  ground: THREE.Mesh;
  /** 雲 **/
  cloud: THREE.Mesh;

  /**
   * コンストラクタ
   */
  constructor() {
    super();

    {
      // 地球の球体
      const geometry = new THREE.SphereGeometry(100, 60, 60);
      const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(groundImage),
        bumpMap: new THREE.TextureLoader().load(bumpImage),
        bumpScale: 1.0,
        specularMap: new THREE.TextureLoader().load(specularImage),
      });

      this.ground = new THREE.Mesh(geometry, material);
      this.ground.receiveShadow = true;
      this.add(this.ground);
    }

    {
      // 雲
      const geometry = new THREE.SphereGeometry(102, 60, 60);
      const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(cloudImage),
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      this.cloud = new THREE.Mesh(geometry, material);
      this.cloud.castShadow = true;
      this.add(this.cloud);
    }
  }

  /**
   * 更新
   */
  update() {
    this.cloud.rotation.y += 0.0005;
  }
}
