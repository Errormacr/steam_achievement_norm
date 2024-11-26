import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useNavigate } from 'react-router-dom';
import './scss/StatsPage.scss';
import ReactDOM from 'react-dom/client';
import StatsRareAch from './StatsRareAch';
import StatsTimeAch from './StatsTImeAch';
import { FaArrowLeft } from 'react-icons/fa';

const ComponentThree : React.FC = () => <div>Content for Component Three</div>;
const ComponentFour : React.FC = () => <div>Content for Component Four</div>;
const StatsPage : React.FC = () => {
  const navigate = useNavigate();

  const componentMap : Record < string,
        React.FC > = {
          Rare: StatsRareAch,
          Time: StatsTimeAch,
          type3: ComponentThree,
          type4: ComponentFour
        };

  useEffect(() => {
    const type = sessionStorage.getItem('type');
    if (type) {
      renderComponent(type);
    }
  }, []);

  const renderComponent = (type : string) => {
    const statsContainer = document.querySelector('.stats-container');
    sessionStorage.setItem('type', type);

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

            <FaArrowLeft
                className="button-icon return"
                onClick={() => navigate('/')}
                id="return"/>
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
