import fragmentShader from "assets/shader/shader.frag";
import vertexShader from "assets/shader/default.vert";
import links from "assets/links.json";
import quotes from "assets/quotes.json";
import image from "assets/font.png";

import { Shader, ShaderProps } from "Shader";

interface Link {
  name: string;
  url: string;
}

export const App = () => {
  const quote = quotes[new Date().getDate() % quotes.length];

  const shader: ShaderProps = {
    vertexShader,
    fragmentShader,
    canvasProps: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  const uniforms = {
    u_texture: image,
    u_texture_size: 8,
    u_texture_items: 8,
    u_custom_color: [1.0, 0.0, 0.0, 1],
  };

  return (
    <div>
      <Shader {...shader} />
      <div className="d-flex">
        <div className="v-line" />
        <div className="d-flex flex-v">
          <span className="f-switzer name-title">
            AARON
            <br />
            GEIGER
          </span>

          <div className="d-flex flex-v box">
            <span>student.</span>
            <span>developer.</span>
          </div>

          <div className="d-flex flex-v box">
            {(links as Link[]).map((contact: Link) => (
              <a href={contact.url} key={contact.url}>
                {contact.name}
              </a>
            ))}
          </div>

          <span className="box quote">{quote}</span>
        </div>
      </div>
    </div>
  );
};
