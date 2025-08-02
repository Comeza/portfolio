import { ShaderCanvas } from "lib/shader";
import { useEffect, useState } from "react";

import fontAtlas from "assets/sprites/atlas.png"

import debugShader from "assets/shader/debug.frag?raw";
import boxesShader from "assets/shader/boxes.frag?raw";
import testBoxesShader from "assets/shader/testBoxes.frag?raw"
import uvColorShader from "assets/shader/uvColor.frag?raw"

const SHADERS = {
    debug: debugShader,
    boxes: boxesShader,
    testBoxes: testBoxesShader,
    uvColor: uvColorShader,
}

export default function App() {
    const [texture, setTexture] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = fontAtlas;
        img.onload = () => setTexture(img);
    }, []);

    let content = <span>Loading</span>
    if (texture)
        content = <ShaderCanvas
            fs={SHADERS.boxes}
            uniforms={{ u_texture: texture, u_atlasSize: [8, 2], u_tileSize: 8 }}
        />

    return (
        <div className="w-dvw h-dvh flex justify-center items-center">
            {content}
        </div>
    )
}
