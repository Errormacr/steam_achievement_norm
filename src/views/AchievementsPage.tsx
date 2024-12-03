import React, { useCallback, useEffect, useState } from 'react';
import Table from './Table';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import ScrollToTopButton from './ScrollToTopButton';
import GameButton from './GameButton';
import AchBox from './AchContainer';
import { AchievmentsFromView, Pagination } from '../interfaces';
import { ApiService } from '../services/api.services';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AchPage : React.FC = () => {
  const navigate = useNavigate();
  const { minPercent, maxPercent, date, backWindow } = useParams < {
        minPercent?: string;
        maxPercent?: string;
        date?: string;
        backWindow?: string;
    } >();

  const [tableOrBox,
    setTable] = useState(true);
  const [loaded,
    setLoaded] = useState(false);
  const [achCount,
    setAchCount] = useState(0);
  const { t } = useTranslation();
  useEffect(useCallback(() => {
    try {
      console.log(minPercent, maxPercent, date);
      const boxView = Boolean(localStorage.getItem('boxView'));
      const steamId = localStorage.getItem('steamId');
      const queryParams = new URLSearchParams({
        orderBy: 'unlockedDate',
        desc: '1',
        language: i18n.language,
        unlocked: '1',
        page: '1',
        pageSize: '0',
        percentMin: minPercent,
        percentMax: maxPercent
      });
      if (date !== 'undefined') {
        queryParams.set('unlockedDate', date);
      }
      console.log(queryParams.toString());
      ApiService.get < Pagination < AchievmentsFromView >>(`user/${steamId}/achievements?${queryParams.toString()}`).then((data) => {
        setAchCount(data.count);
      });
      if (!boxView) {
        setTable(false);
      }
      setLoaded(true);
    } catch (error) {
      window.alert(error.message);
    }
  }, []), []);
  return (
        <I18nextProvider i18n={i18n}>
            <div>
                <ScrollToTopButton/>
                <div className="label-container">
                    <FaArrowLeft
                        className="button-icon return"
            onClick={() => { if (backWindow === 'stats') { navigate('/Stats'); } else { navigate('/'); } }}
                        id="return"/>
                    <label className="game-label">
                        {achCount} {t('Ach')}
                    </label>
                    <GameButton
                        id=""
                        onClick={() => {
                          setTable(!tableOrBox);
                          localStorage.setItem('boxView', String(!tableOrBox));
                        }}
                        additionalClass="switchTable"
                        text={t('SwitchTable')}/>
                </div>
                <div className="details-container table-container">
                    {loaded && (!tableOrBox
                      ? <Table minPercent={+minPercent} maxPercent={+maxPercent} date={date === 'undefined' ? undefined : date} all={true}/>
                      : <AchBox minPercent={+minPercent} maxPercent={+maxPercent} date={date === 'undefined' ? undefined : date} all={true}/>)}
                </div>
            </div>
        </I18nextProvider>
  );
};

export default AchPage;
