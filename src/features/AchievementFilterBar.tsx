import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IdKeyInput from '../components/IdKeyInput';
import { useClickOutside } from '../hooks/useClickOutside';
import { AchievementFiltersState } from '../hooks/useAchievementFilters';
import { RARE_FILTER_OPTIONS, SORTING_OPTIONS } from '../constants/achFilters';

interface AchievementFilterBarProps {
  all?: boolean;
  filters: AchievementFiltersState;
  onFilterChange: (filters: AchievementFiltersState) => void;
  minPercent?: number;
  maxPercent?: number;
}

export const AchievementFilterBar: React.FC<AchievementFilterBarProps> = ({ all, filters, onFilterChange, minPercent = 0, maxPercent = 100 }) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCompletedFilterDropdownOpen, setIsCompletedFilterDropdownOpen] = useState(false);

  const listRef = useClickOutside(() => setIsDropdownOpen(false));
  const filterCompletedListRef = useClickOutside(() => setIsCompletedFilterDropdownOpen(false));

  const {
    searchQueryGameName,
    searchQueryAch,
    selectedValue,
    selectedCompletionFilterValue,
    desc
  } = filters;

  const sortingOptions = SORTING_OPTIONS;

  if (!all) {
    sortingOptions.push({ value: 'unlocked', label: 'Gained' });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQueryGameName: e.target.value });
  };
  const handleAchSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQueryAch: e.target.value });
  };
  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, selectedValue: value });
    setIsDropdownOpen(false);
  };
  const handleCompletionFilterChange = (value: string) => {
    onFilterChange({ ...filters, selectedCompletionFilterValue: filters.selectedCompletionFilterValue === value ? null : value });
    setIsCompletedFilterDropdownOpen(false);
  };
  const resetCompletionFilterChange = () => {
    onFilterChange({ ...filters, selectedCompletionFilterValue: null });
  };
  const toggleSortDirection = () => {
    onFilterChange({ ...filters, desc: !filters.desc });
  };

  return (
    <div className="inputSortFilterContainerAch">
      {all && (
        <IdKeyInput
          placeholder={t('SearchGames')}
          value={searchQueryGameName}
          onChange={handleSearchChange}
        />
      )}
      <IdKeyInput
        placeholder={t('SearchAch')}
        value={searchQueryAch}
        onChange={handleAchSearchChange}
      />
      <div ref={listRef} className="dropdown-container">
        <button
          className="dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {t('SortBy')}
        </button>
        {isDropdownOpen && (
          <ul className="dropdown-list">
            {sortingOptions.map((option) => (
              <li
                  tabIndex={0}
                key={option.value}
                className={selectedValue === option.value ? 'active' : ''}
                onClick={() => handleSortChange(option.value)}
                onKeyPress={() => handleSortChange(option.value)}
              >
                {t(option.label)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div ref={filterCompletedListRef} className="dropdown-container">
        {selectedCompletionFilterValue != null && (
          <div
            role="button"
            tabIndex={0}
            onClick={resetCompletionFilterChange}
            onKeyPress={resetCompletionFilterChange}
            className="cross"
          >
            <div className="horizontal"></div>
            <div className="vertical"></div>
          </div>
        )}
        <button
          className="dropdown-button"
          onClick={() => setIsCompletedFilterDropdownOpen(!isCompletedFilterDropdownOpen)}
        >
          {t('GainedPercent')}
        </button>
        {isCompletedFilterDropdownOpen && (
          <ul className="dropdown-list">
            {RARE_FILTER_OPTIONS.filter((filterValue) => {
              const [min, max] = filterValue.slice(7).split('-').map(Number);
              return minPercent <= min && maxPercent >= max;
            })
              .map((filterValue) => (
                <li
                  key={filterValue}
                  className={selectedCompletionFilterValue === filterValue ? 'active' : ''}
                  onClick={() => handleCompletionFilterChange(filterValue)}
                >
                  {t(filterValue)}
                </li>
              ))}
          </ul>
        )}
      </div>
      <button className="arrows-container" onClick={toggleSortDirection}>
        <div className={desc ? 'arrow activate' : 'arrow'}>&#x25B2;</div>
        <div className={!desc ? 'arrow activate' : 'arrow'}>&#x25BC;</div>
      </button>
    </div>
  );
};
