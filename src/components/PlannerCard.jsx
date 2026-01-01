import React from 'react';
import styles from '../styles/PlannerCard.module.css';

const PlannerCard = ({ planner, color, onClick }) => {
  const taskCount = planner.tasks?.length || 0;
  const completedTasks = planner.tasks?.filter(task => task.completed).length || 0;

  return (
    <div 
      className={`${styles.card} ${styles[color]}`}
      onClick={onClick}
    >
      <p className={styles.tip}>{planner.title}</p>
      <p className={styles.secondText}>
        {taskCount} tasks • {completedTasks} completed
      </p>
    </div>
  );
};

export default PlannerCard;