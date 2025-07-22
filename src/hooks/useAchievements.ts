import { useState, useEffect, useRef } from 'react';
import i18n from 'i18next';
import { ApiService } from '../services/api.services';
import { Pagination, AchievmentsFromView } from '../interfaces';
import { AchievementFiltersState } from './useAchievementFilters';

const PAGE_SIZE = 100;

export const useAchievements = (
  filters: AchievementFiltersState,
  { appid, all, unlocked, minPercent, maxPercent, date }: {
    appid?: number;
    all?: boolean;
    unlocked?: boolean;
    minPercent?: number;
    maxPercent?: number;
    date?: string;
  }
) => {
  const [ach, setAch] = useState<AchievmentsFromView[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newAchievements, setNewAchievements] = useState<number[]>([]);
  const debounceTimeoutRef = useRef<number | null>(null);

  const fetchAchievements = async (reset: boolean) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        orderBy: filters.selectedValue || 'unlockedDate',
        desc: Number(filters.desc).toString(),
        language: i18n.language,
        page: (reset ? 1 : page).toString(),
        pageSize: PAGE_SIZE.toString()
      });

      if (minPercent) queryParams.set('percentMin', minPercent.toString());
      if (maxPercent) queryParams.set('percentMax', maxPercent.toString());
      if (date) queryParams.set('unlockedDate', date);

      if (filters.selectedCompletionFilterValue) {
        const [min, max] = filters.selectedCompletionFilterValue.slice(7).split('-');
        queryParams.set('percentMin', min);
        queryParams.set('percentMax', max);
      }
      if (!all) {
        if (appid) queryParams.append('appid', appid.toString());
        if (unlocked) queryParams.append('unlocked', '1');
      } else {
        queryParams.append('unlocked', '1');
      }
      if (filters.searchQueryAch) queryParams.append('displayName', filters.searchQueryAch);
      if (filters.searchQueryGameName) queryParams.append('gameName', filters.searchQueryGameName);

      const dataSteamId = localStorage.getItem('steamId');
      const response = await ApiService.get<Pagination<AchievmentsFromView>>(`user/${dataSteamId}/achievements?${queryParams.toString()}`);

      const newRows = response.rows;

      if (reset) {
        setAch(newRows);
        setNewAchievements(newRows.map((_, index) => index));
      } else {
        const startIndex = ach.length;
        setAch(prev => [...prev, ...newRows]);
        setNewAchievements(newRows.map((_, index) => startIndex + index));
      }
      setHasMore(newRows.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    if (debounceTimeoutRef.current) {
      window.clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
      fetchAchievements(true);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      fetchAchievements(false);
    }
  }, [page]);

  return { ach, isLoading, hasMore, newAchievements, setPage };
};
