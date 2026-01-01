import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedInput from './AnimatedInput';
import GlitchButton from './GlitchButton';
import styles from '../styles/TaskInput.module.css';

const TaskInput = ({ onSubmit }) => {
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState(7);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim()) {
      onSubmit(goal, days);
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className={styles.headline}>What do you want to achieve?</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <AnimatedInput
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What's in your mind?"
            autoFocus
          />
        </div>
        
        <div className={styles.controls}>
          <div className={styles.daysControl}>
            <label>Duration (Days)</label>
            <input 
              type="number" 
              min="1" 
              max="30" 
              value={days} 
              onChange={(e) => setDays(parseInt(e.target.value))}
              className={styles.numberInput}
            />
          </div>
          
          <GlitchButton onClick={handleSubmit}>
            LETS GO
          </GlitchButton>
        </div>
      </form>
    </motion.div>
  );
};


export default TaskInput;
