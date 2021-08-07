import React, { Component } from 'react';
import COLORS from 'assets/colors.json';
import Style from 'style/modules/app.module.sass';
import { ReactComponent as GithubSVG } from 'assets/github.svg';
import { ReactComponent as MailSVG } from 'assets/mail.svg';
import { docElem } from 'index';

interface AppState {
  colorScheme: 'dark' | 'light';
}

interface AppProps {
  defaultAppState: AppState;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = props.defaultAppState;
  }

  componentDidMount() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) =>
        this.setState({ colorScheme: e.matches ? 'dark' : 'light' })
      );
  }

  render() {
    let theme = this.state.colorScheme ?? 'light';
    Object.entries(COLORS[theme]).forEach(([key, value]) =>
      docElem.style.setProperty(`--color-${key}`, value)
    );

    return (
      <div id={Style.APP}>
        <div className={Style.nameContainer}>
          <span className={Style.name}>AARON&nbsp;</span>
          <span className={Style.surname}>GEIGER</span>
          {/* <WaveSVG className={Style.wave} /> */}
        </div>

        <div className={Style.contentContainer}>
          <div className={Style.linkContainer}>
            <a
              href="https://github.com/comeza"
              target="_blank"
              rel="noreferrer"
            >
              <GithubSVG fill={COLORS[theme].foreground} />
            </a>
            <a href="mailto:aaron@geigr.io">
              <MailSVG fill={COLORS[theme].foreground} />
            </a>
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
