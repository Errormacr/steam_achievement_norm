import React from 'react';
import './Calendar.css';

interface CalendarProps {
  achievementsPerDay: number[];
}

const Calendar: React.FC<CalendarProps> = ({ achievementsPerDay }) => {
  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>Моя активность</h2>
      </div>
      <div className="calendar-grid">
        {achievementsPerDay.map((count, index) => (
          <div
            key={index}
            className={`calendar-cell ${count > 0 ? 'active' : ''}`}
          >
            {count}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;