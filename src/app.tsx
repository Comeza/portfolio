import {useState} from 'react';
import Style from 'modules/app.module.sass';
import {createShaderCanvas} from "react-shader-canvas"
import shader from "shader/shader.glsl"
import contacts from "links.json"

const Shader = createShaderCanvas(_ => shader)

interface Contact {
	name: string;
	url: string;
}

export default () => {
	const [timeSync, _] = useState(false);

	console.log(contacts);

	return (
		<div>
			<div className={Style.background}>
				<Shader
					id="experimental-step-curve"
					timeSync={timeSync}
					width={window.innerWidth}
					height={window.innerHeight}
				/>
			</div>
			<div className={Style.AppContainer}>
				<div className={Style.NameContainer}>
					<span>Aaron</span>
					<span>Geiger</span>
				</div>

				<div className={Style.TraitContainer}>
					<span>student.</span>
					<span>developer.</span>
				</div>

				<div className={Style.LinksContainer}>
					{ (contacts as Contact[]).map((contact: Contact) => (<a href={contact.url} key={contact.url}>{contact.name}</a>)) }
				</div>
			</div>
		</div>
	);
}

