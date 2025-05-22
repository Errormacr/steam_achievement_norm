import React, { useEffect, useRef, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import '../scss/Table.scss';
import { ApiService } from '../../services/api.services';
import { AchBoxProps, AchievmentsFromView, Pagination } from '../../interfaces';

const Table : React.FC < AchBoxProps > = ({ appid, all, minPercent, maxPercent, date, unlocked }) => {
  const [ach,
    setAch] = useState([]);
  const [sortConfig,
    setSortConfig] = useState('unlockedDate');
  const [isLoading,
    setIsLoading] = useState(false);
  const [page,
    setPage] = useState(1);
  const [hasMore,
    setHasMore] = useState(true);
  const [desc,
    setDesc] = useState(true);
  const { t } = useTranslation();
  const observer = useRef < IntersectionObserver | null >(null);

  const fetchAchievements = async (reset = false) => {
    setIsLoading(true);
    if (reset) {
      setAch([]);
    }
    const queryParams = new URLSearchParams({
      orderBy: sortConfig,
      desc: desc
        ? '1'
        : '0',
      language: i18n.language,
      page: page.toString(),
      pageSize: '40'
    });
    if (!all) {
      queryParams.append('appid', '' + appid);
      if (unlocked) { queryParams.append('unlocked', '1'); }
    } else {
      queryParams.append('unlocked', '1');
    }
    if (minPercent) {
      queryParams.append('percentMin', minPercent.toString());
    }
    if (maxPercent) {
      queryParams.append('percentMax', maxPercent.toString());
    }
    if (date) {
      queryParams.append('unlockedDate', date);
    }

    const steamId = localStorage.getItem('steamId');
    const response = await ApiService.get < Pagination < AchievmentsFromView >>(`user/${steamId}/achievements?${queryParams.toString()}`);

    if (reset) {
      setAch(response.rows);
    } else {
      setAch((prevAch) => [
        ...prevAch,
        ...response.rows
      ]);
    }

    setHasMore(response.rows.length > 0);
    setIsLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchAchievements(true);
  }, [sortConfig, desc]);

  useEffect(() => {
    if (page > 1) { fetchAchievements(); }
  }
  , [page]);

  const lastAchievementRef = (node : HTMLDivElement) => {
    if (isLoading) { return; }
    if (observer.current) { observer.current.disconnect(); }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) { observer.current.observe(node); }
  };

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
  const handleSortChange = (event : string) => {
    if (sortConfig === event) {
      setDesc(!desc);
    } else {
      setSortConfig(event);
    }
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
                    {ach.map((achievement, index, arr) => {
                      const rowClass = achievement.percent <= 5
                        ? 'rare1'
                        : '';
                      const imgClass = () => {
                        if (achievement.percent <= 5) { return 'rare1 table-ach-img'; }
                        if (achievement.percent <= 20) { return 'rare2 table-ach-img'; }
                        if (achievement.percent <= 45) { return 'rare3 table-ach-img'; }
                        if (achievement.percent <= 60) { return 'rare4 table-ach-img'; }
                        return 'rare5 table-ach-img';
                      };
                      const formattedDate = achievement.unlockedDate
                        ? new Date(achievement.unlockedDate).toLocaleString()
                        : '';
                      let last = false;
                      if (index === arr.length - 1) {
                        last = true;
                      }
                      return (
                            <tr
                                className={rowClass}
                                ref={last
                                  ? lastAchievementRef
                                  : undefined}
                                key={achievement.displayName}>
                                <td>
                                    <img
                                        className={imgClass()}
                                        src={achievement.unlocked
                                          ? achievement.icon
                                          : achievement.grayIcon}
                                        alt={achievement.displayName}/>
                                </td>
                                <td>{achievement.displayName}</td>
                                <td>{achievement.description}</td>
                                <td>{achievement
                                  .percent
                                  .toFixed(2)}%</td>
                                <td>{formattedDate}</td>
                            </tr>
                      );
                    })}

                </tbody>

            </table>
        </I18nextProvider>
  );
};
export default Table;
