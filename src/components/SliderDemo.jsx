import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Slider from '../components/Slider';
import styles from '../styles/SliderDemo.module.css';

const SliderDemo = () => {
  const [basicValue, setBasicValue] = useState(50);
  const [volumeValue, setVolumeValue] = useState(75);
  const [temperatureValue, setTemperatureValue] = useState(22);
  const [progressValue, setProgressValue] = useState(30);
  const [priceValue, setPriceValue] = useState(250);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1>Slider Component Demo</h1>
      
      <div className={styles.demoSection}>
        <h2>Basic Slider</h2>
        <Slider
          label="Basic Range"
          min={0}
          max={100}
          value={basicValue}
          onChange={setBasicValue}
        />
      </div>

      <div className={styles.demoSection}>
        <h2>Volume Control</h2>
        <Slider
          label="Volume"
          min={0}
          max={100}
          value={volumeValue}
          onChange={setVolumeValue}
          step={5}
        />
      </div>

      <div className={styles.demoSection}>
        <h2>Temperature</h2>
        <Slider
          label="Temperature (°C)"
          min={-10}
          max={40}
          value={temperatureValue}
          onChange={setTemperatureValue}
          step={0.5}
        />
      </div>

      <div className={styles.demoSection}>
        <h2>Progress Indicator</h2>
        <Slider
          label="Progress"
          min={0}
          max={100}
          value={progressValue}
          onChange={setProgressValue}
          showValue={false}
        />
        <div className={styles.progressText}>
          {progressValue}% Complete
        </div>
      </div>

      <div className={styles.demoSection}>
        <h2>Price Range</h2>
        <Slider
          label="Budget ($)"
          min={0}
          max={1000}
          value={priceValue}
          onChange={setPriceValue}
          step={25}
        />
      </div>

      <div className={styles.demoSection}>
        <h2>Disabled Slider</h2>
        <Slider
          label="Disabled"
          min={0}
          max={100}
          value={60}
          onChange={() => {}}
          disabled={true}
        />
      </div>
    </motion.div>
  );
};

export default SliderDemo;