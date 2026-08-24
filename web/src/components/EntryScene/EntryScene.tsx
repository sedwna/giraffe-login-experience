import { useEffect, useRef, useState } from 'react';

import styles from './EntryScene.module.css';

export type EntryResult =
  | 'idle'
  | 'success'
  | 'failure'
  | 'entered';

interface EntrySceneProps {
  result: EntryResult;
}

const WALK_HOME_DURATION = 980;

/**
 * The doorway strip above the sign-in button.
 *
 * A chibi version of the mascot giraffe (googly eye, ossicones and boots
 * included) waits at the start of the path. Pressing Sign in sends it
 * walking to the door: on success the door opens and it ducks through and
 * stays inside; on failure it bumps the locked door, recoils, shakes its
 * head, then walks back to its waiting spot.
 */
export function EntryScene({ result }: EntrySceneProps) {
  const [walkingHome, setWalkingHome] = useState(false);
  const previousResult = useRef(result);

  useEffect(() => {
    // After bumping the locked door the giraffe strides back to the
    // start of the path.
    const cameBackFromDoor =
      previousResult.current === 'failure' &&
      result === 'idle';

    previousResult.current = result;

    if (!cameBackFromDoor) {
      return;
    }

    setWalkingHome(true);

    const timer = window.setTimeout(() => {
      setWalkingHome(false);
    }, WALK_HOME_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [result]);

  const walk = result === 'idle' ? 0 : 1;
  const showResult = result !== 'idle' && result !== 'entered';

  return (
    <div
      className={styles.scene}
      data-result={showResult ? result : undefined}
      data-walking={
        result === 'idle' && walkingHome ? 'true' : undefined
      }
      data-entered={result === 'entered' ? 'true' : undefined}
      style={{ '--walk': walk } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.doorLight} />
      <span className={styles.doorGlow} />

      <span className={styles.doorFrame}>
        <span className={styles.door}>
          <span className={styles.doorKnob} />
        </span>
      </span>

      <div className={styles.walker}>
        <svg
          className={styles.walkerFigure}
          viewBox="0 -6 72 70"
          role="presentation"
        >
          <defs>
            <radialGradient id="ws-bodyGrad" cx="0.42" cy="0.7" r="0.85">
              <stop offset="0" stopColor="#F9EBCC" />
              <stop offset="0.55" stopColor="#F1DDB6" />
              <stop offset="1" stopColor="#DEC094" />
            </radialGradient>
            <radialGradient id="ws-headGrad" cx="0.45" cy="0.35" r="0.85">
              <stop offset="0" stopColor="#F8E9C9" />
              <stop offset="0.7" stopColor="#EFD9B2" />
              <stop offset="1" stopColor="#DFC094" />
            </radialGradient>
            <radialGradient id="ws-eyeGrad" cx="0.42" cy="0.34" r="0.85">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#FBF8F1" />
              <stop offset="1" stopColor="#DDD2BA" />
            </radialGradient>
            <radialGradient id="ws-muzzleGrad" cx="0.4" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#B15E3A" />
              <stop offset="0.5" stopColor="#9C4A2C" />
              <stop offset="1" stopColor="#7C351E" />
            </radialGradient>
            <linearGradient id="ws-patchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C75A33" />
              <stop offset="1" stopColor="#A84325" />
            </linearGradient>
            <radialGradient id="ws-bootGrad" cx="0.38" cy="0.28" r="1">
              <stop offset="0" stopColor="#503A31" />
              <stop offset="0.5" stopColor="#362520" />
              <stop offset="1" stopColor="#1D120E" />
            </radialGradient>
            <linearGradient id="ws-cuffGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FBF0DC" />
              <stop offset="1" stopColor="#E4CFA8" />
            </linearGradient>
            <clipPath id="ws-bodyClip">
              <path d="M 12 36 C 15 33.5 20 32.8 25 33 C 27 33.1 29 33.3 30.5 33.8 C 33.5 26 35.5 17.5 37 9 C 39.5 7.8 43 8.6 45.5 11.5 C 44 21 42.8 30 42.2 36.5 C 41.8 41 40.2 44.8 36.5 47.5 C 33.5 52 30 53.6 26 53.6 C 18.5 53.6 12.8 49.5 11.6 44 C 11 40.5 11.2 37.8 12 36 Z" />
            </clipPath>
          </defs>

          <g className={styles.walkerInner}>
            {/* Tail */}
            <path
              d="M 13 38 C 8 42 6.5 49 8.5 55"
              fill="none"
              stroke="#E7CDA2"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <ellipse
              cx="8.5"
              cy="57"
              rx="2.6"
              ry="3.6"
              fill="#46301C"
              transform="rotate(10 8.5 57)"
            />

            {/* Legs. Positioning lives on an attribute-only outer group so
                the keyframed rotate on the inner group can never wipe the
                translate out of the transform cascade. */}
            <g transform="translate(15.5 49.5)">
              <g className={`${styles.leg} ${styles.legHindA}`}>
                <rect x="-1.7" y="0" width="3.4" height="7" rx="1.7" fill="#C9A87B" />
                <rect x="-4" y="5.6" width="8" height="6.4" rx="2.2" fill="url(#ws-bootGrad)" />
                <rect x="-4" y="11.2" width="8" height="1.6" rx="0.8" fill="#140C08" />
                <path d="M -2.2 7.6 L 2.2 8.8 M 2.2 7.6 L -2.2 8.8" stroke="#E9D8B6" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.9" />
                <rect x="-4" y="5" width="8" height="2.4" rx="1.2" fill="url(#ws-cuffGrad)" />
              </g>
            </g>
            <g transform="translate(21 50)">
              <g className={`${styles.leg} ${styles.legHindB}`}>
                <rect x="-1.7" y="0" width="3.4" height="7" rx="1.7" fill="#C9A87B" />
                <rect x="-4" y="5.6" width="8" height="6.4" rx="2.2" fill="url(#ws-bootGrad)" />
                <rect x="-4" y="11.2" width="8" height="1.6" rx="0.8" fill="#140C08" />
                <path d="M -2.2 7.6 L 2.2 8.8 M 2.2 7.6 L -2.2 8.8" stroke="#E9D8B6" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.9" />
                <rect x="-4" y="5" width="8" height="2.4" rx="1.2" fill="url(#ws-cuffGrad)" />
              </g>
            </g>

            {/* Body and neck as ONE continuous silhouette — withers flow
                into the back of the neck, the chest curve into its front,
                so there is no seam where they meet. */}
            <path
              d="M 12 36 C 15 33.5 20 32.8 25 33 C 27 33.1 29 33.3 30.5 33.8 C 33.5 26 35.5 17.5 37 9 C 39.5 7.8 43 8.6 45.5 11.5 C 44 21 42.8 30 42.2 36.5 C 41.8 41 40.2 44.8 36.5 47.5 C 33.5 52 30 53.6 26 53.6 C 18.5 53.6 12.8 49.5 11.6 44 C 11 40.5 11.2 37.8 12 36 Z"
              fill="url(#ws-bodyGrad)"
              stroke="#9C6740"
              strokeOpacity="0.3"
              strokeWidth="0.8"
            />
            <ellipse cx="24" cy="47" rx="9" ry="5" fill="#FAEDCB" opacity="0.55" />
            <g clipPath="url(#ws-bodyClip)" fill="url(#ws-patchGrad)" opacity="0.95">
              <path d="M 14 36 C 18 33 23 34 24 38 C 25 42 21 45 17 44 C 13 43 12 39 14 36 Z" />
              <path d="M 30 39 C 34 36 39 38 39.5 42 C 40 46 36 49 32 47.5 C 28 46 27.5 42 30 39 Z" />
              <path d="M 18 48 C 21 46 25 47 25.5 50 C 26 53 23 55 20 54 C 17 53 16.5 50 18 48 Z" />
              <path d="M 33 50 C 35 48.5 37.5 49.5 37.8 51.5 C 38 53.5 36 55 34 54.2 C 32 53.4 31.8 51.3 33 50 Z" />
              <path d="M 31 31 C 34 29.5 36.8 31 36.8 33.5 C 36.8 36 34 37.5 31.8 36.3 C 29.6 35 29.6 32.4 31 31 Z" />
              <path d="M 35 24 C 37.5 22.5 40 24 40 26.5 C 40 29 37.5 30.5 35.5 29.3 C 33.5 28 33.5 25.5 35 24 Z" />
              <path d="M 38 14 C 39.8 13 41.8 14 41.8 15.8 C 41.8 17.6 39.8 18.7 38.3 17.7 C 36.8 16.7 36.9 15 38 14 Z" />
            </g>

            {/* Front legs (over the belly) */}
            <g transform="translate(31 50)">
              <g className={`${styles.leg} ${styles.legFrontA}`}>
                <rect x="-1.7" y="0" width="3.4" height="7" rx="1.7" fill="#DEC49A" />
                <rect x="-4" y="5.6" width="8" height="6.4" rx="2.2" fill="url(#ws-bootGrad)" />
                <rect x="-4" y="11.2" width="8" height="1.6" rx="0.8" fill="#140C08" />
                <path d="M -2.2 7.6 L 2.2 8.8 M 2.2 7.6 L -2.2 8.8" stroke="#E9D8B6" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.9" />
                <rect x="-4" y="5" width="8" height="2.4" rx="1.2" fill="url(#ws-cuffGrad)" />
              </g>
            </g>
            <g transform="translate(36.5 49.5)">
              <g className={`${styles.leg} ${styles.legFrontB}`}>
                <rect x="-1.7" y="0" width="3.4" height="7" rx="1.7" fill="#DEC49A" />
                <rect x="-4" y="5.6" width="8" height="6.4" rx="2.2" fill="url(#ws-bootGrad)" />
                <rect x="-4" y="11.2" width="8" height="1.6" rx="0.8" fill="#140C08" />
                <path d="M -2.2 7.6 L 2.2 8.8 M 2.2 7.6 L -2.2 8.8" stroke="#E9D8B6" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.9" />
                <rect x="-4" y="5" width="8" height="2.4" rx="1.2" fill="url(#ws-cuffGrad)" />
              </g>
            </g>

            {/* Head — big googly eye, ossicones, dark muzzle, like the mascot */}
            <g className={styles.headGroup}>
              <ellipse
                cx="36.5"
                cy="2.8"
                rx="3.4"
                ry="2.1"
                fill="#EFD9B2"
                transform="rotate(-38 36.5 2.8)"
              />
              <ellipse
                cx="36.8"
                cy="2.9"
                rx="1.8"
                ry="1"
                fill="#BC5B36"
                transform="rotate(-38 36.8 2.9)"
              />

              <path
                d="M 40.5 3.5 L 38.8 -2.6"
                stroke="#4A331E"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M 44.6 3.2 L 46 -3"
                stroke="#4A331E"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <circle cx="38.6" cy="-3.4" r="2" fill="#3E2917" />
              <circle cx="46.2" cy="-3.8" r="2" fill="#3E2917" />

              <circle cx="43.5" cy="9.5" r="6.8" fill="url(#ws-headGrad)" />

              <ellipse
                cx="52.5"
                cy="12.3"
                rx="6.6"
                ry="5"
                fill="url(#ws-muzzleGrad)"
                transform="rotate(10 52.5 12.3)"
              />
              <ellipse
                cx="55.4"
                cy="10.4"
                rx="1"
                ry="1.4"
                fill="#5E2312"
                transform="rotate(15 55.4 10.4)"
              />
              <path
                d="M 50.5 15.8 Q 53.5 17.2 56 15.6"
                fill="none"
                stroke="#6E2F1C"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
              />

              <circle cx="44.8" cy="5.2" r="5.2" fill="url(#ws-eyeGrad)" />
              <circle cx="46.6" cy="6" r="2.3" fill="#3A2317" />
              <circle cx="47.4" cy="5" r="0.85" fill="#FFFFFF" opacity="0.95" />
              <circle cx="45.4" cy="7" r="0.5" fill="#FFFFFF" opacity="0.45" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
