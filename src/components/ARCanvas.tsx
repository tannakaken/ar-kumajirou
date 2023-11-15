import { RootState, Canvas } from "@react-three/fiber";

import { AR, ArProps } from "./AR";

type ArCanvasProps = ArProps & {
  arEnabled?: boolean;
  camera?: {
    position: [number, number, number];
    far?: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gl?: any;
  onCreated: (obj: RootState) => void;
  dpr?: number;
};

export const ARCanvas = ({
  arEnabled = true,
  tracking = true,
  children,
  patternRatio = 0.5,
  detectionMode = "mono_and_matrix",
  cameraParametersUrl = "data/camera_para.dat",
  matrixCodeType = "3x3",
  sourceType = "webcam",
  onCameraStreamReady,
  onCameraStreamError,
  camera,
  ...props
}: ArCanvasProps) => (
  <Canvas camera={arEnabled ? { position: [0, 0, 0] } : camera} {...props}>
    {arEnabled ? (
      <AR
        tracking={tracking}
        patternRatio={patternRatio}
        matrixCodeType={matrixCodeType}
        detectionMode={detectionMode}
        sourceType={sourceType}
        cameraParametersUrl={cameraParametersUrl}
        onCameraStreamReady={onCameraStreamReady}
        onCameraStreamError={onCameraStreamError}
      >
        {children}
      </AR>
    ) : (
      children
    )}
  </Canvas>
);
