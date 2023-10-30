import { useState } from "react";
import { createShaderCanvas } from "react-shader-canvas";
import shader from "assets/shader/shader.frag";
import contacts from "links.json";

const Shader = createShaderCanvas((_) => shader);

interface Contact {
  name: string;
  url: string;
}

export const App = () => {
  const [timeSync, _] = useState(false);

  return (
    <div>
      <div className="">
        <Shader
          id="bg-shaer"
          timeSync={timeSync}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
      <div>
        <div>
          <span>Aaron</span>
          <span>Geiger</span>
        </div>

        <div>
          <span>student.</span>
          <span>developer.</span>
        </div>

        <div>
          {(contacts as Contact[]).map((contact: Contact) => (
            <a href={contact.url} key={contact.url}>
              {contact.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
