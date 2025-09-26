import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import '../styles/scss/AchConteiner.scss';
import '../styles/scss/FilterSort.scss';
import { AchBoxProps } from '../interfaces';
import { useAchievementFilters } from '../hooks/useAchievementFilters';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementFilterBar } from './AchievementFilterBar';
import { AchievementList } from './AchievementList';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const AchBox: React.FC<AchBoxProps> = ({ appid, all, minPercent, maxPercent, date, unlocked }) => {
  const { filters, setFilters } = useAchievementFilters();
  const { ach, isLoading, hasMore, newAchievements, setPage } = useAchievements(filters, { appid, all, unlocked, minPercent, maxPercent, date });

  const lastElementRef = useInfiniteScroll(() => {
    setPage((prevPage) => prevPage + 1);
  }, hasMore, isLoading);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="AchSet">
        <AchievementFilterBar
          all={all}
          filters={filters}
          onFilterChange={setFilters}
          minPercent={minPercent}
          maxPercent={maxPercent}
        />
        <AchievementList
          achievements={ach}
          newAchievements={newAchievements}
          isLoading={isLoading}
          lastAchievementRef={lastElementRef}
        />
      </div>
    </I18nextProvider>
  );
};

export default AchBox;
