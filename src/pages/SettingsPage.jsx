import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { User, Bell, Palette, Database, LogOut, Trash2, Volume2 } from 'lucide-react';
import ActionButton from '../components/ActionButton';
import Slider from '../components/Slider';
import styles from '../styles/SettingsPage.module.css';

const SettingsPage = ({ user, onLogout }) => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [volume, setVolume] = useState(75);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);
  const [notificationFreq, setNotificationFreq] = useState(5);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      console.log('Delete account');
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1>Settings</h1>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <User size={20} />
          <h2>Profile</h2>
        </div>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h3>{user?.displayName || 'User'}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Bell size={20} />
          <h2>Notifications</h2>
        </div>
        <div className={styles.setting}>
          <span>Push Notifications</span>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <Slider
          label="Notification Frequency (minutes)"
          min={1}
          max={60}
          value={notificationFreq}
          onChange={setNotificationFreq}
          step={1}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Palette size={20} />
          <h2>Appearance</h2>
        </div>
        <div className={styles.setting}>
          <span>Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={styles.select}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Volume2 size={20} />
          <h2>Audio</h2>
        </div>
        <Slider
          label="Volume"
          min={0}
          max={100}
          value={volume}
          onChange={setVolume}
          step={5}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Database size={20} />
          <h2>Data</h2>
        </div>
        <div className={styles.setting}>
          <span>Auto-save Plans</span>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <Slider
          label="Auto-save Interval (seconds)"
          min={10}
          max={300}
          value={autoSaveInterval}
          onChange={setAutoSaveInterval}
          step={10}
          disabled={!autoSave}
        />
      </div>

      <div className={styles.actions}>
        <ActionButton onClick={handleSignOut}>
          <LogOut size={16} style={{marginRight: '0.5rem'}} />
          Sign Out
        </ActionButton>
        
        <button onClick={handleDeleteAccount} className={styles.deleteBtn}>
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
    </motion.div>
  );
};

export default SettingsPage;