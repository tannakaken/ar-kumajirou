import { useMemo } from "react";
// import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ModelUI } from "./ModelUI";

// type Props = {
//   fov?: number;
//   position?: [number, number, number];
// };

export const TCanvas = () => {
  // const { fov = 50, position = [0, 0, -5] } = props;
  const state = useMemo(
    () => ({
      count: 0,
    }),
    []
  );
  return (
    <>
      <OrbitControls />
      <ambientLight />
      <pointLight position={[0, 10, -5]} intensity={100.0} />
      <mesh
        position={[0, 5, 10]}
        scale={1}
        onClick={() => {
          state.count += 1;
          console.warn(state.count);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"orange"} />
      </mesh>
      <ModelUI
        assetType="FBX"
        asset="assets/SwingDancing.fbx"
        position={[0, 0, 10]}
        rotation={[0, 180, 0]}
        scale={0.01}
        state={state}
      />
    </>
  );
};
