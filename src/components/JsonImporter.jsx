import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Copy } from 'lucide-react';
import SaveButton from './SaveButton';
import ActionButton from './ActionButton';
import styles from '../styles/JsonImporter.module.css';

const EXAMPLE_JSON = `{
  "goal": "Learn React fundamentals",
  "totalDays": 7,
  "days": [
    {
      "day": 1,
      "title": "Setup and JSX Basics",
      "tasks": [
        { "id": "d1_t1", "text": "Install Node.js and create-react-app", "completed": false },
        { "id": "d1_t2", "text": "Learn JSX syntax and basic components", "completed": false },
        { "id": "d1_t3", "text": "Create your first React component", "completed": false }
      ]
    },
    {
      "day": 2,
      "title": "Props and State",
      "tasks": [
        { "id": "d2_t1", "text": "Understand props and how to pass data", "completed": false },
        { "id": "d2_t2", "text": "Learn useState hook for state management", "completed": false },
        { "id": "d2_t3", "text": "Build a counter component with state", "completed": false }
      ]
    }
  ]
}`;

const JsonImporter = ({ onImport, onCancel }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const validateAndPreview = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Validate structure
      if (!parsed.goal || !parsed.totalDays || !Array.isArray(parsed.days)) {
        throw new Error('Invalid structure: missing goal, totalDays, or days array');
      }
      
      // Add ID if missing
      if (!parsed.id) {
        parsed.id = Date.now().toString();
      }
      
      setPreview(parsed);
      setError('');
    } catch (err) {
      setError(err.message);
      setPreview(null);
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
    }
  };

  const copyExample = () => {
    navigator.clipboard.writeText(EXAMPLE_JSON);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h2>Import JSON Planner</h2>
        <button onClick={onCancel} className={styles.closeBtn}>
          <X size={16} />
        </button>
      </div>

      <div className={`${styles.inputSection} ${styles.borderBeam}`}>
        <div className={styles.labelRow}>
          <label>Paste JSON Plan:</label>
          <ActionButton onClick={copyExample}>
            <Copy size={14} style={{marginRight: '0.375rem'}} />
            Copy Example
          </ActionButton>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={EXAMPLE_JSON}
          className={styles.textarea}
          rows={12}
        />
        
        <div className={styles.actions}>
          <ActionButton onClick={validateAndPreview}>
            Validate & Preview
          </ActionButton>
        </div>

        {error && (
          <div className={styles.error}>
            Error: {error}
          </div>
        )}
      </div>

      {preview && (
        <div className={`${styles.preview} ${styles.borderBeam}`}>
          <h3>Preview</h3>
          <div className={styles.previewContent}>
            <p><strong>Goal:</strong> {preview.goal}</p>
            <p><strong>Duration:</strong> {preview.totalDays} days</p>
            <p><strong>Days:</strong> {preview.days.length}</p>
            <p><strong>Total Tasks:</strong> {preview.days.reduce((sum, day) => sum + day.tasks.length, 0)}</p>
          </div>
          
          <SaveButton onClick={handleImport} />
        </div>
      )}
    </motion.div>
  );
};

export default JsonImporter;