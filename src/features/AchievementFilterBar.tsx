import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import IdKeyInput from '../components/IdKeyInput';
import { AchievementFiltersState } from '../hooks/useAchievementFilters';
import { RARE_FILTER_OPTIONS, SORTING_OPTIONS } from '../constants/achFilters';
import { Dropdown } from '../components/Dropdown';

interface AchievementFilterBarProps {
  all?: boolean;
  filters: AchievementFiltersState;
  onFilterChange: (filters: AchievementFiltersState) => void;
  minPercent?: number;
  maxPercent?: number;
}

const handleFilterChange = (
  filters: AchievementFiltersState,
  onFilterChange: (filters: AchievementFiltersState) => void,
  updatedFilters: Partial<AchievementFiltersState>
) => {
  onFilterChange({ ...filters, ...updatedFilters });
};

const handleCompletionFilterChange = (
  filters: AchievementFiltersState,
  onFilterChange: (filters: AchievementFiltersState) => void,
  value: string
) => {
  handleFilterChange(filters, onFilterChange, {
    selectedCompletionFilterValue:
      filters.selectedCompletionFilterValue === value ? null : value
  });
};

const getSortingOptions = (all?: boolean) => {
  const options = [...SORTING_OPTIONS];
  if (!all && !options.some((option) => option.value === 'unlocked')) {
    options.push({ value: 'unlocked', label: 'Gained' });
  }
  return options;
};

const getRareFilterOptions = (minPercent: number, maxPercent: number) =>
  RARE_FILTER_OPTIONS.filter((filterValue) => {
    const [min, max] = filterValue.slice(7).split('-').map(Number);
    return minPercent <= min && maxPercent >= max;
  }).map((value) => ({ value, label: value }));

export const AchievementFilterBar: React.FC<AchievementFilterBarProps> = ({
  all,
  filters,
  onFilterChange,
  minPercent = 0,
  maxPercent = 100
}) => {
  const { t } = useTranslation();
  const {
    searchQueryGameName,
    searchQueryAch,
    selectedValue,
    selectedCompletionFilterValue,
    desc
  } = filters;

  const sortingOptions = useMemo(() => getSortingOptions(all), [all]);
  const rareFilterOptions = useMemo(
    () => getRareFilterOptions(minPercent, maxPercent),
    [minPercent, maxPercent]
  );

  return (
    <div className="inputSortFilterContainerAch">
      {all && (
        <IdKeyInput
          placeholder={t('SearchGames')}
          value={searchQueryGameName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFilterChange(filters, onFilterChange, { searchQueryGameName: e.target.value })
          }
        />
      )}
      <IdKeyInput
        placeholder={t('SearchAch')}
        value={searchQueryAch}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFilterChange(filters, onFilterChange, { searchQueryAch: e.target.value })
        }
      />
      <Dropdown
        options={sortingOptions}
        selectedValue={selectedValue}
        onSelect={(value) => handleFilterChange(filters, onFilterChange, { selectedValue: value })}
        buttonText="SortBy"
      />
      <Dropdown
        options={rareFilterOptions}
        selectedValue={selectedCompletionFilterValue}
        onSelect={(value) => handleCompletionFilterChange(filters, onFilterChange, value)}
        buttonText="GainedPercent"
        onReset={() =>
          handleFilterChange(filters, onFilterChange, { selectedCompletionFilterValue: null })
        }
      />
      <button
        className="arrows-container"
        onClick={() => handleFilterChange(filters, onFilterChange, { desc: !desc })}
      >
        <div className={desc ? 'arrow activate' : 'arrow'}>&#x25B2;</div>
        <div className={desc ? 'arrow' : 'arrow activate'}>&#x25BC;</div>
      </button>
    </div>
  );
};
