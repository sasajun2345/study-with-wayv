import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudyRoom from './pages/StudyRoom';
import FloatingTimer from './components/FloatingTimer';
import TimerManager from './components/TimerManager';
import { useAppStore } from './store/appStore';
import { useEffect } from 'react';

function App() {
  const { preferences } = useAppStore();

  useEffect(() => {
    const full = document.title;
    let index = full.length;
    let deleting = true;
    let timeoutId: number | undefined;

    const step = () => {
      if (deleting) {
        index = Math.max(0, index - 1);
        document.title = full.slice(0, index);
        if (index === 0) {
          deleting = false;
          timeoutId = window.setTimeout(step, 600);
          return;
        }
        timeoutId = window.setTimeout(step, 60);
      } else {
        index = Math.min(full.length, index + 1);
        document.title = full.slice(0, index);
        if (index === full.length) {
          deleting = true;
          timeoutId = window.setTimeout(step, 1200);
          return;
        }
        timeoutId = window.setTimeout(step, 100);
      }
    };

    step();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 transition-colors duration-300`}>
      <TimerManager />
      <FloatingTimer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study/:memberId" element={<StudyRoom />} />
      </Routes>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-slate-800 text-white',
          style: {
            background: preferences.theme === 'dark' ? '#1e293b' : '#ffffff',
            color: preferences.theme === 'dark' ? '#ffffff' : '#000000',
          }
        }}
      />
    </div>
  );
}

export default App;
