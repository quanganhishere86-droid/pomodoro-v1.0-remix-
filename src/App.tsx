/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Monitor, Coffee, Bell, CheckSquare, Check, Trash2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import YouTube from 'react-youtube';
// To use an uploaded image, ensure it is in the /src/assets/images folder and import it here:
import frutigerBg from './assets/images/1375142.png';
import sunsetBg from './assets/images/e398310ac0qg1.png';
import albumArt from './assets/images/frutiger_aero_album_art_1789057557691.jpg';
import appLogo from './assets/images/logo.png';

// Timer presets (All strictly total to 120 minutes / 2 hours)
const PRESETS = [
  { id: 'classic', label: { en: 'Classic 25/5', vi: 'Cơ bản 25/5', cn: '经典 25/5', 'zh-Hant': '經典 25/5', fr: 'Classique 25/5' }, work: 25 * 60, break: 5 * 60, cycles: 4 },
  { id: 'deep', label: { en: 'Deep Work 50/10', vi: 'Tập trung sâu 50/10', cn: '深度工作 50/10', 'zh-Hant': '深度工作 50/10', fr: 'Travail Profond 50/10' }, work: 50 * 60, break: 10 * 60, cycles: 2 },
  { id: 'sprint', label: { en: 'Sprint 15/5', vi: 'Chạy nước rút 15/5', cn: '冲刺 15/5', 'zh-Hant': '衝刺 15/5', fr: 'Sprint 15/5' }, work: 15 * 60, break: 5 * 60, cycles: 6 },
];

