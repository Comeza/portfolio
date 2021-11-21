import Style from 'modules/app.module.sass';

export default () => {
  return (
    <div className={Style.AppContainer}>
      <div className={Style.NameContainer}>
        <span>Aaron</span>
        <span>Geiger</span>
      </div>

      <div className={Style.TraitContainer}>
        <span>student.</span>
        <span>web developer.</span>
        <span>software developer.</span>
      </div>
    </div>
  );
};
