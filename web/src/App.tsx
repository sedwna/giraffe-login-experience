import { useEffect, useState } from 'react';

import { LoginExperience } from './components/LoginExperience/LoginExperience';
import type { MascotVariant } from './components/LoginExperience/LoginExperience';

import './App.css';

const VARIANT_STORAGE_KEY = 'giraffe-mascot-variant';

function readStoredVariant(): MascotVariant {
  try {
    const raw = window.localStorage.getItem(VARIANT_STORAGE_KEY);
    return raw === 'side' ? 'side' : 'top';
  } catch {
    return 'top';
  }
}

export default function App() {
  const [variant, setVariant] = useState<MascotVariant>(readStoredVariant);

  useEffect(() => {
    try {
      window.localStorage.setItem(VARIANT_STORAGE_KEY, variant);
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }, [variant]);

  return (
    <main className="app">
      <div
        className="variant-switch"
        role="group"
        aria-label="Mascot composition"
      >
        <span className="variant-switch__label">Demo</span>

        <button
          type="button"
          className={variant === 'top' ? 'is-active' : ''}
          aria-pressed={variant === 'top'}
          onClick={() => setVariant('top')}
        >
          Top
        </button>

        <button
          type="button"
          className={variant === 'side' ? 'is-active' : ''}
          aria-pressed={variant === 'side'}
          onClick={() => setVariant('side')}
        >
          Side
        </button>
      </div>

      <LoginExperience mascotVariant={variant} />
    </main>
  );
}
