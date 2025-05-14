import React, { useState, useEffect, useCallback } from 'react';
import { FaBell, FaLock, FaShieldAlt } from 'react-icons/fa';
import { skillsAPI } from '../services/skillsAPI';
import { useAuth } from '../context/AuthContext';
import '../styles/settings.css';

const Settings = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      emailUpdates: true,
      courseReminders: true,
      newMessages: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true,
      allowMessaging: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      loginAlerts: true
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  const fetchSettings = useCallback(async () => {
    if (!currentUser?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await skillsAPI.getUserSettings(currentUser._id);
      console.log('Settings data received:', data);
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!currentUser?._id) return;

    try {
      setSaveStatus('saving');
      await skillsAPI.updateUserSettings(currentUser._id, settings);
      setSaveStatus('saved');
      setError(null);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError('Failed to save settings');
      setSaveStatus('error');
      console.error('Error saving settings:', err);
    }
  };

  const handleReset = () => {
    fetchSettings();
  };

  if (!currentUser) {
    return <div className="error">Please log in to view your settings</div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchSettings}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Notifications Section */}
      <section className="settings-section">
        <div className="section-header">
          <FaBell />
          <h2>Notification Preferences</h2>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.emailUpdates}
                onChange={() => handleNotificationChange('emailUpdates')}
              />
              Email Updates
            </label>
            <p>Receive updates about your courses and learning progress</p>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.courseReminders}
                onChange={() => handleNotificationChange('courseReminders')}
              />
              Course Reminders
            </label>
            <p>Get reminded about upcoming lessons and deadlines</p>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.newMessages}
                onChange={() => handleNotificationChange('newMessages')}
              />
              New Messages
            </label>
            <p>Receive notifications for new messages and mentions</p>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.marketingEmails}
                onChange={() => handleNotificationChange('marketingEmails')}
              />
              Marketing Emails
            </label>
            <p>Receive updates about new courses and features</p>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="settings-section">
        <div className="section-header">
          <FaLock />
          <h2>Privacy Settings</h2>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="connections">Connections Only</option>
            </select>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.showEmail}
                onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
              />
              Show Email Address
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.showLocation}
                onChange={(e) => handlePrivacyChange('showLocation', e.target.checked)}
              />
              Show Location
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.allowMessaging}
                onChange={(e) => handlePrivacyChange('allowMessaging', e.target.checked)}
              />
              Allow Direct Messages
            </label>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="settings-section">
        <div className="section-header">
          <FaShieldAlt />
          <h2>Security Options</h2>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
              />
              Two-Factor Authentication
            </label>
            <p>Add an extra layer of security to your account</p>
          </div>
          <div className="setting-item">
            <label>Session Timeout</label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.security.loginAlerts}
                onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
              />
              Login Alerts
            </label>
            <p>Get notified of new login attempts</p>
          </div>
        </div>
      </section>

      <div className="settings-actions">
        <button 
          className={`btn btn-primary ${saveStatus === 'saving' ? 'loading' : ''}`}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 
           saveStatus === 'saved' ? 'Saved!' : 
           'Save Changes'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleReset}
        >
          Reset to Defaults
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Settings; 