import React from 'react';
import DayCard from './DayCard';
import styles from '../styles/Timeline.module.css';
import { useAnimeEntry } from '../hooks/useAnime';
import ProgressBar from './ProgressBar';

const Timeline = ({ plan, onToggleTask, onEditTask, onDeleteTask, onAddTask }) => {
  useAnimeEntry('.anime-day-card', 300);

  const totalTasks = plan.days.reduce((acc, day) => acc + day.tasks.length, 0);
  const completedTasks = plan.days.reduce((acc, day) => 
    acc + day.tasks.filter(t => t.completed).length, 0
  );

  return (
    <div className={styles.timelineContainer}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h2 className={styles.goalTitle}>{plan.goal}</h2>
          <span className={styles.durationBadge}>{plan.duration} Days</span>
        </div>
        <ProgressBar total={totalTasks} completed={completedTasks} />
      </header>
      
      <div className={styles.grid}>
        {plan.days.map((day, index) => (
          <DayCard 
            key={day.day} 
            day={day} 
            index={index} 
            onToggleTask={(taskId) => onToggleTask(day.day, taskId)} 
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
