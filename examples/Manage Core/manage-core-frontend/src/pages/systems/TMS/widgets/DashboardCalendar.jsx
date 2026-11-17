import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DashboardCalendar = ({ taskDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const setToday = () => setCurrentDate(new Date());

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Calendar</h5>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold" onClick={setToday}>Today</button>
            <div className="d-flex align-items-center bg-light rounded-pill px-2">
              <button className="btn btn-link btn-sm text-muted p-1" onClick={prevMonth}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="mx-2 small fw-bold" style={{ minWidth: '100px', textAlign: 'center' }}>
                {monthNames[month]} {year}
              </span>
              <button className="btn btn-link btn-sm text-muted p-1" onClick={nextMonth}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="d-grid mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {days.map(day => (
              <div key={day} className="text-center x-small fw-bold text-muted text-uppercase mb-2">
                {day}
              </div>
            ))}
          </div>
          <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {[...Array(firstDay)].map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const hasTasks = taskDates.includes(day);
              return (
                <div 
                  key={day} 
                  className={`calendar-day p-1 text-center position-relative rounded-3 transition ${isToday(day) ? 'today bg-primary bg-opacity-25 text-white fw-bold shadow-sm' : 'hover-bg-light cursor-pointer'}`}
                  style={{ height: '45px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <span className="small">{day}</span>
                  {hasTasks && !isToday(day) && (
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-1 d-flex gap-1">
                      <div className="rounded-circle bg-primary" style={{ width: '4px', height: '4px' }}></div>
                    </div>
                  )}
                  {isToday(day) && (
                    <div className="position-absolute top-0 end-0 mt-1 me-1">
                        <div className="pulse-indicator bg-white" style={{ width: '6px', height: '6px', borderRadius: '50%' }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .hover-bg-light:hover { background-color: #f8fafc; }
        .x-small { font-size: 10px; }
        .pulse-indicator {
          animation: pulse-white 2s infinite;
        }
        @keyframes pulse-white {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}</style>
    </div>
  );
};

export default DashboardCalendar;