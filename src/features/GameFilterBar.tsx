import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IdKeyInput from '../components/IdKeyInput';
import { useClickOutside } from '../hooks/useClickOutside';
import { COMPLETION_FILTER_OPTIONS, SORTING_OPTIONS, TIME_FILTER_OPTIONS } from '../constants/gameFilters';
import { Filters } from '../interfaces';

interface GameFilterBarProps {
  filters: {
    searchQuery: string;
    selectedValue: string | null;
    selectedTimeFilterValue: string | null;
    selectedCompletionFilterValue: string | null;
    desc: boolean;
  };
  onFilterChange: (filters: Filters) => void;
}

export function GameFilterBar ({ filters, onFilterChange }: Readonly<GameFilterBarProps>) {
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

  const buttonStyle: React.CSSProperties = {
    all: 'unset',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer'
  };

  const crossButtonStyle: React.CSSProperties = {
    all: 'unset',
    cursor: 'pointer'
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
            className="dropdown-button-light"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {t('SortBy')}
          </button>

          {dropdownOpen && (
            <ul className="dropdown-list">
              {SORTING_OPTIONS.map((option) => (
                <li
                  key={option.value}
                  className={filters.selectedValue === option.value ? 'active' : ''}
                >
                  <button style={buttonStyle} onClick={() => handleItemClick(option.value)}>
                    {t(option.label)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={filterTimeListRef} className="dropdown-container">
          {filters.selectedTimeFilterValue != null && (
            <button
              style={crossButtonStyle}
              onClick={() => onFilterChange({ ...filters, selectedTimeFilterValue: null })}
              className="cross"
            >
              <div className="horizontal"></div>
            </button>
          )}
          <button
            className="dropdown-button-light"
            onClick={() => setTimeFilterDropdownOpen(!timeFilterDropdownOpen)}
          >
            {t('TimeFilter')}
          </button>
          {timeFilterDropdownOpen && (
            <ul className="dropdown-list">
              {TIME_FILTER_OPTIONS.map((filter) => (
                <li
                  key={filter.value}
                  className={filters.selectedTimeFilterValue === filter.value ? 'active' : ''}
                >
                  <button style={buttonStyle} onClick={() => handleTimeFilterItemClick(filter.value)}>
                    {t(filter.label)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={filterCompletedListRef} className="dropdown-container">
          {filters.selectedCompletionFilterValue != null && (
            <button
              style={crossButtonStyle}
              onClick={() => onFilterChange({ ...filters, selectedCompletionFilterValue: null })}
              className="cross"
            >
              <div className="horizontal"></div>
              <div className="vertical"></div>
            </button>
          )}
          <button
            className="dropdown-button-light"
            onClick={() => setCompletedFilterDropdownOpen(!completedFilterDropdownOpen)}
          >
            {t('CompletedFilter')}
          </button>
          {completedFilterDropdownOpen && (
            <ul className="dropdown-list">
              {COMPLETION_FILTER_OPTIONS.map((filterValue) => (
                <li
                  key={filterValue}
                  className={filters.selectedCompletionFilterValue === filterValue ? 'active' : ''}
                >
                  <button style={buttonStyle} onClick={() => handleCompletionFilterItemClick(filterValue)}>
                    {t(filterValue)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="arrows-container-light" onClick={handleToggleArrows}>
          <div className={filters.desc ? 'arrow activate' : 'arrow'}>&#x25B2;</div>
          <div className={!filters.desc ? 'arrow activate' : 'arrow'}>&#x25BC;</div>
        </button>
      </div>
    </div>
  );
}
