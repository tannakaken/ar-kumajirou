import "./App.css";
import { ARMarker } from "./components/ARMarker";
import { Suspense } from "react";
import { ARCanvas } from "./components/ARCanvas";
import { TCanvas } from "./components/TCanvas";

const ARMarkerModel = () => {
  return (
    <>
      <ARMarker
        type={"pattern"}
        patternUrl={"data/pattern.patt"}
        onMarkerFound={() => {
          console.warn("found");
        }}
        onMarkerLost={() => {
          console.warn("lost");
        }}
      >
        <TCanvas />
      </ARMarker>
    </>
  );
};

const Fallback = () => <p>さあ、クマとダンスを踊りましょう。</p>;

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Suspense fallback={<Fallback />}>
        <ARCanvas
          dpr={window.devicePixelRatio}
          onCameraStreamReady={() => {
            console.warn("ready");
          }}
          onCameraStreamError={() => console.error("Camera stream error")}
          onCreated={({ gl }) => {
            gl.setSize(window.innerWidth, window.innerHeight);
          }}
          patternRatio={0.5}
        >
          <ARMarkerModel />
        </ARCanvas>
      </Suspense>
    </div>
  );
}

export default App;
