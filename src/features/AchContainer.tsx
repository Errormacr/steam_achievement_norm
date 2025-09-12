import React, { useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import '../styles/scss/AchConteiner.scss';
import '../styles/scss/FilterSort.scss';
import { AchBoxProps } from '../interfaces';
import { useAchievementFilters } from '../hooks/useAchievementFilters';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementFilterBar } from './AchievementFilterBar';
import { AchievementList } from './AchievementList';

const AchBox: React.FC<AchBoxProps> = ({ appid, all, minPercent, maxPercent, date, unlocked }) => {
  const { filters, setFilters } = useAchievementFilters();
  const { ach, isLoading, hasMore, newAchievements, setPage } = useAchievements(filters, { appid, all, unlocked, minPercent, maxPercent, date });
  const observer = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  const lastAchievementRef = (node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
          console.log(entries[0].isIntersecting && hasMore && !isLoadingRef.current);
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (node) observer.current.observe(node);
  };

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
          lastAchievementRef={lastAchievementRef}
        />
      </div>
    </I18nextProvider>
  );
};

export default AchBox;
