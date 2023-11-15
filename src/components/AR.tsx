import { useFrame, useThree } from "@react-three/fiber";
import {
  ArToolkitContext,
  ArToolkitSource,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from "@ar-js-org/ar.js/three.js/build/ar-threex";
import React, { useCallback, useEffect, useMemo } from "react";
import { ARContext } from "./useAR";

const videoDomElemSelector = "#arjs-video";

type DetectionMode = "mono_and_matrix";

export type ArProps = {
  tracking?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceType?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patternRatio?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matrixCodeType?: any;
  detectionMode?: DetectionMode;
  cameraParametersUrl?: string;
  onCameraStreamReady?: () => void;
  onCameraStreamError?: () => void;
};

export const AR = React.memo(
  ({
    tracking = true,
    children,
    sourceType,
    patternRatio,
    matrixCodeType,
    detectionMode,
    cameraParametersUrl,
    onCameraStreamReady,
    onCameraStreamError,
  }: ArProps) => {
    const { camera } = useThree();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arContext: { arToolkitContext?: any; arToolkitSource?: any } =
      useMemo(() => {
        const arToolkitSource = new ArToolkitSource({ sourceType });
        const arToolkitContext = new ArToolkitContext({
          cameraParametersUrl,
          detectionMode,
          patternRatio,
          matrixCodeType,
        });
        return { arToolkitContext, arToolkitSource };
      }, [
        patternRatio,
        matrixCodeType,
        cameraParametersUrl,
        detectionMode,
        sourceType,
      ]);

    const onResize = useCallback(() => {
      const { arToolkitSource } = arContext;
      arToolkitSource.onResizeElement();
      // arToolkitSource.copyElementSizeTo(gl.domElement);
      // if (arToolkitContext.arController !== null) {
      //   arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      //   camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
      // }
    }, [arContext]);

    const onUnmount = useCallback(() => {
      window.removeEventListener("resize", onResize);
      arContext.arToolkitContext?.arController?.dispose();
      if (arContext.arToolkitContext?.arController?.cameraParam) {
        arContext.arToolkitContext.arController.cameraParam.dispose();
      }

      delete arContext.arToolkitContext;
      delete arContext.arToolkitSource;

      const video = document.querySelector(
        videoDomElemSelector
      ) as HTMLVideoElement;
      if (video) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        video.srcObject.getTracks().map((track) => track.stop());
        video.remove();
      }
    }, [onResize, arContext]);

    useEffect(() => {
      arContext.arToolkitSource?.init(() => {
        const video = document.querySelector(videoDomElemSelector);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        video.style.position = "fixed";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        video.style.pointerEvents = "none";

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        video.onloadedmetadata = () => {
          console.log(
            "actual source dimensions",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            video.videoWidth,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            video.videoHeight
          );
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (video.videoWidth > video.videoHeight) {
            arContext.arToolkitContext.arController.orientation = "landscape";
            arContext.arToolkitContext.arController.options.orientation =
              "landscape";
            console.log("landscape");
          } else {
            arContext.arToolkitContext.arController.orientation = "portrait";
            arContext.arToolkitContext.arController.options.orientation =
              "portrait";
            console.log("portrait");
          }

          if (onCameraStreamReady) {
            onCameraStreamReady();
          }
          onResize();
        };
      }, onCameraStreamError);

      arContext.arToolkitContext?.init(() =>
        camera.projectionMatrix.copy(
          arContext.arToolkitContext.getProjectionMatrix()
        )
      );

      window.addEventListener("resize", onResize);

      return onUnmount;
    }, [
      arContext,
      camera,
      onCameraStreamReady,
      onCameraStreamError,
      onResize,
      onUnmount,
    ]);

    useFrame(() => {
      if (!tracking) {
        return;
      }

      if (
        arContext.arToolkitSource &&
        arContext.arToolkitSource.ready !== false
      ) {
        arContext.arToolkitContext.update(arContext.arToolkitSource.domElement);
      }
    });

    const value = useMemo(
      () => ({ arToolkitContext: arContext.arToolkitContext }),
      [arContext]
    );

    return <ARContext.Provider value={value}>{children}</ARContext.Provider>;
  }
);
