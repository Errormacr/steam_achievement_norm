import { useEffect, useCallback, useReducer } from 'react';
import { ApiService } from '../services/api.services';
import { AchievmentsFromView, Pagination, AchBoxProps } from '../interfaces';
import i18n from 'i18next';

const PAGE_SIZE = 50;

interface BuildAchievementParams extends AchBoxProps {
  sortConfig: string;
  desc: boolean;
  page: number;
  pageSize: number;
}

const buildAchievementParams = (params: BuildAchievementParams) => {
  const { sortConfig, desc, page, pageSize, all, appid, unlocked, minPercent, maxPercent, date } = params;

  const queryObj: Record<string, string> = {
    orderBy: sortConfig,
    desc: desc ? '1' : '0',
    language: i18n.language,
    page: page.toString(),
    pageSize: pageSize.toString()
  };

  if (unlocked || all) {
    queryObj.unlocked = '1';
  }
  if (!all && appid) {
    queryObj.appid = String(appid);
  }
  if (minPercent) {
    queryObj.percentMin = minPercent.toString();
  }
  if (maxPercent) {
    queryObj.percentMax = maxPercent.toString();
  }
  if (date) {
    queryObj.unlockedDate = date;
  }

  return new URLSearchParams(queryObj);
};

// Reducer state and actions
interface AchievementsState {
  ach: AchievmentsFromView[];
  sortConfig: string;
  desc: boolean;
  isLoading: boolean;
  page: number;
  hasMore: boolean;
}

type AchievementsAction =
  | { type: 'SET_SORT'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { rows: AchievmentsFromView[]; reset: boolean } }
  | { type: 'FETCH_ERROR' };

const initialState: AchievementsState = {
  ach: [],
  sortConfig: 'unlockedDate',
  desc: true,
  isLoading: false,
  page: 1,
  hasMore: true
};

const achievementsReducer = (state: AchievementsState, action: AchievementsAction): AchievementsState => {
  switch (action.type) {
    case 'SET_SORT':
      if (state.sortConfig === action.payload) {
        return { ...state, page: 1, desc: !state.desc };
      }
      return { ...state, page: 1, sortConfig: action.payload, desc: true };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'FETCH_START':
      return { ...state, isLoading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        ach: action.payload.reset ? action.payload.rows : [...state.ach, ...action.payload.rows],
        hasMore: action.payload.rows.length === PAGE_SIZE
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, hasMore: false };
    default:
      return state;
  }
};

export const useTableAchievements = (filters: AchBoxProps) => {
  const [state, dispatch] = useReducer(achievementsReducer, initialState);
  const { ach, sortConfig, desc, isLoading, page, hasMore } = state;

  const { appid, all, minPercent, maxPercent, date, unlocked } = filters;

  const fetchAchievements = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    const isReset = page === 1;

    try {
      const queryParams = buildAchievementParams({ sortConfig, desc, page, pageSize: PAGE_SIZE, ...filters });
      const steamId = localStorage.getItem('steamId');
      const response = await ApiService.get<Pagination<AchievmentsFromView>>(
        `user/${steamId}/achievements?${queryParams.toString()}`
      );
      dispatch({ type: 'FETCH_SUCCESS', payload: { rows: response.rows, reset: isReset } });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      dispatch({ type: 'FETCH_ERROR' });
    }
  }, [sortConfig, desc, page, appid, all, minPercent, maxPercent, date, unlocked]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleSortChange = (newSortConfig: string) => {
    dispatch({ type: 'SET_SORT', payload: newSortConfig });
  };

  const setPage = (pageUpdater: (prevPage: number) => number) => {
    dispatch({ type: 'SET_PAGE', payload: pageUpdater(page) });
  };

  return { ach, isLoading, hasMore, sortConfig, desc, handleSortChange, setPage };
};
