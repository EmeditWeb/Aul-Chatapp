import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer', padding: '10px', position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      {theme === 'light' ? <BulbOutlined style={{ fontSize: '24px', color: '#fff' }} /> : <BulbFilled style={{ fontSize: '24px', color: 'yellow' }} />}
    </div>
  );
};

export default ThemeToggle;
