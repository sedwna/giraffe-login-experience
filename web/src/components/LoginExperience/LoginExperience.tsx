import { useEffect, useRef, useState } from 'react';

import { authenticateLogin } from '../../features/auth/auth.service';
import type {
  AuthenticateLogin,
  AuthProvider,
  AuthResult,
  LoginFieldErrors,
} from '../../features/auth/auth.types';
import { LoginForm } from '../LoginForm/LoginForm';
import { GiraffeMascot } from '../GiraffeMascot/GiraffeMascot';
import { GiraffeMascotSide } from '../GiraffeMascotSide/GiraffeMascotSide';

import type { SubmitState } from './loginExperience.types';
import styles from './LoginExperience.module.css';

export type MascotVariant = 'top' | 'side';

interface LoginExperienceProps {
  /** Where the giraffe stands: rising above the card, or leaning its
      snake-curve neck out past the card's left edge. */
  mascotVariant?: MascotVariant;
  authenticate?: AuthenticateLogin;
  onSocialLogin?: (provider: AuthProvider) => void | Promise<void>;
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
}

const SUCCESS_ANIMATION_DURATION = 2400;
const FAILURE_ANIMATION_DURATION = 3800;
const FAILURE_FEEDBACK_DELAY = 2050;

const NETWORK_ERROR_RESULT: AuthResult = {
  ok: false,
  code: 'NETWORK_ERROR',
  message:
    'Unable to sign in right now. Check your connection and try again.',
};

export function LoginExperience({
  mascotVariant = 'top',
  authenticate = authenticateLogin,
  onSocialLogin = () => {},
  onCreateAccount = () => {},
  onForgotPassword = () => {},
}: LoginExperienceProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [submitState, setSubmitState] =
    useState<SubmitState>('idle');

  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>({});

  const [authMessage, setAuthMessage] = useState('');

  const timersRef = useRef<number[]>([]);

  // Set when a field changes after a submit: pending failure feedback
  // about the previous attempt should no longer surface mid-edit.
  const editedSinceSubmitRef = useRef(false);

  const clearScheduledTasks = () => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current = [];
  };

  const schedule = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);

    timersRef.current.push(timer);
  };

  useEffect(() => {
    return clearScheduledTasks;
  }, []);

  const resetFeedback = () => {
    setFieldErrors({});
    setAuthMessage('');

    if (submitState === 'success') {
      setSubmitState('idle');
    }
  };

  const handleUsernameChange = (value: string) => {
    editedSinceSubmitRef.current = true;
    resetFeedback();
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    editedSinceSubmitRef.current = true;
    resetFeedback();
    setPassword(value);
  };

  const runFailureSequence = (result: AuthResult) => {
    if (result.ok) {
      return;
    }

    setSubmitState('failure-animation');

    schedule(() => {
      if (editedSinceSubmitRef.current) {
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setAuthMessage(result.message);
    }, FAILURE_FEEDBACK_DELAY);

    schedule(() => {
      setSubmitState('idle');
    }, FAILURE_ANIMATION_DURATION);
  };

  const handleSubmit = async () => {
    if (
      submitState !== 'idle' &&
      submitState !== 'success'
    ) {
      return;
    }

    clearScheduledTasks();

    editedSinceSubmitRef.current = false;
    setFieldErrors({});
    setAuthMessage('');
    setSubmitState('checking');

    let result: AuthResult;

    try {
      result = await authenticate({
        username,
        password,
        rememberMe,
      });
    } catch {
      result = NETWORK_ERROR_RESULT;
    }

    if (!result.ok) {
      runFailureSequence(result);
      return;
    }

    setSubmitState('success-animation');

    schedule(() => {
      setSubmitState('success');
    }, SUCCESS_ANIMATION_DURATION);
  };

  const mascotProps = {
    usernameFocused,
    usernameLength: username.length,
    passwordLength: password.length,
    passwordFocused,
    passwordVisible,
  };

  return (
    <section
      className={
        mascotVariant === 'side'
          ? `${styles.experience} ${styles.experienceSide}`
          : styles.experience
      }
    >
      <div
        className={
          mascotVariant === 'side' ? styles.mascotSide : styles.mascot
        }
      >
        {mascotVariant === 'side' ? (
          <GiraffeMascotSide {...mascotProps} />
        ) : (
          <GiraffeMascot {...mascotProps} />
        )}
      </div>

      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Welcome</h1>
        </header>

        <LoginForm
          username={username}
          password={password}
          rememberMe={rememberMe}
          passwordVisible={passwordVisible}
          submitState={submitState}
          fieldErrors={fieldErrors}
          authMessage={authMessage}
          onUsernameChange={handleUsernameChange}
          onUsernameFocusChange={setUsernameFocused}
          onPasswordChange={handlePasswordChange}
          onPasswordFocusChange={setPasswordFocused}
          onRememberMeChange={setRememberMe}
          onPasswordVisibilityToggle={() =>
            setPasswordVisible((visible) => !visible)
          }
          onSocialLogin={onSocialLogin}
          onCreateAccount={onCreateAccount}
          onForgotPassword={onForgotPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
