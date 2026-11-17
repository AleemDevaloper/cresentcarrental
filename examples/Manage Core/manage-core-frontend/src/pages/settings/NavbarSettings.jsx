import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { EnableDisableButton } from '../../components/common';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClock, 
  faMoon, 
  faBell, 
  faGrip, 
  faGlobe,
  faRobot,
  faCheckCircle,
  faLayerGroup,
  faBrush,
  faSave,
  faEye,
  faDownload
} from "@fortawesome/free-solid-svg-icons";

const NavbarSettings = () => {
  const { t } = useTranslation();
  const { 
    navbarSettings, 
    setNavbarSettings, 
    themeStyle, 
    setThemeStyle,
    navbarBehavior,
    setNavbarBehavior,
    aiCopilotEnabled,
    setAiCopilotEnabled,
    addNotification 
  } = useApp();

  const renderEnableSwitch = (checked, onClick, label) => (
    <EnableDisableButton
      checked={checked}
      onClick={onClick}
      label={label}
    />
  );

  // Local state for pending changes
  const [localSettings, setLocalSettings] = useState(navbarSettings);
  const [localThemeStyle, setLocalThemeStyle] = useState(themeStyle);
  const [localNavbarBehavior, setLocalNavbarBehavior] = useState(navbarBehavior);
  const [isDirty, setIsDirty] = useState(false);

  // Sync with global state if it changes elsewhere
  useEffect(() => {
    setLocalSettings(navbarSettings);
  }, [navbarSettings]);

  useEffect(() => {
    setLocalThemeStyle(themeStyle);
  }, [themeStyle]);

  useEffect(() => {
    setLocalNavbarBehavior(navbarBehavior);
  }, [navbarBehavior]);

  const toggleSetting = (key) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setIsDirty(true);
  };

  const handleThemeChange = (style) => {
    setLocalThemeStyle(style);
    setIsDirty(true);
  };

  const handleBehaviorChange = (behavior) => {
    setLocalNavbarBehavior(behavior);
    setIsDirty(true);
  };

  const handleSave = () => {
    setNavbarSettings(localSettings);
    setThemeStyle(localThemeStyle);
    setNavbarBehavior(localNavbarBehavior);
    setIsDirty(false);
    
    if (addNotification) {
      addNotification(t('navbar_config_saved') || 'Navbar settings saved successfully.', "success");
    }
  };

  const settingsConfig = [
    { 
      key: 'showTime', 
      label: t('session_time'), 
      desc: t('session_time_desc'),
      icon: faClock,
      color: 'text-primary'
    },
    { 
      key: 'showThemeToggle', 
      label: t('theme_switcher'), 
      desc: t('theme_switcher_desc'),
      icon: faMoon,
      color: 'text-warning'
    },
    { 
      key: 'showNotifications', 
      label: t('notification_center'), 
      desc: t('notification_center_desc'),
      icon: faBell,
      color: 'text-danger'
    },
    { 
      key: 'showSystems', 
      label: t('systems_dropdown'), 
      desc: t('systems_dropdown_desc'),
      icon: faGrip,
      color: 'text-info'
    },
    { 
      key: 'showLanguage', 
      label: t('language_selector'), 
      desc: t('language_selector_desc'),
      icon: faGlobe,
      color: 'text-success'
    },
    { 
      key: 'showPWAInstall', 
      label: 'PWA Install Button', 
      desc: 'Show or hide the PWA application install shortcut button in header.',
      icon: faDownload,
      color: 'text-primary'
    },
  ];

  return (
    <div className="container py-4 fade-in">
      <div className="row justify-content-center">
        <div className="col-xl-12">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">{t('navbar_configuration')}</h4>
              <p className="text-muted small mb-0">{t('navbar_config_desc_long')}</p>
            </div>
            {isDirty && (
              <button 
                className="btn btn-primary rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm animate-bounce-in"
                onClick={handleSave}
              >
                <FontAwesomeIcon icon={faSave} />
                <span>{t('save_changes')}</span>
              </button>
            )}
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-3">{t('components_visibility')}</h6>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4 settings-panel">
              <div className="card-body p-0">
                {settingsConfig.map((setting, index) => (
                  <div 
                    key={setting.key} 
                    className={`p-4 d-flex align-items-center justify-content-between transition-all ${index !== settingsConfig.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className={`p-3 rounded-3 bg-light ${setting.color}`}>
                        <FontAwesomeIcon icon={setting.icon} size="lg" />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{setting.label}</h6>
                        <p className="text-muted small mb-0" style={{ maxWidth: '400px' }}>{setting.desc}</p>
                      </div>
                    </div>
                    {renderEnableSwitch(localSettings[setting.key], () => toggleSetting(setting.key), setting.label)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-3">{t('ai_features')}</h6>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4 settings-panel">
              <div className="card-body p-0">
                <div className="p-4 d-flex align-items-center justify-content-between transition-all">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-3 bg-light text-info">
                      <FontAwesomeIcon icon={faRobot} size="lg" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{t('ai_copilot')}</h6>
                      <p className="text-muted small mb-0" style={{ maxWidth: '400px' }}>{t('ai_copilot_desc')}</p>
                    </div>
                  </div>
                  {renderEnableSwitch(aiCopilotEnabled, () => setAiCopilotEnabled(!aiCopilotEnabled), t('ai_copilot'))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-3">{t('visual_style')}</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div 
                  className={`card border-2 cursor-pointer transition-all rounded-4 h-100 ${localThemeStyle === 'simple' ? 'border-primary shadow-sm bg-primary bg-opacity-10' : 'border-light bg-white opacity-75'}`}
                  onClick={() => handleThemeChange('simple')}
                >
                  <div className="card-body p-4 text-center">
                    <div className={`mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center ${localThemeStyle === 'simple' ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: 50, height: 50 }}>
                      <FontAwesomeIcon icon={faBrush} />
                    </div>
                    <h6 className="fw-bold mb-2">{t('simple_style')}</h6>
                    <p className="text-muted x-small mb-0">{t('simple_style_desc')}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div 
                  className={`card border-2 cursor-pointer transition-all rounded-4 h-100 ${localThemeStyle === 'glassmorphism' ? 'border-primary shadow-sm bg-primary bg-opacity-10' : 'border-light bg-white opacity-75'}`}
                  onClick={() => handleThemeChange('glassmorphism')}
                >
                  <div className="card-body p-4 text-center">
                    <div className={`mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center ${localThemeStyle === 'glassmorphism' ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: 50, height: 50 }}>
                      <FontAwesomeIcon icon={faLayerGroup} />
                    </div>
                    <h6 className="fw-bold mb-2">{t('glassmorphism')}</h6>
                    <p className="text-muted x-small mb-0">{t('glassmorphism_desc')}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div 
                  className={`card border-2 cursor-pointer transition-all rounded-4 h-100 ${localThemeStyle === 'view-style' ? 'border-primary shadow-sm bg-primary bg-opacity-10' : 'border-light bg-white opacity-75'}`}
                  onClick={() => handleThemeChange('view-style')}
                >
                  <div className="card-body p-4 text-center">
                    <div className={`mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center ${localThemeStyle === 'view-style' ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: 50, height: 50 }}>
                      <FontAwesomeIcon icon={faEye} />
                    </div>
                    <h6 className="fw-bold mb-2">{t('view_style')}</h6>
                    <p className="text-muted x-small mb-0">{t('view_style_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-3">{t('navbar_behavior')}</h6>
            <div className="row g-3">
              {[
                { id: 'sticky', label: t('sticky'), desc: t('sticky_desc') },
                { id: 'static', label: t('static'), desc: t('static_desc') },
                { id: 'hidden', label: t('hidden'), desc: t('hidden_desc') }
              ].map((behavior) => (
                <div key={behavior.id} className="col-md-4">
                  <div 
                    className={`card border-2 cursor-pointer transition-all rounded-4 h-100 ${localNavbarBehavior === behavior.id ? 'border-primary shadow-sm bg-primary bg-opacity-10' : 'border-light bg-white opacity-75'}`}
                    onClick={() => handleBehaviorChange(behavior.id)}
                  >
                    <div className="card-body p-3 text-center">
                      <h6 className="fw-bold mb-1">{behavior.label}</h6>
                      <p className="text-muted x-small mb-0">{behavior.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 d-flex align-items-center gap-3">
            <div className="text-primary"><FontAwesomeIcon icon={faCheckCircle} /></div>
            <p className="text-dark small mb-0 fw-medium">
              {t('changes_apply_after_save')}
            </p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .cursor-pointer { cursor: pointer; }
        .animate-bounce-in {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default NavbarSettings;