// Translations
type Language = 'en' | 'vi' | 'cn' | 'zh-Hant' | 'fr';
const TRANSLATIONS = {
  en: {
    inputPlaceholder: 'Write to autotick!',
    session: 'POMODORO SESSION',
    cycles: 'Cycles',
    cycle: 'Cycle',
    learn: 'Learn',
    relax: 'Relax',
    playlist: 'Focus Playlist',
    todo: 'To-Do List',
    addTask: 'Add a new task...',
    addBtn: 'Add',
    noTasks: 'No tasks yet. Add one!',
    breakTitle: 'Break Time!',
    breakBody: 'Great job focusing. Time to relax and recharge.',
    doneTitle: 'All Done!',
    doneBody: "You've completed your session!",
    focusTitle: 'Focus Time!',
    focusBody: "Break is over. Let's get back to learning.",
    taskNotFound: "This task isn't in the to-do list.",
    completed: 'Completed',
    active: 'Active',
    upcoming: 'Upcoming',
    langName: 'English',
    reportBug: 'Report a bug',
    bugReportTitle: 'Bug Reporter',
    bugReportDesc: 'Describe what happened:',
    bugReportSubmit: 'Submit Report',
    bugReportSuccess: 'Bug reported successfully!',
    bugReportsList: 'Reported Bugs',
    bugNoReports: 'No bugs reported yet.',
  },
  vi: {
    inputPlaceholder: 'Hãy viết tên môn bạn hoàn thành để autotick!',
    session: 'PHIÊN POMODORO',
    cycles: 'Chu kỳ',
    cycle: 'Chu kỳ',
    learn: 'Học',
    relax: 'Nghỉ ngơi',
    playlist: 'Nhạc tập trung',
    todo: 'Danh sách công việc',
    addTask: 'Thêm công việc mới...',
    addBtn: 'Thêm',
    noTasks: 'Chưa có công việc nào. Hãy thêm một cái!',
    breakTitle: 'Giờ nghỉ!',
    breakBody: 'Làm tốt lắm. Đến lúc nghỉ ngơi và nạp lại năng lượng.',
    doneTitle: 'Hoàn thành!',
    doneBody: 'Bạn đã hoàn thành phiên làm việc của mình!',
    focusTitle: 'Đến giờ tập trung!',
    focusBody: 'Đã hết giờ nghỉ. Quay lại làm việc nào.',
    taskNotFound: 'Công việc này không có trong danh sách.',
    completed: 'Đã xong',
    active: 'Đang chạy',
    upcoming: 'Sắp tới',
    langName: 'Tiếng Việt',
    reportBug: 'Báo lỗi',
    bugReportTitle: 'Báo Lỗi',
    bugReportDesc: 'Mô tả vấn đề bạn gặp phải:',
    bugReportSubmit: 'Gửi Báo Cáo',
    bugReportSuccess: 'Đã gửi báo lỗi thành công!',
    bugReportsList: 'Các lỗi đã báo',
    bugNoReports: 'Chưa có lỗi nào được báo.',
  },
  cn: {
    inputPlaceholder: '写入自动勾选！',
    session: '番茄工作法会话',
    cycles: '循环',
    cycle: '循环',
    learn: '学习',
    relax: '休息',
    playlist: '专注播放列表',
    todo: '待办事项',
    addTask: '添加新任务...',
    addBtn: '添加',
    noTasks: '还没有任务。添加一个吧！',
    breakTitle: '休息时间！',
    breakBody: '专注得不错。是时候休息充电了。',
    doneTitle: '全部完成！',
    doneBody: '您已完成您的会话！',
    focusTitle: '专注时间！',
    focusBody: '休息结束。让我们回到学习中去。',
    taskNotFound: '此任务不在待办事项列表中。',
    completed: '已完成',
    active: '进行中',
    upcoming: '即将开始',
    langName: '简体中文',
    reportBug: '报告问题',
    bugReportTitle: '报告问题',
    bugReportDesc: '描述发生的情况：',
    bugReportSubmit: '提交报告',
    bugReportSuccess: '错误报告提交成功！',
    bugReportsList: '已报告的问题',
    bugNoReports: '尚未报告任何问题。',
  },
  'zh-Hant': {
    inputPlaceholder: '寫入自動勾選！',
    session: '番茄鐘工作法',
    cycles: '循環',
    cycle: '循環',
    learn: '學習',
    relax: '休息',
    playlist: '專注播放清單',
    todo: '待辦事項',
    addTask: '新增任務...',
    addBtn: '新增',
    noTasks: '還沒有任務。新增一個吧！',
    breakTitle: '休息時間！',
    breakBody: '專注得不錯。是時候休息充電了。',
    doneTitle: '全部完成！',
    doneBody: '您已完成您的工作階段！',
    focusTitle: '專注時間！',
    focusBody: '休息結束。讓我們回到學習中去。',
    taskNotFound: '此任務不在待辦事項清單中。',
    completed: '已完成',
    active: '進行中',
    upcoming: '即將開始',
    langName: '繁體中文',
    reportBug: '回報問題',
    bugReportTitle: '回報問題',
    bugReportDesc: '描述發生的情況：',
    bugReportSubmit: '提交報告',
    bugReportSuccess: '錯誤報告提交成功！',
    bugReportsList: '已回報的問題',
    bugNoReports: '尚未回報任何問題。',
  },
  fr: {
    inputPlaceholder: 'Écrivez pour cocher!',
    session: 'SESSION POMODORO',
    cycles: 'Cycles',
    cycle: 'Cycle',
    learn: 'Apprendre',
    relax: 'Se relaxer',
    playlist: 'Playlist de concentration',
    todo: 'Liste de tâches',
    addTask: 'Ajouter une tâche...',
    addBtn: 'Ajouter',
    noTasks: 'Aucune tâche. Ajoutez-en une!',
    breakTitle: 'C\'est la pause!',
    breakBody: 'Excellent travail. Il est temps de se détendre.',
    doneTitle: 'Terminé!',
    doneBody: 'Vous avez terminé votre session!',
    focusTitle: 'Concentration!',
    focusBody: 'La pause est finie. Au travail!',
    taskNotFound: 'Cette tâche n\'est pas dans la liste.',
    completed: 'Terminé',
    active: 'En cours',
    upcoming: 'À venir',
    langName: 'Français',
    reportBug: 'Signaler un bug',
    bugReportTitle: 'Signaler un bug',
    bugReportDesc: 'Décrivez ce qui s\'est passé:',
    bugReportSubmit: 'Envoyer le rapport',
    bugReportSuccess: 'Bug signalé avec succès!',
    bugReportsList: 'Bugs signalés',
    bugNoReports: 'Aucun bug signalé pour le moment.',
  }
};

