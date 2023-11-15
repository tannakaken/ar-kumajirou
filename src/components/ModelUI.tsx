import React, { useEffect, useMemo } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import {
  Group,
  MeshPhongMaterial,
  Object3DEventMap,
  SkinnedMesh,
  Vector3Tuple,
} from "three";
import { useFrame } from "@react-three/fiber";

type AssetType = "GLTF" | "FBX";

type Props = {
  scale?: number;
  clickableRadius?: number;
  rotation?: Vector3Tuple;
  angularVelocity?: Vector3Tuple;
  position?: Vector3Tuple;
  onClick?: () => void;
  state: { count: number };
};

type PropsWithAsset = Props & {
  asset: string;
};

type PropWithAssetType = PropsWithAsset & {
  assetType?: AssetType;
};

export const ModelUI = ({ assetType = "GLTF", ...prop }: PropWithAssetType) => {
  if (assetType === "FBX") {
    return <FBXModel {...prop} />;
  } else {
    return <GLTFModel {...prop} />;
  }
};

const FBXModel = ({ asset, ...props }: PropsWithAsset) => {
  const scene = useFBX(asset);
  const scene2 = useFBX("/assets/Breakdance.fbx");
  scene2.animations[0].name = "mixamo2.com";
  const { ref, actions } = useAnimations([
    ...scene.animations,
    ...scene2.animations,
  ]);
  useEffect(() => {
    actions["mixamo.com"]?.reset().fadeIn(0.5).play();
  }, [actions]);
  const state = useMemo(
    () => ({
      count: props.state.count,
    }),
    [props.state]
  );
  useFrame(() => {
    if (state.count != props.state.count) {
      state.count = props.state.count;
      actions["mixamo.com"]?.fadeOut(0.5);
      actions["mixamo2.com"]?.reset().fadeIn(0.5).play();
      setTimeout(() => {
        actions["mixamo2.com"]?.fadeOut(0.5);
        actions["mixamo.com"]?.reset().fadeIn(0.5).play();
      }, 5000);
    }
  });
  return (
    <Model
      modelRef={ref as React.Ref<Group<Object3DEventMap>>}
      scene={scene}
      {...props}
    />
  );
};

const GLTFModel = ({ asset, ...props }: PropsWithAsset) => {
  const { scene } = useGLTF(asset);
  const { ref, actions } = useAnimations(scene.animations);
  useEffect(() => {
    actions["mixamo.com"]?.reset().fadeIn(0.5).play();
  }, [actions]);
  return (
    <Model
      modelRef={ref as React.Ref<Group<Object3DEventMap>>}
      scene={scene}
      {...props}
    />
  );
};

type ModelProp = Props & {
  scene: Group;
  modelRef: React.Ref<Group<Object3DEventMap>>;
};

const Model = ({
  scene,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  modelRef,
}: ModelProp) => {
  useEffect(() => {
    scene.children.forEach((child) => {
      if (child instanceof SkinnedMesh) {
        if (child.material instanceof MeshPhongMaterial) {
          if (child.material.color.r > 0.5) {
            child.material.color.r = child.material.color.r / 2 + 0.1;
            child.material.color.g = child.material.color.g / 2;
            child.material.color.b = child.material.color.b / 2;
          }
        } else {
          child.material.forEach((material: object) => {
            if (material instanceof MeshPhongMaterial) {
              if (material.color.r > 0.5) {
                material.color.r = material.color.r / 2 + 0.1;
                material.color.g = material.color.g / 2;
                material.color.b = material.color.b / 2;
              }
            }
          });
        }
      }
    });
  }, [scene]);
  return (
    <group ref={modelRef} dispose={null}>
      <primitive
        object={scene}
        rotation={rotation}
        scale={scale}
        position={position}
      />
    </group>
  );
};
