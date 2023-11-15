import { Vector3Tuple } from "three";
import { GLTFDatum } from "./components/AnimatedModel";
import { AnimationAssets, TextureMap } from "./helpers/animation.helper";


export type ModelAsset = {
  asset: string;
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  angularVelocity?: Vector3Tuple;
  scale?: number;
  gltfData: GLTFDatum[];
  initialTextureMap: TextureMap;
  animationAssets: AnimationAssets;
}
