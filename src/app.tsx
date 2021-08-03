import React, { Component } from 'react';
import Style from 'style/modules/app.module.sass';
import { ReactComponent as WaveSVG } from 'assets/wave.svg';

export default class App extends Component {
  render() {
    return (
      <div id={Style.APP}>
        <div className={Style.nameContainer}>
          <span className={Style.name}>AARON&nbsp;</span>
          <span className={Style.surname}>GEIGER</span>
          <WaveSVG className={Style.wave} />
        </div>

        <div className={Style.text}>
          <span>web developer.</span>
          <span>software developer.</span>
        </div>
      </div>
    );
  }
}
