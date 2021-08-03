import React, { Component } from 'react';
import COLORS from "assets/colors.json"
import Style from 'style/modules/app.module.sass';
import { ReactComponent as GithubSVG } from 'assets/github.svg';
import { ReactComponent as MailSVG } from 'assets/mail.svg';
import { ReactComponent as WaveSVG } from 'assets/wave.svg';

export default class App extends Component {

  render() {
    return (
      <div id={Style.APP}>
        <div className={Style.nameContainer}>
          <span className={Style.name}>AARON&nbsp;</span>
          <span className={Style.surname}>GEIGER</span>
          {/* <WaveSVG className={Style.wave} /> */}
        </div>

        <div className={Style.contentContainer}>
          <div className={Style.linkContainer}>
            <a href="https://github.com/comeza" target="_blank" rel="noreferrer"><GithubSVG fill={COLORS.foreground}/></a>
            <a href="mailto:aaron@geigr.io"><MailSVG fill={COLORS.foreground}/></a>
          </div>

          <div className={Style.text}>
            <span>web developer.</span>
            <span>software developer.</span>
          </div>
        </div>
      </div>
    );
  }
}
