import { useState } from 'react';

export interface AchievementFiltersState {
  selectedValue: string | null;
  desc: boolean;
  selectedCompletionFilterValue: string | null;
  searchQueryGameName: string;
  searchQueryAch: string;
}

export const useAchievementFilters = (initialState: Partial<AchievementFiltersState> = {}) => {
  const [filters, setFilters] = useState<AchievementFiltersState>({
    selectedValue: 'unlockedDate',
    desc: true,
    selectedCompletionFilterValue: null,
    searchQueryGameName: '',
    searchQueryAch: '',
    ...initialState
  });

  return {
    filters,
    setFilters
  };
};
