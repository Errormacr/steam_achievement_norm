import React, { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import './scss/Table.scss';
import { ApiService } from '../services/api.services';
import { AchievmentsFromView, Pagination } from '../interfaces';
interface AchBoxProps {
  appid?: number;
  all: boolean;
}

const Table: React.FC < AchBoxProps > = ({
  appid
  , all
}) => {
  const [ach,
    setAch] = useState([]);
  const [sortConfig,
    setSortConfig] = useState('unlockedDate');
  const [desc, setDesc] = useState(true);
  const { t } = useTranslation();

  const updateAchievements = async () => {
    const queryParams = new URLSearchParams({
      orderBy: sortConfig,
      desc: desc ? '1' : '0',
      language: i18n.language
    });
    if (!all) {
      queryParams.append('appid', '' + appid);
    } else {
      queryParams.append('unlocked', '1');
    }
    const dataSteamId = localStorage.getItem('steamId');
    const achData = await ApiService.get<Pagination<AchievmentsFromView>>(`user/${dataSteamId}/achievements?${queryParams.toString()}`);
    setAch(achData.rows);
  };

  useEffect(() => {
    try {
      updateAchievements();
    } catch (error) {
      window.alert(error.message);
    }
  }, [sortConfig, desc]);

  const sortOptions = [

    {
      value: 'displayName',
      label: t('Name')
    }, {
      value: 'description',
      label: t('Description')
    }, {
      value: 'percent',
      label: t('PercentPlayer')
    }, {
      value: 'unlockedDate',
      label: t('DataGain')
    }
  ];
  const handleSortChange = (event:string) => {
    if (sortConfig === event) {
      setDesc(!desc);
    } else { setSortConfig(event); }
  };
  if (!all) {
    sortOptions.unshift({ value: 'unlocked', label: t('Gained') });
  } else {
    sortOptions.unshift({ value: '', label: '' });
  }
  return (
        <I18nextProvider i18n={i18n}>
            <table>
                <thead>
                    <tr>
                        {sortOptions.map((option) => {
                          return <th
                                onClick={() => {
                                  handleSortChange(option.value);
                                }}>{option.label} {sortConfig === option.value
                                  ? desc
                                    ? '\u25BC'
                                    : '\u25B2'
                                  : ''}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                {ach.map((achievement) => {
                  const rowClass = achievement.percent <= 5 ? 'rare1' : '';
                  const imgClass = () => {
                    if (achievement.percent <= 5) return 'rare1 table-ach-img';
                    if (achievement.percent <= 20) return 'rare2 table-ach-img';
                    if (achievement.percent <= 45) return 'rare3 table-ach-img';
                    if (achievement.percent <= 60) return 'rare4 table-ach-img';
                    return 'rare5 table-ach-img';
                  };
                  const formattedDate =
                     achievement.unlockedDate ? new Date(achievement.unlockedDate).toLocaleString() : '';

                  return (
            <tr className={rowClass}>
                <td>
                    <img
                        className={imgClass()}
                        src={achievement.unlocked ? achievement.icon : achievement.grayIcon}></img>
                </td>
                <td>{achievement.displayName}</td>
                <td>{achievement.description}</td>
                <td>{achievement.percent.toFixed(2)}%</td>
                <td>{formattedDate}</td>
            </tr>
                  );
                })}</tbody>

            </table>
        </I18nextProvider>
  );
};
export default Table;
