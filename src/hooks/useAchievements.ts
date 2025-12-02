import { useEffect, useReducer } from 'react';
import i18n from 'i18next';
import { ApiService } from '../services/api.services';
import { Pagination, AchievmentsFromView } from '../types';
import { AchievementFiltersState } from './useAchievementFilters';
import { useDebounce } from './useDebounce';
const PAGE_SIZE = 100;

interface BuildParams {
  filters: AchievementFiltersState;
  page: number;
  pageSize: number;
  appid?: number;
  all?: boolean;
  unlocked?: boolean;
  minPercent?: number;
  maxPercent?: number;
  date?: string;
}

type Applier = (q: Record<string, string>, p: BuildParams) => void;

const applyUnlockedParam: Applier = (q, p) => {
  if (p.unlocked || p.all) q.unlocked = '1';
};

const applyAppIdParam: Applier = (q, p) => {
  if (!p.all && p.appid) q.appid = String(p.appid);
};

const applyDateParam: Applier = (q, p) => {
  if (p.date) q.unlockedDate = p.date;
};

const applySearchQueries: Applier = (q, p) => {
  if (p.filters.searchQueryAch) q.displayName = p.filters.searchQueryAch;
  if (p.filters.searchQueryGameName) q.gameName = p.filters.searchQueryGameName;
};

const applyPercentageParams: Applier = (q, p) => {
  let finalMin = p.minPercent;
  let finalMax = p.maxPercent;
  if (p.filters.selectedCompletionFilterValue) {
    const [min, max] = p.filters.selectedCompletionFilterValue.slice(7).split('-');
    finalMin = Number(min);
    finalMax = Number(max);
  }
  if (finalMin) q.percentMin = String(finalMin);
  if (finalMax) q.percentMax = String(finalMax);
};

const paramAppliers: Applier[] = [
  applyUnlockedParam,
  applyAppIdParam,
  applyDateParam,
  applySearchQueries,
  applyPercentageParams
];

const buildAchievementParams = (params: BuildParams) => {
  const queryObj: Record<string, string> = {
    orderBy: params.filters.selectedValue || 'unlockedDate',
    desc: Number(params.filters.desc).toString(),
    language: i18n.language,
    page: params.page.toString(),
    pageSize: params.pageSize.toString()
  };

  paramAppliers.forEach(apply => apply(queryObj, params));

  return new URLSearchParams(queryObj);
};

interface AchievementsState {
  ach: AchievmentsFromView[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  newAchievements: number[];
}

type AchievementsAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { rows: AchievmentsFromView[]; reset: boolean } }
  | { type: 'FETCH_ERROR' };

const initialState: AchievementsState = {
  ach: [],
  page: 1,
  isLoading: false,
  hasMore: true,
  newAchievements: []
};

const achievementsReducer = (state: AchievementsState, action: AchievementsAction): AchievementsState => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'FETCH_START':
      return { ...state, isLoading: true };
    case 'FETCH_SUCCESS': {
      const { rows, reset } = action.payload;
      const newAch = reset ? rows : [...state.ach, ...rows];
      const newAchievements = reset
        ? rows.map((_, index) => index)
        : rows.map((_, index) => state.ach.length + index);
      return {
        ...state,
        isLoading: false,
        ach: newAch,
        newAchievements,
        hasMore: rows.length === PAGE_SIZE
      };
    }
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, hasMore: false };
    default:
      return state;
  }
};

export const useAchievements = (
  filters: AchievementFiltersState,
  props: {
    appid?: number;
    all?: boolean;
    unlocked?: boolean;
    minPercent?: number;
    maxPercent?: number;
    date?: string;
  }
) => {
  const [state, dispatch] = useReducer(achievementsReducer, initialState);
  const { page } = state;
  const debouncedFilters = useDebounce(filters, 500);

  // Effect to reset page when filters change (after debounce)
  useEffect(() => {
    dispatch({ type: 'SET_PAGE', payload: 1 });
  }, [debouncedFilters]);

  // Effect to fetch data when debounced filters or page change
  useEffect(() => {
    const fetch = async () => {
      dispatch({ type: 'FETCH_START' });
      const isReset = page === 1;
      try {
        const queryParams = buildAchievementParams({ filters: debouncedFilters, page, pageSize: PAGE_SIZE, ...props });
        const dataSteamId = localStorage.getItem('steamId');
        const response = await ApiService.get<Pagination<AchievmentsFromView>>(
          `user/${dataSteamId}/achievements?${queryParams.toString()}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: { rows: response.rows, reset: isReset } });
      } catch (error) {
        console.error('Error fetching achievements:', error);
        dispatch({ type: 'FETCH_ERROR' });
      }
    };

    fetch();
  }, [debouncedFilters, page]);

  const setPage = (pageUpdater: (prevPage: number) => number) => {
    dispatch({ type: 'SET_PAGE', payload: pageUpdater(page) });
  };

  return { ...state, setPage };
};
