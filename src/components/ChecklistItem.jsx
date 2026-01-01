import React from 'react';
import { motion } from 'framer-motion';
import Checkbox from './Checkbox';
import styles from '../styles/DayCard.module.css';

const ChecklistItem = ({ task, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.text);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setEditText(task.text);
  }, [task.text]);


  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div 
      className={`${styles.checklistItem} ${task.completed ? styles.completed : ''}`}
      layout
    >
      <div>
        <Checkbox 
          id={`checkbox-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
      </div>
      
      {isEditing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={styles.editInput}
        />
      ) : (
        <span 
          className={styles.taskText}
          onClick={() => setIsEditing(true)}
          title="Click to edit"
        >
          {task.text}
        </span>
      )}

      <button 
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        ×
      </button>
    </motion.div>
  );
};

export default ChecklistItem;
