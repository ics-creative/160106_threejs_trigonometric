import * as THREE from "three";
import { createOrbitPoints } from "../utils/GeoUtil";

/**
 * ポイントを結ぶ線分の表示関数です。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */

export interface CityLineData {
  group: THREE.Group;
  line: THREE.Line;
  geometry: THREE.BufferGeometry;
  startTarget: THREE.Object3D;
  endTarget: THREE.Object3D;
}

/**
 * ポイントを結ぶ線分を作成します。
 * @param startTarget 始点となるオブジェクト
 * @param endTarget 終点となるオブジェクト
 * @returns CityLineData オブジェクト
 */
export function createCityLine(
  startTarget: THREE.Object3D,
  endTarget: THREE.Object3D,
): CityLineData {
  const group = new THREE.Group();

  const geometry = new THREE.BufferGeometry();

  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      linewidth: 2,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
    }),
  );
  group.add(line);

  return {
    group,
    line,
    geometry,
    startTarget,
    endTarget,
  };
}

/**
 * 線分を更新します。
 */
export function updateCityLine(cityLine: CityLineData): void {
  const points = createOrbitPoints(
    cityLine.startTarget.position,
    cityLine.endTarget.position,
  );

  // 頂点を更新
  cityLine.geometry.setFromPoints(points);
}
