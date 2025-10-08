import React, { useEffect, useRef, useState } from 'react';
import styles from './AuthForm.module.scss';

interface Character {
  id: string;
  color: string;
  eyePosition: { x: number; y: number };
  isBlinking: boolean;
}

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [characters, setCharacters] = useState<Character[]>([
    { id: 'violet', color: '#8b5cf6', eyePosition: { x: 0, y: 0 }, isBlinking: false },
    { id: 'black', color: '#000000', eyePosition: { x: 0, y: 0 }, isBlinking: false },
    { id: 'yellow', color: '#eab308', eyePosition: { x: 0, y: 0 }, isBlinking: false },
    { id: 'orange', color: '#f97316', eyePosition: { x: 0, y: 0 }, isBlinking: false },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>();
  const blinkIntervalRef = useRef<ReturnType<typeof setTimeout> | null>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const startBlinking = () => {
      blinkIntervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        setCharacters(prev => prev.map((char, index) => ({
          ...char,
          isBlinking: index === randomIndex
        })));

        setTimeout(() => {
          setCharacters(prev => prev.map(char => ({
            ...char,
            isBlinking: false
          })));
        }, 150);
      }, 3000);
    };

    startBlinking();
    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, []);

  console.log('render')

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      setCharacters(prev => prev.map((char) => {
        const charElement = document.getElementById(`char-${char.id}`);
        if (charElement) {
          const charRect = charElement.getBoundingClientRect();
          const charCenterX = charRect.left + charRect.width / 2 - rect.left;
          const charCenterY = charRect.top + charRect.height / 2 - rect.top;

          let targetX = mousePosition.x;
          let targetY = mousePosition.y;

          if (showPassword) {
            targetX = charCenterX - (mousePosition.x - charCenterX);
            targetY = charCenterY - (mousePosition.y - charCenterY);
          }

          const angle = Math.atan2(targetY - charCenterY, targetX - charCenterX);
          const distance = Math.min(8, Math.hypot(targetX - charCenterX, targetY - charCenterY) / 20);

          return {
            ...char,
            eyePosition: {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance
            }
          };
        }
        return char;
      }));
    }
  }, [mousePosition, showPassword]);

  const handleInputChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'email') {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }

    setIsTyping(true);
    setIsWrongPassword(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== 'correct123') {
      setIsWrongPassword(true);
      setTimeout(() => setIsWrongPassword(false), 1000);
    } else {
      console.log('Login successful!');
    }
  };

  const renderCharacter = (char: Character, index: number) => {
    const isViolet = char.id === 'violet';
    const isBlack = char.id === 'black';
    const isYellow = char.id === 'yellow';
    const isOrange = char.id === 'orange';

    return (
      <div
        key={char.id}
        id={`char-${char.id}`}
        className={`${styles.character} ${isWrongPassword ? styles.shaking : ''}`}
        style={{
          backgroundColor: char.color,
          ...(isViolet && {
            left: 'calc(50% - 100px)',
            top: '40%',
            width: '140px',
            height: '200px',
          }),
          ...(isBlack && {
            left: 'calc(50%)',
            top: '50%',
            width: '80px',
            height: '160px',
          }),
          ...(isYellow && {
            left: 'calc(50% + 50px)',
            top: '55%',
            width: '100px',
            height: '140px',
            borderRadius: '50% 50% 0 0',
            zIndex: 3,
          }),
          ...(isOrange && {
            left: 'calc(50% - 250px)',
            top: '50%',
            width: '200px',
            height: '150px',
            borderRadius: '50% 50% 0 0',
            zIndex: 3,
          }),
        }}
      >
        <div className={styles.eyes}>
          <div className={`${styles.eye} ${char.isBlinking ? styles.blink : ''}`}>
            <div
              className={styles.pupil}
              style={{
                transform: `translate(${char.eyePosition.x}px, ${char.eyePosition.y}px)`
              }}
            />
          </div>
          <div className={`${styles.eye} ${char.isBlinking ? styles.blink : ''}`}>
            <div
              className={styles.pupil}
              style={{
                transform: `translate(${char.eyePosition.x}px, ${char.eyePosition.y}px)`
              }}
            />
          </div>
        </div>

        {isViolet && (
          <div className={`${styles.mouth} ${isTyping ? styles.open : ''}`}>
            <div className={styles.teeth} />
          </div>
        )}

        {isYellow && (
          <div className={styles.beak} />
        )}

        {/*{isOrange && (*/}
        {/*  <div className={styles.dots}>*/}
        {/*    <span />*/}
        {/*    <span />*/}
        {/*    <span />*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    );
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.charactersSection}>
        {characters.map((char, index) => renderCharacter(char, index))}
      </div>

      <div className={styles.formSection}>
        <div className={styles.formCard}>
          {/*<div className={styles.plusIcon}>+</div>*/}

          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>Please enter your details</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange('email')}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handleInputChange('password')}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Remember for 30 days</span>
              </label>
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            </div>

            <button type="submit" className={styles.submitButton}>
              Log in
            </button>

            <button type="button" className={styles.googleButton}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Log in with Google
            </button>

            <p className={styles.signupText}>
              Don't have an account? <a href="#">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;