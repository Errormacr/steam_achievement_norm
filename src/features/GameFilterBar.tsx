import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IdKeyInput from '../components/IdKeyInput';
import { useClickOutside } from '../hooks/useClickOutside';
import { COMPLETION_FILTER_OPTIONS, SORTING_OPTIONS, TIME_FILTER_OPTIONS } from '../constants/gameFilters';

interface GameFilterBarProps {
  filters: {
    searchQuery: string;
    selectedValue: string | null;
    selectedTimeFilterValue: string | null;
    selectedCompletionFilterValue: string | null;
    desc: boolean;
  };
  onFilterChange: (filters: any) => void;
}

export function GameFilterBar ({ filters, onFilterChange }: GameFilterBarProps) {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeFilterDropdownOpen, setTimeFilterDropdownOpen] = useState(false);
  const [completedFilterDropdownOpen, setCompletedFilterDropdownOpen] = useState(false);

  const listRef = useClickOutside(() => setDropdownOpen(false));
  const filterTimeListRef = useClickOutside(() => setTimeFilterDropdownOpen(false));
  const filterCompletedListRef = useClickOutside(() => setCompletedFilterDropdownOpen(false));

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleItemClick = (value: string) => {
    onFilterChange({ ...filters, selectedValue: value });
    setDropdownOpen(false);
  };

  const handleTimeFilterItemClick = (value: string) => {
    onFilterChange({ ...filters, selectedTimeFilterValue: filters.selectedTimeFilterValue === value ? null : value });
    setTimeFilterDropdownOpen(false);
  };

  const handleCompletionFilterItemClick = (value: string) => {
    onFilterChange({ ...filters, selectedCompletionFilterValue: filters.selectedCompletionFilterValue === value ? null : value });
    setCompletedFilterDropdownOpen(false);
  };

  const handleToggleArrows = () => {
    onFilterChange({ ...filters, desc: !filters.desc });
  };

  return (
    <div className="gameFilterCont">
      <div className="inputSortFilterContainerGames">
        <IdKeyInput
          placeholder={t('SearchGames')}
          value={filters.searchQuery}
          onChange={handleSearchInputChange}
        />
        <div ref={listRef} className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {t('SortBy')}
          </button>

          {dropdownOpen && (
            <ul className="dropdown-list">
              {SORTING_OPTIONS.map((option) => (
                <li
                  tabIndex={0}
                  key={option.value}
                  className={filters.selectedValue === option.value ? 'active' : ''}
                  onClick={() => handleItemClick(option.value)}
                  onKeyPress={() => handleItemClick(option.value)}
                >
                  {t(option.label)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={filterTimeListRef} className="dropdown-container">
          {filters.selectedTimeFilterValue != null && (
            <div
              tabIndex={0}
              role={'button'}
              onClick={() => onFilterChange({ ...filters, selectedTimeFilterValue: null })}
              onKeyPress={() => onFilterChange({ ...filters, selectedTimeFilterValue: null })}
              className="cross"
            >
              <div className="horizontal"></div>
            </div>
          )}
          <button
            className="dropdown-button"
            onClick={() => setTimeFilterDropdownOpen(!timeFilterDropdownOpen)}
          >
            {t('TimeFilter')}
          </button>
          {timeFilterDropdownOpen && (
            <ul className="dropdown-list">
              {TIME_FILTER_OPTIONS.map((filter) => (
                <li
                  tabIndex={0}
                  key={filter.value}
                  className={filters.selectedTimeFilterValue === filter.value ? 'active' : ''}
                  onClick={() => handleTimeFilterItemClick(filter.value)}
                  onKeyPress={() => handleTimeFilterItemClick(filter.value)}
                >
                  {t(filter.label)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={filterCompletedListRef} className="dropdown-container">
          {filters.selectedCompletionFilterValue != null && (
            <div
              role={'button'}
              tabIndex={0}
              onClick={() => onFilterChange({ ...filters, selectedCompletionFilterValue: null })}
              onKeyPress={() => onFilterChange({ ...filters, selectedCompletionFilterValue: null })}
              className="cross"
            >
              <div className="horizontal"></div>
              <div className="vertical"></div>
            </div>
          )}
          <button
            className="dropdown-button"
            onClick={() => setCompletedFilterDropdownOpen(!completedFilterDropdownOpen)}
          >
            {t('CompletedFilter')}
          </button>
          {completedFilterDropdownOpen && (
            <ul className="dropdown-list">
              {COMPLETION_FILTER_OPTIONS.map((filterValue) => (
                <li
                  tabIndex={0}
                  key={filterValue}
                  className={filters.selectedCompletionFilterValue === filterValue ? 'active' : ''}
                  onClick={() => handleCompletionFilterItemClick(filterValue)}
                  onKeyPress={() => handleCompletionFilterItemClick(filterValue)}
                >
                  {t(filterValue)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="arrows-container" onClick={handleToggleArrows}>
          <div className={filters.desc ? 'arrow activate' : 'arrow'}>&#x25B2;</div>
          <div className={!filters.desc ? 'arrow activate' : 'arrow'}>&#x25BC;</div>
        </button>
      </div>
    </div>
  );
}
