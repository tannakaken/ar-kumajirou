import { useEffect, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { TextureName } from './params';

export type TextureMap = { [key in string]: TextureName | undefined };
export type AnimationAssets = { [key in string]: string | undefined }

export const useModelConfig = (initialTextureMap: TextureMap, initialAnimationName: string) => {
    const [animationName, setAnimationName] = useState(initialAnimationName);
    const [textureMap, setTextureMap] = useState<TextureMap>(initialTextureMap);
    const [paused, setPaused] = useState(false);
    return {animationName, setAnimationName, textureMap, setTextureMap, setPaused, paused}
}

export const useAnimation = (animationAssets: AnimationAssets, animationName: string, paused: boolean) => {
    const animationClips: THREE.AnimationClip[] = []
    Object.values(animationAssets).forEach(asset => {
        if (asset === undefined) {
            return;
        }
        /* eslint-disable react-hooks/rules-of-hooks */
        const { animations } = useGLTF(asset);
        animationClips.push(...animations)
    })

    const { actions, ref } = useAnimations(animationClips)

    // animation
    useEffect(() => {
        console.warn(actions[animationName]?.reset().fadeIn(0.5).play());

        return () => void actions[animationName]?.fadeOut(0.5)
    }, [actions, animationName])

    // pause
    useEffect(() => {
        const action = actions[animationName];
        if (action) {
            action.paused = paused
        }
    }, [actions, animationName, paused])

    return {ref}
}