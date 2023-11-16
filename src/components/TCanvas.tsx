import { useCallback, useMemo } from "react";
import { OrbitControls, Sphere } from "@react-three/drei";
import { ModelUI } from "./ModelUI";

export const TCanvas = () => {
  const state = useMemo(
    () => ({
      count: 0,
    }),
    []
  );
  const onClick = useCallback(() => {
    state.count += 1;
  }, [state]);
  return (
    <>
      <OrbitControls />
      <ambientLight />
      <pointLight position={[0, 10, -5]} intensity={100.0} />
      <ModelUI
        assetType="FBX"
        asset="assets/SwingDancing.fbx"
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={0.005}
        state={state}
      />
      <Sphere position={[0, 1, 1]} scale={[1, 1, 1]} onClick={onClick}>
        <meshStandardMaterial color={"orange"} transparent opacity={0} />
      </Sphere>
    </>
  );
};
