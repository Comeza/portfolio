/// <reference types="vite/client" />

declare module "react-shader-canvas" {
	import { CSSProperties, FunctionComponent } from 'react';

	export interface ShaderCanvasProps {
		id: string,
		width: number,
		height: number,
		style?: CSSProperties,
		timeSync: boolean
	}

	export const createShaderCanvas: (shader: (props: {[key: string]: any}) => string) => FunctionComponent<ShaderCanvasProps>;
}

declare module "*.glsl" {
	const value: string;
	export default value;
}
