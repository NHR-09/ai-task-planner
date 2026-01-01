import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DayDetailModal from './DayDetailModal';
import styles from '../styles/CalendarView.module.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CalendarView = ({ plan, allPlans, onPlannerSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: '', isCurrentMonth: false, isToday: false, event: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const event = getPlanEvent(day);
      
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        event
      });
    }
    
    return days;
  };

  const getPlanEvent = (day) => {
    if (!plan) return null;
    
    const today = new Date();
    const planStartDate = new Date(today);
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    const daysDiff = Math.floor((targetDate - planStartDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff < plan.totalDays) {
      const planDay = plan.days[daysDiff];
      return {
        label: `Day ${daysDiff + 1}`,
        title: planDay?.title || '',
        tasks: planDay?.tasks || []
      };
    }
    
    return null;
  };

  const getPlannersForDay = (day) => {
    if (!allPlans || !day) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    targetDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));
    
    return allPlans.filter(p => {
      if (daysDiff >= 0 && daysDiff < p.totalDays && p.days[daysDiff]) {
        return true;
      }
      return false;
    }).map(p => ({
      ...p,
      dayData: p.days[daysDiff],
      title: p.days[daysDiff]?.title || `Day ${daysDiff + 1}`,
      tasks: p.days[daysDiff]?.tasks || []
    }));
  };

  const handleDayClick = (day) => {
    if (!day || !allPlans) return;
    console.log('Day clicked:', day);
    const plannersForDay = getPlannersForDay(day);
    console.log('Planners for day:', plannersForDay);
    
    setSelectedDay({
      day,
      date: `${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`,
      planners: plannersForDay
    });
  };

  const handlePlannerClick = (planner) => {
    onPlannerSelect?.(planner.id);
    setSelectedDay(null);
  };

  const calendarDays = getDaysInMonth(currentDate);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={() => navigateMonth(-1)}>
            <ChevronLeft size={20} />
          </button>
          <button className={styles.navBtn} onClick={() => navigateMonth(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.dayHeader}>{day}</div>
        ))}
        
        {calendarDays.map((date, index) => {
          const hasPlanner = date.isCurrentMonth ? getPlannersForDay(date.day).length > 0 : false;
          return (
            <div 
              key={index} 
              className={`${styles.dayCell} ${!date.isCurrentMonth ? styles.dimmed : ''} ${date.isToday ? styles.today : ''} ${hasPlanner ? styles.hasPlanner : ''}`}
              onClick={() => date.isCurrentMonth && handleDayClick(date.day)}
            >
              <span className={styles.dateNumber}>{date.day}</span>
              {date.event && (
                <div className={styles.eventBadge}>
                  <div className={styles.eventContent}>
                    <span className={styles.eventLabel}>{date.event.label}</span>
                    <span className={styles.eventTitle}>{date.event.title}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {!plan && (
        <div className={styles.noPlan}>
          <p>Select a planner to view it on the calendar</p>
        </div>
      )}
      
      <AnimatePresence>
        {selectedDay && (
          <DayDetailModal
            date={selectedDay.date}
            planners={selectedDay.planners}
            onClose={() => setSelectedDay(null)}
            onPlannerClick={handlePlannerClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;