import React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';
import { useNavigate } from 'react-router-dom';
import './scss/StatsPage.scss';
import ReactDOM from 'react-dom/client';
import RareAchStats from './RareAchStats';

const ComponentTwo: React.FC = () => <div>Content for Component Two</div>;
const ComponentThree: React.FC = () => <div>Content for Component Three</div>;
const ComponentFour: React.FC = () => <div>Content for Component Four</div>;
const StatsPage : React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const componentMap : Record < string,
        React.FC > = {
          Rare: RareAchStats,
          type2: ComponentTwo,
          type3: ComponentThree,
          type4: ComponentFour
        };

  const renderComponent = (type : string) => {
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
      const root = ReactDOM.createRoot(statsContainer);
      const ComponentToRender = componentMap[type];
      if (ComponentToRender) {
        root.render(<ComponentToRender/>);
      } else {
        root.render(
                    <div>Unknown type: {type}</div>
        );
      }
    }
  };

  return (
        <I18nextProvider i18n={i18n}>

            <GameButton
                additionalClass="return"
                onClick={() => navigate('/')}
                id="return"
                text={t('Return')}/>
            <div className='stats-page'>
                <div className='stats-type-holder'>
                    {Object
                      .keys(componentMap)
                      .map((type, index) => (
                            <div
                                className='stats-type'
                                id={index.toString()}
                                key={index}
                                onClick={() => renderComponent(type)}>{type}</div>

                      ))}
                </div>
                <div className='stats-container'></div>
            </div>
        </I18nextProvider>
  );
};

export default StatsPage;
