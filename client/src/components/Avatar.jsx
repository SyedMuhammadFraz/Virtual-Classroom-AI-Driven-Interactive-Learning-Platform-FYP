import React, { useRef, useEffect } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'

export function Avatar(props) {

  const { animation } = props;
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/6752d809d815ebc40c83665d.glb')

  const { animations: StandingIdle } = useFBX("/animations/Standing Idle.fbx");
  const { animations: StandingPose } = useFBX("/animations/Standing Pose.fbx");
  const { animations: Pointing } = useFBX("/animations/Pointing.fbx");
  const { animations: StandingArguing } = useFBX("/animations/Standing Arguing.fbx");
  const { animations: Talking } = useFBX("/animations/Talking.fbx");
  const { animations: Talkingf } = useFBX("/animations/Talkingf.fbx");
  const { animations: WalkCircle } = useFBX("/animations/Walk In Circle.fbx");
  const { animations: Walkleft } = useFBX("/animations/Walking Left Turn.fbx");
  const { animations: Walking } = useFBX("/animations/Walking.fbx");
  const { animations: Yelling } = useFBX("/animations/Yelling.fbx");
  const { animations: Talking3 } = useFBX("/animations/Talking3.fbx");

  // Renaming animations for easier access
  StandingIdle[0].name = "Standing";
  StandingPose[0].name = "StandingPose";
  Pointing[0].name = "Pointing";
  StandingArguing[0].name = "StandingArguing";
  Talking[0].name = "Talking";
  Talkingf[0].name = "Talkingf";
  WalkCircle[0].name = "WalkCircle";
  Walkleft[0].name = "WalkLeft";
  Walking[0].name = "Walking";
  Yelling[0].name = "Yelling";
  Talking3[0].name = "Talking3";

  const { actions } = useAnimations(
    [
      StandingIdle[0],
      StandingPose[0],
      Pointing[0],
      StandingArguing[0],
      Talking[0],
      Talkingf[0],
      WalkCircle[0],
      Walkleft[0],
      Walking[0],
      Yelling[0],
      Talking3[0],
    ],
    group
  );

  useEffect(() => {
    if (actions[animation]) {
        actions[animation].reset().play();
    }
    return () => {
        if (actions[animation]) {
            actions[animation].reset().stop();
        }
    };
}, [animation, actions]);
  return (

    <group {...props} ref={group} dispose={null} rotation={[0, 0, 0]}>
    <group rotation-x={-Math.PI/2}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
    </group>
  );
}

useGLTF.preload('models/6752d809d815ebc40c83665d.glb')
