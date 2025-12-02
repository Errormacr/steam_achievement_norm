import React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import '../styles/scss/Table.scss';
import { AchContainerProps } from '../types';
import { useTableAchievements } from '../hooks/useTableAchievements';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { AchievementRow } from './AchievementRow';

const Table: React.FC<AchContainerProps> = (props) => {
  const { t } = useTranslation();
  const {
    ach,
    isLoading,
    hasMore,
    sortConfig,
    desc,
    handleSortChange,
    setPage
  } = useTableAchievements(props);

  const sort = desc ? '\u25BC' : '\u25B2';

  const lastElementRef = useInfiniteScroll(() => {
    setPage((prevPage) => prevPage + 1);
  }, hasMore, isLoading);

  const sortOptions = [
    { value: 'displayName', label: t('Name') },
    { value: 'description', label: t('Description') },
    { value: 'percent', label: t('PercentPlayer') },
    { value: 'unlockedDate', label: t('DataGain') }
  ];

  if (props.all) {
    sortOptions.unshift({ value: '', label: '' });
  } else {
    sortOptions.unshift({ value: 'unlocked', label: t('Gained') });
  }

  return (
    <I18nextProvider i18n={i18n}>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {sortOptions.map((option) => (
                <th
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                  {sortConfig === option.value ? sort : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ach.map((achievement, index) => (
              <AchievementRow
                key={`${achievement.appid}-${achievement.name}`}
                achievement={achievement}
                isLast={index === ach.length - 1}
                lastElementRef={lastElementRef}
              />
            ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="loading-indicator">
            {t('Loading...')}
          </div>
        )}
      </div>
    </I18nextProvider>
  );
};

export default Table;
