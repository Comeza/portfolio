import fShader from "assets/image.frag?raw"
import { ShaderCanvas } from "lib/shader";
import { useEffect, useState } from "react";
// import fontAtlas from "assets/font.png"

export default function App() {
    const [texture, setTexture] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = 'https://picsum.photos/512/512';
        img.onload = () => setTexture(img);
    }, []);


    return (
        <div className="w-dvw h-dvh">
            {texture && <ShaderCanvas fs={fShader} uniforms={{ u_texture: texture }} />}
        </div>
    )
}