type ThemeType = 'blue' | 'orange';
const THEMES = {
  blue: {
    container: 'theme-blue',
    text: 'text-blue-900',
    textLight: 'text-blue-800',
    textMuted: 'text-blue-900/50',
    textMutedStrike: 'text-blue-900/40',
    ring: 'focus:ring-blue-300/40',
    placeholder: 'placeholder-blue-900/50',
    bgLight: 'bg-blue-900/20',
    btnActiveBg: 'bg-blue-500',
    btnActiveBorder: 'border-blue-500',
    btnInactiveBorder: 'border-blue-400',
    btnIconHover: 'text-blue-600',
    timerLearnColor: '#2989d8',
    timerRelaxColor: '#34d399',
  },
  orange: {
    container: 'theme-orange',
    text: 'text-orange-900',
    textLight: 'text-orange-800',
    textMuted: 'text-orange-900/50',
    textMutedStrike: 'text-orange-900/40',
    ring: 'focus:ring-orange-300/40',
    placeholder: 'placeholder-orange-900/50',
    bgLight: 'bg-orange-900/20',
    btnActiveBg: 'bg-orange-500',
    btnActiveBorder: 'border-orange-500',
    btnInactiveBorder: 'border-orange-400',
    btnIconHover: 'text-orange-600',
    timerLearnColor: '#ea580c',
    timerRelaxColor: '#f59e0b',
  },
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TimerRing = ({ time, maxTime, color, isActiveMode }: { time: number, maxTime: number, color: string, isActiveMode: boolean }) => {
  // If it's not the active mode, we want the ring to look full (0 progress).
  const percentage = isActiveMode ? ((maxTime - time) / maxTime) * 100 : 0;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r="45" fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="283"
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      {/* Inner Glossy Sphere */}
      <div className="absolute inset-2 rounded-full shadow-[inset_0_4px_12px_rgba(255,255,255,1),_inset_0_-8px_16px_var(--theme-glass-shadow)] bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center">
        <span className="timer-font text-5xl sm:text-6xl text-slate-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] tracking-tight">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('blue');
  const [lang, setLang] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const t = THEMES[currentTheme];
  const l = TRANSLATIONS[lang];

  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [workTime, setWorkTime] = useState(PRESETS[0].work);
  const [breakTime, setBreakTime] = useState(PRESETS[0].break);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [taskLabel, setTaskLabel] = useState('');
  const [taskNotFoundError, setTaskNotFoundError] = useState('');

  // Persisted To-Dos
  const [todos, setTodos] = useState<{id: string, text: string, completed: boolean}[]>(() => {
    try {
      const saved = localStorage.getItem('frutiger_pomodoro_todos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading todos from localStorage:', e);
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('frutiger_pomodoro_todos', JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos to localStorage:', e);
    }
  }, [todos]);
  
  const timerIntervalRef = useRef<number | null>(null);
  
  // Background music state (YouTube)
  const ytPlayerRef = useRef<any>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Sound effect for when the timer ends
  const endAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A pleasant chime/bell sound for when a timer completes
    const endAudio = new Audio("https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg");
    endAudio.volume = 0.5;
    endAudioRef.current = endAudio;
  }, []);

  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      console.log('Audio play prevented:', e);
    }
  };

  const playEndSound = () => {
    if (endAudioRef.current) {
      endAudioRef.current.currentTime = 0;
      endAudioRef.current.play().catch(e => console.log('Audio play prevented:', e));
    }
  };

  useEffect(() => {
    if (ytPlayerRef.current) {
      if (isActive) {
        ytPlayerRef.current.playVideo();
      } else {
        ytPlayerRef.current.pauseVideo();
      }
    }
  }, [isActive]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (ytPlayerRef.current) {
        try {
          const currentTime = await ytPlayerRef.current.getCurrentTime();
          const duration = await ytPlayerRef.current.getDuration();
          if (currentTime !== undefined && !isNaN(currentTime)) setAudioProgress(currentTime);
          if (duration !== undefined && !isNaN(duration) && duration > 0) setAudioDuration(duration);
        } catch (e) {
          // ignore
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const onYtReady = (event: any) => {
    ytPlayerRef.current = event.target;
    try {
      const dur = event.target.getDuration();
      if (dur && !isNaN(dur) && dur > 0) setAudioDuration(dur);
      const curr = event.target.getCurrentTime();
      if (curr !== undefined && !isNaN(curr)) setAudioProgress(curr);
    } catch (e) {}
    if (isActive) {
      event.target.playVideo();
    }
  };

  const onYtStateChange = (event: any) => {
    // If video ended, loop it from the beginning
    if (event.data === (window as any).YT?.PlayerState?.ENDED || event.data === 0) {
      event.target.seekTo(currentTheme === 'blue' ? 0 : 7340);
      if (isActive) {
        event.target.playVideo();
      }
    }
  };

  const formatAudioTime = (time: number) => {
    if (isNaN(time) || !isFinite(time) || time < 0) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSeekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ytPlayerRef.current || audioDuration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percent * audioDuration;
    try {
      ytPlayerRef.current.seekTo(newTime, true);
      setAudioProgress(newTime);
    } catch (err) {
      console.error("Seek error:", err);
    }
  };

  useEffect(() => {
    if (taskNotFoundError) {
      const timer = setTimeout(() => {
        setTaskNotFoundError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [taskNotFoundError]);

  // Request Notification permission
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        } else {
          alert("Please allow notifications in your browser settings to get alerts when the timer ends!");
        }
      });
    }
  };

  const notifyUser = (title: string, body: string) => {
    playEndSound();
    
    // Fallback to standard alert if notifications are disabled/denied
    if (!notificationsEnabled || Notification.permission !== 'granted') {
      setTimeout(() => alert(`${title}\n\n${body}`), 100);
      return;
    }

    try {
      new Notification(title, { body, icon: './icon.png' });
    } catch (e) {
      console.log("Browser blocked notification, falling back to alert", e);
      setTimeout(() => alert(`${title}\n\n${body}`), 100);
    }
  };

  // Work timer finished
  useEffect(() => {
    if (isActive && mode === 'work' && workTime <= 0) {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsActive(false);
      setMode('break');
      setBreakTime(activePreset.break);
      setWorkTime(activePreset.work);
      
      // Auto-tick matching task in to-do list
      if (taskLabel.trim() !== '') {
        const query = taskLabel.trim().toLowerCase();
        setTodos((prevTodos) => {
          const matchIdx = prevTodos.findIndex(t => !t.completed && t.text.trim().toLowerCase() === query);
          if (matchIdx !== -1) {
            const next = [...prevTodos];
            next[matchIdx] = { ...next[matchIdx], completed: true };
            return next;
          }
          return prevTodos;
        });
      }

      notifyUser(l.breakTitle, l.breakBody);
      
      if (ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(currentTheme === 'blue' ? 0 : 7340);
        ytPlayerRef.current.pauseVideo();
      }
    }
  }, [isActive, mode, workTime, activePreset, currentTheme, taskLabel, l]);

  // Break timer finished
  useEffect(() => {
    if (isActive && mode === 'break' && breakTime <= 0) {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsActive(false);
      setBreakTime(activePreset.break);
      
      const nextCycles = cyclesCompleted + 1;
      setCyclesCompleted(nextCycles);
      
      if (nextCycles >= activePreset.cycles) {
        notifyUser(l.doneTitle, l.doneBody);
        setMode('work');
        setWorkTime(activePreset.work);
      } else {
        setMode('work');
        setWorkTime(activePreset.work);
        notifyUser(l.focusTitle, l.focusBody);
      }
      
      if (ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(currentTheme === 'blue' ? 0 : 7340);
        ytPlayerRef.current.pauseVideo();
      }
    }
  }, [isActive, mode, breakTime, activePreset, currentTheme, cyclesCompleted, l]);

  useEffect(() => {
    // Start interval
    if (isActive) {
      timerIntervalRef.current = window.setInterval(() => {
        if (mode === 'work') {
          setWorkTime((w) => (w > 0 ? w - 1 : 0));
        } else {
          setBreakTime((b) => (b > 0 ? b - 1 : 0));
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isActive, mode]);

  const terminateAllTimersAndReset = (preset = activePreset, overrideTheme?: ThemeType) => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setIsActive(false);
    setMode('work');
    setWorkTime(preset.work);
    setBreakTime(preset.break);
    setCyclesCompleted(0);
    
    if (ytPlayerRef.current) {
      const themeToUse = overrideTheme || currentTheme;
      ytPlayerRef.current.seekTo(themeToUse === 'blue' ? 0 : 7340);
      ytPlayerRef.current.pauseVideo();
    }
  };

  const handleSwitchMode = (targetMode: 'work' | 'break') => {
    playClickSound();
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsActive(false);
    setMode(targetMode);
    setWorkTime(activePreset.work);
    setBreakTime(activePreset.break);
  };

  const toggleTimer = () => {
    playClickSound();
    setIsActive(!isActive);
    if (!isActive && !notificationsEnabled) {
      requestNotificationPermission();
    }
  };

  const resetTimer = () => {
    playClickSound();
    terminateAllTimersAndReset();
  };

  const changePreset = (preset: typeof PRESETS[0]) => {
    playClickSound();
    setActivePreset(preset);
    terminateAllTimersAndReset(preset);
  };

  const handleMainInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      playClickSound();
      e.currentTarget.blur();
      
      const trimmedLabel = taskLabel.trim();
      if (trimmedLabel !== '') {
        const existingTodoIndex = todos.findIndex(t => t.text.trim().toLowerCase() === trimmedLabel.toLowerCase());
        
        if (existingTodoIndex !== -1) {
          const newTodos = [...todos];
          newTodos[existingTodoIndex] = { ...newTodos[existingTodoIndex], completed: true };
          setTodos(newTodos);
          setTaskLabel('');
          setTaskNotFoundError('');
        } else {
          setTaskNotFoundError(l.taskNotFound || "Task not found in the to-do list.");
        }
      }
    }
  };

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      playClickSound();
      setTodos([{ id: Date.now().toString(), text: newTodo.trim(), completed: false }, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    playClickSound();
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    playClickSound();
    setTodos(todos.filter(t => t.id !== id));
  };

  // Background bubbles generator
  const bubbles = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 60 + 20;
    return (
      <div
        key={i}
        className="bubble"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDuration: `${Math.random() * 4 + 4}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    );
  });

  return (
    <div className={`${t.container} min-h-screen w-full relative overflow-x-hidden p-4 sm:p-6 flex flex-col items-center py-10 text-gray-800`}>

      {/* Frutiger Aero Wallpaper */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${currentTheme === 'orange' ? sunsetBg : frutigerBg})`,
        }}
      />

      {/* Decorative Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {bubbles}
      </div>

      {/* App Title / Logo */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-6 z-50 flex items-center select-none pointer-events-none">
        <img 
          src={appLogo} 
          alt="Pomofruti Logo" 
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] transition-all duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = './icon.png';
          }}
        />
      </div>

      {/* Theme & Language Selectors */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-end gap-2 z-50">
        <div className="aero-panel px-3 py-2 rounded-full flex gap-2 items-center">
          {(['blue', 'orange'] as ThemeType[]).map((theme) => (
            <div key={theme} className="group relative flex items-center justify-center">
              {currentTheme !== theme && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap aero-panel px-2.5 py-1 rounded-md shadow-md z-50">
                  <span className={`text-[10px] font-bold ${t.text}`}>
                    {theme === 'blue' ? 'Frutiger Aero' : 'Dorfic'}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  terminateAllTimersAndReset(activePreset, theme);
                  setCurrentTheme(theme);
                }}
                className={`w-6 h-6 shrink-0 rounded-full border shadow-inner transition-transform active:scale-90 ${currentTheme === theme ? 'scale-110 border-white ring-2 ring-white/50' : 'border-black/10 hover:scale-105'}`}
                style={{
                  background: theme === 'blue' ? '#2989d8' : '#f59e0b'
                }}
                aria-label={`Switch to ${theme === 'blue' ? 'Frutiger Aero' : 'Dorfic'}`}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="relative flex justify-end"
            onMouseEnter={() => setIsLangMenuOpen(true)}
            onMouseLeave={() => setIsLangMenuOpen(false)}
          >
            <div className="aero-panel px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer shadow-sm border border-white/50 backdrop-blur-md hover:scale-105 transition-transform">
              <Globe size={16} className={t.text} />
              <span className={`text-xs font-bold ${t.text} uppercase tracking-wider`}>{lang}</span>
            </div>

            <div className={`absolute top-full right-0 mt-2 transition-all duration-200 z-50 ${isLangMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <div className="aero-panel p-2 rounded-2xl flex flex-col gap-1 min-w-[140px] shadow-lg border border-white/50 backdrop-blur-xl">
                {(['en', 'vi', 'cn', 'zh-Hant', 'fr'] as Language[]).map((lCode) => (
                  <button
                    key={lCode}
                    onClick={() => {
                      setLang(lCode);
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      lang === lCode
                        ? 'bg-white/80 text-black shadow-sm'
                        : `hover:bg-white/40 ${t.text} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider mr-3">{lCode}</span>
                    <span className="text-xs font-semibold whitespace-nowrap">{TRANSLATIONS[lCode].langName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center space-y-8 sm:space-y-12">
        
        {/* Header & Cycles Info */}
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Preset Selector */}
          <div className="aero-inset p-1.5 rounded-full flex space-x-2 mb-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => changePreset(preset)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                  activePreset.id === preset.id 
                    ? `aero-btn-primary shadow-md` 
                    : `${t.text} hover:bg-white/40 hover-jiggle`
                }`}
              >
                {preset.label[lang]}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={taskLabel}
              onChange={(e) => {
                setTaskLabel(e.target.value);
                setTaskNotFoundError('');
              }}
              onKeyDown={handleMainInputKeyDown}
              placeholder={l.inputPlaceholder}
              className={`aero-inset w-full sm:w-[480px] px-6 py-4 rounded-full text-center text-lg sm:text-xl font-bold ${t.text} ${t.placeholder} focus:outline-none focus:ring-4 ${t.ring} transition-all`}
            />
            {taskNotFoundError && (
              <div className="text-red-500 font-bold text-sm bg-red-100/80 px-4 py-1.5 rounded-full shadow-sm animate-fade-in">
                {taskNotFoundError}
              </div>
            )}
          </div>
          <div className="aero-panel px-6 py-2.5 rounded-full flex items-center space-x-4 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
            <span className={`${t.text} font-bold text-sm sm:text-lg tracking-wide`}>{l.session}</span>
            <div className={`w-px h-6 bg-black/10`}></div>
            <div className={`flex items-center space-x-1 ${t.textLight}`}>
              <span className="font-black text-xl">{cyclesCompleted}</span>
              <span className="opacity-60 text-sm">/ {activePreset.cycles}</span>
              <span className="ml-1 text-xs sm:text-sm uppercase tracking-wider font-semibold opacity-80">{l.cycles}</span>
            </div>
          </div>
        </div>

        {/* Main Central Timer Dashboard */}
        <div className="aero-panel w-full max-w-2xl mx-auto flex flex-col items-center relative overflow-hidden rounded-[40px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          {/* Subtle glossy overlay on the dashboard itself */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[40px]"></div>

          {/* Mode Tabs / Indicators */}
          <div className="aero-inset p-1.5 rounded-full mb-6 flex relative z-10">
             <div 
                onClick={() => handleSwitchMode('work')}
                className={`cursor-pointer px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${mode === 'work' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-slate-800' : 'text-slate-700/60 opacity-80 hover:opacity-100 hover:bg-white/40'}`}
             >
                <Monitor size={18} /> {l.learn}
             </div>
             <div 
                onClick={() => handleSwitchMode('break')}
                className={`cursor-pointer px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${mode === 'break' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-slate-800' : 'text-slate-700/60 opacity-80 hover:opacity-100 hover:bg-white/40'}`}
             >
                <Coffee size={18} /> {l.relax}
             </div>
          </div>

          <div className="relative z-10">
            <TimerRing 
              time={mode === 'work' ? workTime : breakTime} 
              maxTime={mode === 'work' ? activePreset.work : activePreset.break} 
              color={mode === 'work' ? t.timerLearnColor : t.timerRelaxColor} 
              isActiveMode={true} 
            />
          </div>

          {/* Integrated Hardware Controls */}
          <div className="flex items-center space-x-8 mt-8 relative z-10">
            <button
              onClick={resetTimer}
              className={`aero-btn w-14 h-14 rounded-full flex items-center justify-center ${t.text}`}
              aria-label="Reset Timer"
              title="Reset Timer"
            >
              <RotateCcw size={22} />
            </button>
            <button
              onClick={toggleTimer}
              className={`aero-btn-primary w-24 h-24 rounded-full flex items-center justify-center`}
              aria-label={isActive ? "Pause" : "Play"}
              title={isActive ? "Pause" : "Play"}
            >
              {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            <button
              onClick={requestNotificationPermission}
              className={`aero-btn w-14 h-14 rounded-full flex items-center justify-center ${notificationsEnabled ? t.btnIconHover : t.text}`}
              title="Enable Notifications"
              aria-label="Enable Notifications"
            >
              <Bell size={22} fill={notificationsEnabled ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          {/* Todo List */}
          <div className="aero-panel p-6 rounded-[24px] flex flex-col relative overflow-hidden h-[360px] flex-1">
             <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[24px]"></div>
             <div className="flex items-center justify-between mb-4 relative z-10">
               <h3 className={`text-xl font-bold ${t.text} flex items-center gap-2 drop-shadow-sm`}>
                 <CheckSquare size={22} className="opacity-80" />
                 {l.todo}
               </h3>
               <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/40 border border-white/50 ${t.textLight}`}>
                 {todos.filter(todo => todo.completed).length}/{todos.length} {l.completed}
               </span>
             </div>
             
             <div className="flex gap-2 mb-4 relative z-10">
               <input 
                 type="text" 
                 value={newTodo} 
                 onChange={e => setNewTodo(e.target.value)}
                 onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
                 placeholder={l.addTask}
                 className={`aero-inset flex-1 px-4 py-2.5 rounded-xl ${t.text} ${t.placeholder} focus:outline-none focus:ring-2 ${t.ring} text-sm font-semibold`}
               />
               <button onClick={addTodo} className={`aero-btn px-5 py-2.5 rounded-xl ${t.text} font-bold text-sm`}>{l.addBtn}</button>
             </div>
             
             <div className="flex flex-col space-y-2 overflow-y-auto pr-2 flex-1 relative z-10">
               {todos.map(todo => (
                 <div 
                   key={todo.id} 
                   onClick={() => toggleTodo(todo.id)}
                   className="group flex items-center gap-3 p-3 aero-panel !bg-white/35 rounded-xl shrink-0 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer select-none"
                 >
                   <button 
                     onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }} 
                     className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border transition-all ${todo.completed ? `bg-emerald-500 border-emerald-600 shadow-inner text-white` : `bg-white/60 border-white shadow-sm hover:bg-white`}`}
                     aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
                   >
                     {todo.completed && <Check size={16} strokeWidth={4} />}
                   </button>
                   <span className={`flex-1 text-sm font-semibold truncate ${todo.completed ? `line-through opacity-50` : t.text}`} title={todo.text}>
                     {todo.text}
                   </span>
                   <button 
                     onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} 
                     className="transition-opacity opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shrink-0 text-red-500/70 hover:text-red-600 p-1"
                     aria-label="Delete task"
                     title="Delete task"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               {todos.length === 0 && (
                 <p className={`${t.textMuted} text-center italic py-8 text-sm font-medium m-auto`}>{l.noTasks}</p>
               )}
             </div>
          </div>

          {/* Music Player */}
          <div className="aero-panel rounded-[24px] flex flex-col relative overflow-hidden lg:w-[380px] shrink-0 border-t-white/80">
            {/* Player Top Bar */}
            <div className="bg-gradient-to-b from-white/70 to-white/30 border-b border-white/40 px-4 py-2 flex items-center justify-between shadow-sm relative z-10">
              <div className="flex items-center gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner border border-red-500/30"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner border border-yellow-500/30"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner border border-green-500/30"></div>
                 </div>
              </div>
              <h3 className="text-xs font-bold tracking-widest text-slate-600 uppercase drop-shadow-sm">{l.playlist}</h3>
              <div className="w-10"></div> {/* spacer to center title */}
            </div>
            
            {/* Player Body */}
            <div className="p-4 flex-1 flex flex-col bg-slate-900/10 shadow-inner relative">
               <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
               <div className="w-full aspect-[16/9] rounded-lg overflow-hidden relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] bg-black border border-white/20 pointer-events-none">
                 <YouTube
                   videoId={currentTheme === 'blue' ? "9c9JcWbY_zU" : "6fwjK0LCk3c"}
                   opts={{
                     width: '100%',
                     height: '100%',
                     playerVars: {
                       autoplay: 0,
                       controls: 0,
                       start: currentTheme === 'blue' ? 0 : 7340,
                       rel: 0,
                       disablekb: 1,
                       fs: 0,
                       modestbranding: 1
                     },
                   }}
                   onReady={onYtReady}
                   onStateChange={onYtStateChange}
                   className="w-full h-full opacity-90 transition-opacity"
                   iframeClassName="w-full h-full"
                 />
               </div>
               
               {/* Playback Duration Bar with Click to Seek */}
               {(() => {
                 const baseTime = currentTheme === 'blue' ? 0 : 7340;
                 const relProgress = Math.max(0, audioProgress - baseTime);
                 const relDuration = Math.max(1, audioDuration - baseTime);
                 const playPercent = audioDuration > 0 ? Math.min(100, Math.max(0, (relProgress / relDuration) * 100)) : 0;
                 
                 const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
                   if (!ytPlayerRef.current || audioDuration <= 0) return;
                   const rect = e.currentTarget.getBoundingClientRect();
                   const clickX = e.clientX - rect.left;
                   const pct = Math.max(0, Math.min(1, clickX / rect.width));
                   const target = baseTime + (pct * relDuration);
                   try {
                     ytPlayerRef.current.seekTo(target, true);
                     setAudioProgress(target);
                   } catch (err) {
                     console.error("Seek error:", err);
                   }
                 };

                 return (
                   <div className="mt-4 flex flex-col gap-2 relative z-10">
                     <div 
                       onClick={handleBarClick}
                       className="h-2.5 w-full bg-black/25 rounded-full overflow-hidden border border-white/20 shadow-inner cursor-pointer relative group transition-all hover:h-3"
                       title="Click to seek"
                     >
                       <div 
                         className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-300 rounded-full transition-all duration-150 ease-out relative" 
                         style={{ width: `${playPercent}%` }}
                       >
                         <div className="absolute inset-0 bg-white/40 h-1/2 pointer-events-none rounded-t-full" />
                       </div>
                     </div>
                     <div className="flex justify-between text-[11px] font-bold text-slate-700/70 font-mono">
                       <span>{formatAudioTime(relProgress)}</span>
                       <span>-{formatAudioTime(Math.max(0, relDuration - relProgress))}</span>
                     </div>
                   </div>
                 );
               })()}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
