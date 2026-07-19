import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      // Dispatch a custom event so non-react components (like Recharts) can optionally listen if needed
      window.dispatchEvent(new Event('themeChanged'));
      return newTheme;
    });
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="btn btn-outline"
      style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'var(--glass-border)' }}
      title="Toggle Dark/Light Mode"
    >
      {isDark ? <Sun size={18} color="var(--accent)" /> : <Moon size={18} color="var(--primary)" />}
    </button>
  );
};

export default ThemeToggle;
