import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';

import StatsRareAch from '../features/StatsRareAch';
import StatsTimeAch from '../features/StatsTimeAch';
import { statsComponentProps } from '../../interfaces';

import '../scss/StatsPage.scss';

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { gameAppid } = useParams<{ gameAppid?: string }>();
  const [type, setType] = useState<string | null>(sessionStorage.getItem('type'));

  const componentMap: Record<string, React.FC> = {
    RareStats: StatsRareAch,
    TimeStats: StatsTimeAch
  };

  useEffect(() => {
    if (type) {
      sessionStorage.setItem('type', type);
    }
  }, [type]);

  const ComponentToRender: null | React.FC<statsComponentProps> = type ? componentMap[type] : null;

  return (
    <I18nextProvider i18n={i18n}>
      <FaArrowLeft
        className="button-icon return"
        onClick={() => navigate('/')}
        id="return"
      />
      <div className="stats-page">
        <div className="stats-type-holder">
          {Object.keys(componentMap).map((type, index) => (
            <div
              className="stats-type"
              id={index.toString()}
              key={index}
              onClick={() => setType(type)}
            >
              {t(type)}
            </div>
          ))}
        </div>
        <div className="stats-container">
          {ComponentToRender
            ? (
            <ComponentToRender gameAppid={+gameAppid || undefined} />
              )
            : (
            <div>Select a type to view stats</div>
              )}
        </div>
      </div>
    </I18nextProvider>
  );
};

export default StatsPage;
