import React from 'react';
import { motion } from 'framer-motion';
import ChecklistItem from './ChecklistItem';
import styles from '../styles/DayCard.module.css';

const DayCard = ({ day, onToggleTask, onEditTask, onDeleteTask, onAddTask, index }) => {
  const allFormatted = day.tasks.length > 0 && day.tasks.every(t => t.completed);

  return (
    <motion.div 
      className={`${styles.card} anime-day-card ${allFormatted ? styles.dayCompleted : ''}`}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
    >
      {allFormatted && (
        <svg className={styles.pencilStrike} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L100 0" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <div className={styles.header}>
        <div className={styles.dayNumber}>Day {day.day}</div>
        <div className={styles.themeBadge}>{day.theme}</div>
      </div>
      <div className={styles.taskList}>
        {day.tasks.map(task => (
          <ChecklistItem 
            key={task.id} 
            task={task} 
            onToggle={onToggleTask} 
            onEdit={(taskId, newText) => onEditTask(day.day, taskId, newText)}
            onDelete={(taskId) => onDeleteTask(day.day, taskId)}
          />
        ))}
        <button 
          className={styles.addTaskBtn}
          onClick={() => onAddTask(day.day)}
        >
          + Add Task
        </button>
      </div>
    </motion.div>
  );
};

export default DayCard;
