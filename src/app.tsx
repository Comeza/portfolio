import { useState } from "react";
import { createShaderCanvas } from "react-shader-canvas";
import shader from "assets/shader/shader.frag";
import links from "assets/links.json";
import quotes from "assets/quotes.json";

const Shader = createShaderCanvas((_) => shader);

interface Contact {
  name: string;
  url: string;
}

export const App = () => {
  const [timeSync, _] = useState(false);
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <div>
      <Shader
        id="bg-shaer"
        timeSync={timeSync}
        width={window.innerWidth}
        height={window.innerHeight}
      />
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
            {(links as Contact[]).map((contact: Contact) => (
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
