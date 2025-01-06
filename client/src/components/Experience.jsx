import { Environment, OrbitControls, Sky } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useControls } from 'leva';

export const Experience = () => {

  const { animation } = useControls({
    animation: {
      value: "Standing",
      options: [
        "Standing",
        "StandingPose",
        "Pointing",
        "StandingArguing",
        "Talking",
        "Talkingf",
        "Talking3",
        "WalkCircle",
        "WalkLeft",
        "Walking",
        "Yelling",
      ],
    },
  });

  return (
    <>
      <OrbitControls />
      <Sky />
      <Environment preset="sunset" />
      <group position-y={-0.8}>
        <Avatar animation={animation} />
      </group>
    </>
  );
};
