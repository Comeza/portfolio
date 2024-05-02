import fragmentShader from "assets/shader/shader.frag";
import vertexShader from "assets/shader/default.vert";
import links from "assets/links.json";
import quotes from "assets/quotes.json";

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
