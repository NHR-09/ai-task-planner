import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import SaveButton from './SaveButton';
import styles from '../styles/ManualPlanner.module.css';

const ManualPlanner = ({ onSave, onCancel }) => {
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState([]);

  const addDay = () => {
    const newDay = {
      day: days.length + 1,
      title: `Day ${days.length + 1}`,
      tasks: []
    };
    setDays([...days, newDay]);
  };

  const addTask = (dayIndex) => {
    const newTask = {
      id: Date.now().toString(),
      text: '',
      completed: false
    };
    const updatedDays = [...days];
    updatedDays[dayIndex].tasks.push(newTask);
    setDays(updatedDays);
  };

  const updateTask = (dayIndex, taskIndex, text) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].tasks[taskIndex].text = text;
    setDays(updatedDays);
  };

  const removeTask = (dayIndex, taskIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].tasks.splice(taskIndex, 1);
    setDays(updatedDays);
  };

  const updateDayTitle = (dayIndex, title) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].title = title;
    setDays(updatedDays);
  };

  const handleSave = () => {
    if (!goal.trim() || days.length === 0) return;
    
    const plan = {
      id: Date.now().toString(),
      goal: goal.trim(),
      totalDays: days.length,
      days
    };
    onSave(plan);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h2>Create Custom Planner</h2>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={styles.goalInput}>
        <label>Goal</label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What do you want to achieve?"
          className={styles.input}
        />
      </div>

      <div className={styles.daysContainer}>
        {days.map((day, dayIndex) => (
          <div key={day.day} className={styles.dayCard}>
            <input
              type="text"
              value={day.title}
              onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
              className={styles.dayTitle}
            />
            
            <div className={styles.tasks}>
              {day.tasks.map((task, taskIndex) => (
                <div key={task.id} className={styles.taskRow}>
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => updateTask(dayIndex, taskIndex, e.target.value)}
                    placeholder="Enter task..."
                    className={styles.taskInput}
                  />
                  <button
                    onClick={() => removeTask(dayIndex, taskIndex)}
                    className={styles.removeBtn}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addTask(dayIndex)}
                className={styles.addTaskBtn}
              >
                <Plus size={14} />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={addDay} className={styles.addDayBtn}>
          <Plus size={16} />
          Add Day
        </button>
        
        <SaveButton 
          onClick={handleSave}
          disabled={!goal.trim() || days.length === 0}
        />
      </div>
    </motion.div>
  );
};

export default ManualPlanner;