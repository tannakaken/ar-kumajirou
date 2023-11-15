import React from "react";
import * as THREE from "three";
import { useGLTF, useMatcapTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  AnimationAssets,
  TextureMap,
  useAnimation,
  // useAnimation,
} from "../helpers/animation.helper";

type GLTFResult = GLTF & {
  nodes: { [key in string]: object };
  materials: { [key in string]: object };
};

export type GLTFDatum = {
  name: string;
  meshName: string;
  materialName: string;
};

const CustomMesh = ({
  datum,
  texture,
  mesh,
  material,
}: {
  datum: GLTFDatum;
  texture: string;
  mesh: THREE.SkinnedMesh;
  material: THREE.MeshStandardMaterial;
}) => {
  const [matcap] = useMatcapTexture(texture, 512);
  return (
    <skinnedMesh
      name={datum.meshName}
      geometry={mesh.geometry}
      material={material}
      skeleton={mesh.skeleton}
    >
      <meshMatcapMaterial attach="material" matcap={matcap} />
    </skinnedMesh>
  );
};

type Props = JSX.IntrinsicElements["group"] & {
  asset: string;
  animationName: string;
  paused: boolean;
  gltfData: GLTFDatum[];
  textureMap: TextureMap;
  animationAssets: AnimationAssets;
};

export const AnimatedModel = (props: Props) => {
  const { ref } = useAnimation(
    props.animationAssets,
    props.animationName,
    props.paused
  );
  const gltf = useGLTF(props.asset) as GLTFResult;
  return (
    <group
      ref={ref as React.Ref<THREE.Group<THREE.Object3DEventMap>>}
      {...props}
      dispose={null}
    >
      <group name="Scene">
        <group name="Armature" rotation={[0, 0, 0]} scale={0.1}>
          <primitive object={gltf.nodes.sakugaguide} />
          {props.gltfData.map((datum) => {
            const mesh = gltf.nodes[datum.meshName];
            if (!(mesh instanceof THREE.SkinnedMesh)) {
              console.error("Invalid Mesh Name!:" + datum.meshName);
              return undefined;
            }
            console.warn(gltf.materials);
            const material = gltf.materials[datum.materialName];
            if (!(material instanceof THREE.MeshStandardMaterial)) {
              console.error("Invalid Material Name!:" + datum.materialName);
              return undefined;
            }
            const texture = props.textureMap[datum.meshName];
            if (texture === undefined) {
              console.error("Invalid Texture Map!");
              return undefined;
            }
            return (
              <CustomMesh
                key={datum.meshName}
                mesh={mesh}
                material={material}
                datum={datum}
                texture={texture}
              />
            );
          })}
        </group>
      </group>
    </group>
  );
};
