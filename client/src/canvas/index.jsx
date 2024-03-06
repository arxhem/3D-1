import { Canvas } from "@react-three/fiber"
import { Environment, Center } from "@react-three/drei"
import Shirt from "./Shirt"
import CameraRig from "./CameraRig.jsx"
import Backdrop from "./Backdrop.jsx"
const CanvasModel = () => {
  return (
    <Canvas
    shadows
    camera={{ position: [0, 0,0], fov: 25 }}
    gl={{preserveDrawingBuffer: true}}
    className="w-full h-full max-w-full transition-all ease-in-out "
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel;