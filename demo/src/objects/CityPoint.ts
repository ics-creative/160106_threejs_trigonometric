import * as THREE from "three";

/**
 * 都市の3Dポイントの表示関数です。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export interface CityPointData {
  group: THREE.Group;
  sphere: THREE.Mesh;
  pointLight: THREE.PointLight;
  radius: number;
  latitude: number;
  longitude: number;
}

/**
 * 都市の3Dポイントを作成します。
 * @param color ポイントの色
 * @param coords 緯度・経度
 * @returns CityPointData オブジェクト
 */
export function createCityPoint(
  color: number,
  coords: [number, number],
): CityPointData {
  const group = new THREE.Group();

  // 球
  const geometry = new THREE.SphereGeometry(2, 10, 10);
  const material = new THREE.MeshLambertMaterial({ color });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true;
  group.add(sphere);

  // 点光源
  const pointLight = new THREE.PointLight(color, 2000);
  group.add(pointLight);

  return {
    group,
    sphere,
    pointLight,
    radius: 110,
    latitude: coords[0],
    longitude: coords[1],
  };
}

/**
 * 緯度・経度・半径の情報をまとめて取得します。
 */
export function getCityPointCoords(cityPoint: CityPointData): {
  latitude: number;
  longitude: number;
  radius: number;
} {
  return {
    latitude: cityPoint.latitude,
    longitude: cityPoint.longitude,
    radius: cityPoint.radius,
  };
}
