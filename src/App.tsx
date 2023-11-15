import { Stage } from "@react-three/drei";
import "./App.css";
import { ARMarker } from "./components/ARMarker";
import { AnimationModelArea } from "./components/AnimationModelArea";

const ARMarkerModel = () => {
  return (
    <>
      <ARMarker
        type={"pattern"}
        patternUrl={"data/pattern.patt"}
        // onMarkerFound={() => {
        //   if (groupRef.current) {
        //     groupRef.current.visible = false;
        //   }
        // }}
        // onMarkerLost={() => {
        //   if (groupRef.current) {
        //     groupRef.current.visible = true;
        //   }
        // }}
      >
        <Stage environment={null}>
          <AnimationModelArea />
        </Stage>
      </ARMarker>
    </>
  );
};

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* <AnimationModelArea {...modelAsset} /> */}
      <ARMarkerModel />
    </div>
  );
}

export default App;
