import React from 'react';
import styles from '../styles/Slider.module.css';

const Slider = ({ 
  min = 0, 
  max = 100, 
  value, 
  onChange, 
  step = 1, 
  label, 
  showValue = true,
  disabled = false,
  className = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`${styles.sliderContainer} ${className}`}>
      {label && (
        <div className={styles.labelContainer}>
          <label className={styles.label}>{label}</label>
          {showValue && <span className={styles.value}>{value}</span>}
        </div>
      )}
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={styles.slider}
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${percentage}%, #374151 ${percentage}%, #374151 100%)`
          }}
        />
      </div>
    </div>
  );
};

export default Slider;