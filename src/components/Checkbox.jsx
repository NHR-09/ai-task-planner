import React from 'react';
import styles from '../styles/Checkbox.module.css';

const Checkbox = ({ checked, onChange, id, label }) => {
  return (
    <div className={styles.checkboxWrapper}>
      <input 
        type="checkbox" 
        className={styles.check} 
        id={id} 
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.label}>
        <svg width={45} height={45} viewBox="0 0 95 95">
          <rect x={30} y={20} width={50} height={50} stroke="var(--accent-color)" fill="none" />
          <g transform="translate(0,-952.36222)">
            <path 
              d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4" 
              stroke="var(--accent-color)" 
              strokeWidth={3} 
              fill="none" 
              className={styles.path1} 
            />
          </g>
        </svg>
        {label && <span>{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
