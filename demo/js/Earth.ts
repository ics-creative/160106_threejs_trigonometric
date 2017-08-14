///<reference path="../../typings/tsd.d.ts" />
///<reference path="Util.ts" />

module demo {

    /**
     * 地球クラス
     * @author Takayoshi Sawada
     */
    export class Earth extends THREE.Group {

        /** 球 **/
        public ground: THREE.Mesh;
        /** 雲 **/
        public cloud: THREE.Mesh;

        /**
         * コンストラクタ
         */
        constructor() {
            super();

            // 球
            let groundGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(100, 35, 35);
            let groundTexture: THREE.Texture = THREE.ImageUtils.loadTexture("img/ground.jpg");
            let groundBump: THREE.Texture = THREE.ImageUtils.loadTexture("img/bump.jpg");
            let specular: THREE.Texture = THREE.ImageUtils.loadTexture("img/specular.png");
            let groundMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({map: groundTexture, bumpMap:groundBump, bumpScale: 0.5, specularMap: specular});
            this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
            this.ground.receiveShadow = true;
            this.add(this.ground);

            // 雲
            let cloudGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(102, 35, 35);
            let cloudTexture: THREE.Texture = THREE.ImageUtils.loadTexture("img/cloud.jpg");
            let cloudMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({map: cloudTexture, transparent: true, blending: THREE.AdditiveBlending });
            this.cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            this.cloud.castShadow = true;
            this.add(this.cloud);
        }

        /**
         * 更新
         */
        public update() {
            this.cloud.rotation.y += 0.0005;
        }
    }
}