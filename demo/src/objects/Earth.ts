import * as THREE from "three";
import groundImage from "../assets/images/ground.jpg";
import bumpImage from "../assets/images/bump.jpg";
import specularImage from "../assets/images/specular.png";
import cloudImage from "../assets/images/cloud.jpg";

/**
 * 地球の表示関数です。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */

export interface EarthData {
  group: THREE.Group;
  ground: THREE.Mesh;
  cloud: THREE.Mesh;
}

/**
 * 地球を作成します。
 * @returns EarthData オブジェクト
 */
export function createEarth(): EarthData {
  const group = new THREE.Group();

  // 地球の球体
  const groundGeometry = new THREE.SphereGeometry(100, 60, 60);
  const groundMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(groundImage),
    bumpMap: new THREE.TextureLoader().load(bumpImage),
    bumpScale: 1.0,
    specularMap: new THREE.TextureLoader().load(specularImage),
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.receiveShadow = true;
  group.add(ground);

  // 雲
  const cloudGeometry = new THREE.SphereGeometry(102, 60, 60);
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(cloudImage),
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.castShadow = true;
  group.add(cloud);

  return {
    group,
    ground,
    cloud,
  };
}

/**
 * 地球を更新します。
 */
export function updateEarth(earth: EarthData): void {
  earth.cloud.rotation.y += 0.0005;
}
