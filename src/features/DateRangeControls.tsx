import React from 'react';
import { useTranslation } from 'react-i18next';
import GameButton from '../components/GameButton';

interface DateRangeControlsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateRangeControls: React.FC<DateRangeControlsProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const { t } = useTranslation();

  const handleDateShift = (amount: number, unit: 'day' | 'month' | 'year') => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (unit === 'day') {
      newStartDate.setDate(newStartDate.getDate() + amount);
      newEndDate.setDate(newEndDate.getDate() + amount);
    } else if (unit === 'month') {
      newStartDate.setMonth(newStartDate.getMonth() + amount);
      newEndDate.setMonth(newEndDate.getMonth() + amount);
    } else if (unit === 'year') {
      newStartDate.setFullYear(newStartDate.getFullYear() + amount);
      newEndDate.setFullYear(newEndDate.getFullYear() + amount);
    }

    onStartDateChange(newStartDate.toISOString().split('T')[0]);
    onEndDateChange(newEndDate.toISOString().split('T')[0]);
  };

  const setDisplayRange = (unit: 'month' | 'year' | '5years') => {
    const newEndDate = new Date();
    const newStartDate = new Date();

    if (unit === 'month') {
      newStartDate.setMonth(newStartDate.getMonth() - 1);
    } else if (unit === 'year') {
      newStartDate.setFullYear(newStartDate.getFullYear() - 1);
    } else if (unit === '5years') {
      newStartDate.setFullYear(newStartDate.getFullYear() - 5);
    }

    onStartDateChange(newStartDate.toISOString().split('T')[0]);
    onEndDateChange(newEndDate.toISOString().split('T')[0]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <GameButton onClick={() => setDisplayRange('month')} id={'set-range-month'} text={t('month')} style={{ marginRight: 0 }} />
        <GameButton onClick={() => setDisplayRange('year')} id={'set-range-year'} text={t('year')} style={{ marginRight: 0 }} />
        <GameButton onClick={() => setDisplayRange('5years')} id={'set-range-5years'} text={t('5 years')} style={{ marginRight: 0 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <GameButton onClick={() => handleDateShift(-1, 'year')} title={t('shiftYearBack')} id={'shift-year-back'} text={'<<<'} style={{ marginRight: 0 }} />
        <GameButton onClick={() => handleDateShift(-1, 'month')} title={t('shiftMonthBack')} id={'shift-month-back'} text={'<<'} style={{ marginRight: 0 }} />
        <GameButton onClick={() => handleDateShift(-1, 'day')} title={t('shiftDayBack')} id={'shift-day-back'} text={'<'} style={{ marginRight: 0 }} />
        <div>
          <label htmlFor="startDate">{t('from')}: </label>
          <input type="date" id="startDate" value={startDate} onChange={e => onStartDateChange(e.target.value)} className="dateInput" style={{ margin: 0 }} />
        </div>
        <div>
          <label htmlFor="endDate">{t('to')}: </label>
          <input type="date" id="endDate" value={endDate} onChange={e => onEndDateChange(e.target.value)} className="dateInput" style={{ margin: 0 }} />
        </div>
        <GameButton onClick={() => handleDateShift(1, 'day')} title={t('shiftDayForward')} id={'shift-day-forward'} text={'>'} style={{ marginRight: 0 }} />
        <GameButton onClick={() => handleDateShift(1, 'month')} title={t('shiftMonthForward')} id={'shift-month-forward'} text={'>>'} style={{ marginRight: 0 }} />
        <GameButton onClick={() => handleDateShift(1, 'year')} title={t('shiftYearForward')} id={'shift-year-forward'} text={'>>>'} style={{ marginRight: 0 }} />
      </div>
    </div>
  );
};
