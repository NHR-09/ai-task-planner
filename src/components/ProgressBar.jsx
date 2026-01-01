import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/ProgressBar.module.css';

const ProgressBar = ({ total, completed }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
      <div className={styles.track}>
        <motion.div 
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
