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

  const sortingOptions = useMemo(() => {
    const options = [...SORTING_OPTIONS];
    if (!all && !options.find((option) => option.value === 'unlocked')) {
      options.push({ value: 'unlocked', label: 'Gained' });
    }
    return options;
  }, [all]);

  const handleFilterChange = (updatedFilters: Partial<AchievementFiltersState>) => {
    onFilterChange({ ...filters, ...updatedFilters });
  };

  const handleCompletionFilterChange = (value: string) => {
    handleFilterChange({
      selectedCompletionFilterValue:
        filters.selectedCompletionFilterValue === value ? null : value
    });
  };

  const rareFilterOptions = useMemo(() => RARE_FILTER_OPTIONS
    .filter((filterValue) => {
      const [min, max] = filterValue.slice(7).split('-').map(Number);
      return minPercent <= min && maxPercent >= max;
    })
    .map((value) => ({ value, label: value })), [minPercent, maxPercent]);

  return (
    <div className="inputSortFilterContainerAch">
      {all && (
        <IdKeyInput
          placeholder={t('SearchGames')}
          value={searchQueryGameName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFilterChange({ searchQueryGameName: e.target.value })
          }
        />
      )}
      <IdKeyInput
        placeholder={t('SearchAch')}
        value={searchQueryAch}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFilterChange({ searchQueryAch: e.target.value })
        }
      />
      <Dropdown
        options={sortingOptions}
        selectedValue={selectedValue}
        onSelect={(value) => handleFilterChange({ selectedValue: value })}
        buttonText="SortBy"
      />
      <Dropdown
        options={rareFilterOptions}
        selectedValue={selectedCompletionFilterValue}
        onSelect={handleCompletionFilterChange}
        buttonText="GainedPercent"
        onReset={() => handleFilterChange({ selectedCompletionFilterValue: null })}
      />
      <button
        className="arrows-container"
        onClick={() => handleFilterChange({ desc: !desc })}
      >
        <div className={desc ? 'arrow activate' : 'arrow'}>&#x25B2;</div>
        <div className={!desc ? 'arrow activate' : 'arrow'}>&#x25BC;</div>
      </button>
    </div>
  );
};
