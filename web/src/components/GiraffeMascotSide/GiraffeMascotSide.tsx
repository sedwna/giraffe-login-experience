import styles from './GiraffeMascotSide.module.css';
import { useGazeTracking } from '../GiraffeMascot/useGazeTracking';

interface GiraffeMascotSideProps {
  usernameFocused: boolean;
  usernameLength: number;
  passwordLength: number;
  passwordFocused: boolean;
  passwordVisible: boolean;
}

type GiraffePose = 'idle' | 'shy' | 'peek';

/**
 * Side composition of the mascot: the full-height body stands BEHIND the
 * glass card (a soft silhouette through the backdrop blur) while the neck
 * sweeps out past the card's left edge in a snake-like arc, head hanging
 * outside facing the form.
 *
 * Pose map:
 * - idle: head out past the edge; pupils and head follow the pointer/caret
 * - shy:  password focused + hidden -> the whole neck retracts behind the card
 * - peek: password focused + visible -> half the face slides back past the
 *         edge, outside eye open
 */
export function GiraffeMascotSide({
  usernameFocused,
  usernameLength,
  passwordLength,
  passwordFocused,
  passwordVisible,
}: GiraffeMascotSideProps) {
  const mascotRef = useGazeTracking({
    usernameFocused,
    usernameLength,
    passwordFocused,
    passwordLength,
  });

  const pose: GiraffePose = passwordFocused
    ? passwordVisible
      ? 'peek'
      : 'shy'
    : 'idle';

  return (
    <div
      ref={mascotRef}
      className={styles.mascot}
      data-pose={pose}
      aria-hidden="true"
    >
      <svg className={styles.figure} viewBox="0 0 460 560">
        <defs>
            <radialGradient id="gvs-bodyGrad" cx="0.46" cy="0.6" r="0.72">
              <stop offset="0" stopColor="#F9EBCC"/>
              <stop offset="0.55" stopColor="#F1DDB6"/>
              <stop offset="1" stopColor="#DEC094"/>
            </radialGradient>
            <linearGradient id="gvs-neckGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#E2C79E"/>
              <stop offset="0.4" stopColor="#F3E1BD"/>
              <stop offset="1" stopColor="#DABA8E"/>
            </linearGradient>
            <radialGradient id="gvs-headGrad" cx="0.45" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#F8E9C9"/>
              <stop offset="0.7" stopColor="#EFD9B2"/>
              <stop offset="1" stopColor="#DFC094"/>
            </radialGradient>
            <radialGradient id="gvs-eyeGrad" cx="0.42" cy="0.34" r="0.85">
              <stop offset="0" stopColor="#FFFFFF"/>
              <stop offset="0.55" stopColor="#FBF8F1"/>
              <stop offset="0.85" stopColor="#EFE7D6"/>
              <stop offset="1" stopColor="#D8CCB4"/>
            </radialGradient>
            <radialGradient id="gvs-muzzleGrad" cx="0.4" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#B15E3A"/>
              <stop offset="0.5" stopColor="#9C4A2C"/>
              <stop offset="1" stopColor="#7C351E"/>
            </radialGradient>
            <linearGradient id="gvs-patchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C75A33"/>
              <stop offset="1" stopColor="#A84325"/>
            </linearGradient>
            <radialGradient id="gvs-bootGrad" cx="0.38" cy="0.28" r="1">
              <stop offset="0" stopColor="#503A31"/>
              <stop offset="0.5" stopColor="#362520"/>
              <stop offset="1" stopColor="#1D120E"/>
            </radialGradient>
            <linearGradient id="gvs-cuffGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FBF0DC"/>
              <stop offset="1" stopColor="#E4CFA8"/>
            </linearGradient>
            <radialGradient id="gvs-shadowGrad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#04101F" stopOpacity="0.55"/>
              <stop offset="0.7" stopColor="#04101F" stopOpacity="0.28"/>
              <stop offset="1" stopColor="#04101F" stopOpacity="0"/>
            </radialGradient>
            <clipPath id="gvs-bodyClip">
              <path d="M 100 232 C 133 232 156 256 162 298 C 166.5 330 140 356 100 356 C 60 356 33.5 330 38 298 C 44 256 67 232 100 232 Z"/>
            </clipPath>
            <clipPath id="gvs-neckClip">
              <path d="M 276 356 C 276 246 248 156 183 88 Q 192 79 204 74 C 240 108 308 224 324 356 Z"/>
            </clipPath>
            <g id="gvs-boot">
              <rect x="-10.5" y="22.5" width="24" height="5.5" rx="2.6" fill="#140C08"/>
              <path d="M -9.5 1 L -9.5 18.5 Q -9.5 25.5 -1.5 25.5 L 4.5 25.5 Q 12.5 25.5 12.5 19.5 Q 12.5 14.5 8.5 12.5 L 8.5 1 Z" fill="url(#gvs-bootGrad)"/>
              <ellipse cx="6.5" cy="19.5" rx="4.5" ry="3" fill="#6B5147" opacity="0.35"/>
              <path d="M -6.5 3.5 L 6 6.5 M 6 3.5 L -6.5 6.5 M -6.5 8.5 L 6 11.5 M 6 8.5 L -6.5 11.5" stroke="#E9D8B6" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.9"/>
              <path d="M -11 -1.5 Q -11 -4.5 -8 -4.5 L 8 -4.5 Q 11 -4.5 11 -1.5 L 11 1.5 Q 8.5 4.8 5.6 2.6 Q 2.9 5.6 0 2.8 Q -2.9 5.6 -5.6 2.6 Q -8.5 4.8 -11 1.5 Z" fill="url(#gvs-cuffGrad)"/>
            </g>
          </defs>
        
          <g transform="translate(200 100)">
          <ellipse cx="100" cy="449" rx="82" ry="6" fill="url(#gvs-shadowGrad)"/>
          <ellipse cx="59" cy="448" rx="16" ry="3.6" fill="url(#gvs-shadowGrad)"/>
          <ellipse cx="141" cy="448" rx="16" ry="3.6" fill="url(#gvs-shadowGrad)"/>
          <ellipse cx="84" cy="450" rx="16" ry="3.6" fill="url(#gvs-shadowGrad)"/>
          <ellipse cx="116" cy="450" rx="16" ry="3.6" fill="url(#gvs-shadowGrad)"/>
        
          <g className={styles.tail}>
            <path d="M 138 282 C 158 302 166 334 159 372" stroke="#E7CDA2" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M 159 367 C 166 371 167 383 160 391 C 153 384 152 372 159 367 Z" fill="#46301C"/>
          </g>
        
          <path d="M 62 330 C 64 360 66 382 62 400 C 60 408 59 413 59 419" stroke="#B8946A" strokeWidth="9.5" strokeLinecap="round" fill="none"/>
          <path d="M 62 330 C 64 360 66 382 62 400 C 60 408 59 413 59 419" stroke="#DEC49A" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <path d="M 138 330 C 136 360 134 382 138 400 C 140 408 141 413 141 419" stroke="#B8946A" strokeWidth="9.5" strokeLinecap="round" fill="none"/>
          <path d="M 138 330 C 136 360 134 382 138 400 C 140 408 141 413 141 419" stroke="#DEC49A" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <use href="#gvs-boot" transform="translate(59,419)"/>
          <use href="#gvs-boot" transform="translate(141,419) scale(-1,1)"/>
        
          <path d="M 100 232 C 133 232 156 256 162 298 C 166.5 330 140 356 100 356 C 60 356 33.5 330 38 298 C 44 256 67 232 100 232 Z" fill="url(#gvs-bodyGrad)" stroke="#9C6740" strokeOpacity="0.3" strokeWidth="1.5"/>
          <g clipPath="url(#gvs-bodyClip)">
            <ellipse cx="97" cy="314" rx="36" ry="27" fill="#FAEDCB" opacity="0.5"/>
            <path d="M 48 244 C 60 234 76 236 80 248 C 84 260 74 272 60 272 C 46 272 40 254 48 244 Z" fill="url(#gvs-patchGrad)"/>
            <path d="M 30 286 C 44 278 58 284 60 298 C 62 314 50 324 36 320 C 22 316 20 296 30 286 Z" fill="url(#gvs-patchGrad)" opacity="0.96"/>
            <path d="M 46 330 C 58 322 72 328 74 342 C 76 356 62 364 50 358 C 38 352 36 338 46 330 Z" fill="url(#gvs-patchGrad)"/>
            <path d="M 126 332 C 138 324 152 330 154 344 C 156 358 142 366 130 360 C 118 354 116 340 126 332 Z" fill="url(#gvs-patchGrad)" opacity="0.96"/>
            <path d="M 140 280 C 154 274 168 282 168 298 C 168 314 156 322 142 316 C 128 310 128 288 140 280 Z" fill="url(#gvs-patchGrad)"/>
            <path d="M 122 240 C 136 234 150 240 150 254 C 150 266 138 272 126 268 C 114 264 112 248 122 240 Z" fill="url(#gvs-patchGrad)" opacity="0.97"/>
            <path d="M 92 234 C 100 230 110 232 112 242 C 113 252 104 258 96 256 C 88 253 86 240 92 234 Z" fill="url(#gvs-patchGrad)" opacity="0.95"/>
            <ellipse cx="150" cy="300" rx="26" ry="55" fill="#B07840" opacity="0.18"/>
            <ellipse cx="48" cy="300" rx="22" ry="50" fill="#B07840" opacity="0.14"/>
            <ellipse cx="100" cy="244" rx="30" ry="10" fill="#C79A69" opacity="0.22"/>
          </g>
        
          
        
          <path d="M 86 338 C 87 366 90 388 86 404 C 84.5 411 84 415 84 421" stroke="#C9A470" strokeWidth="9.5" strokeLinecap="round" fill="none"/>
          <path d="M 86 338 C 87 366 90 388 86 404 C 84.5 411 84 415 84 421" stroke="#F2DFBB" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <path d="M 114 338 C 113 366 110 388 114 404 C 115.5 411 116 415 116 421" stroke="#C9A470" strokeWidth="9.5" strokeLinecap="round" fill="none"/>
          <path d="M 114 338 C 113 366 110 388 114 404 C 115.5 411 116 415 116 421" stroke="#F2DFBB" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <ellipse cx="87" cy="366" rx="3" ry="5" fill="url(#gvs-patchGrad)" transform="rotate(6 87 366)"/>
          <ellipse cx="113" cy="372" rx="3" ry="4.6" fill="url(#gvs-patchGrad)" transform="rotate(-6 113 372)"/>
          <use href="#gvs-boot" transform="translate(84,421)"/>
          <use href="#gvs-boot" transform="translate(116,421) scale(-1,1)"/>
        
          </g>

          {/* Snake-curve neck: rises from the shoulders behind the card and
              sweeps left past its edge; the head hangs outside. */}
          <path
            d="M 276 356 C 276 246 248 156 183 88 Q 192 79 204 74 C 240 108 308 224 324 356 Z"
            fill="#EFD9B2"
            stroke="#9C6740"
            strokeOpacity="0.3"
            strokeWidth="1.4"
          />
          <g clipPath="url(#gvs-neckClip)">
            <path d="M 284 296 C 294 290 304 294 305 306 C 306 318 296 324 287 320 C 278 316 277 302 284 296 Z" fill="url(#gvs-patchGrad)"/>
            <path d="M 276 238 C 286 232 296 236 297 248 C 298 260 288 266 279 262 C 270 258 269 244 276 238 Z" fill="url(#gvs-patchGrad)" opacity="0.96"/>
            <path d="M 254 180 C 264 174 274 178 275 189 C 276 200 267 206 258 202 C 249 198 248 187 254 180 Z" fill="url(#gvs-patchGrad)"/>
            <path d="M 234 148 C 244 142 254 146 255 157 C 256 168 247 174 238 170 C 229 166 228 155 234 148 Z" fill="url(#gvs-patchGrad)" opacity="0.96"/>
            <path d="M 208 116 C 216 111 225 114 226 124 C 227 133 219 138 211 135 C 203 131 202 122 208 116 Z" fill="url(#gvs-patchGrad)" opacity="0.9"/>
            <path d="M 300 330 C 308 326 316 330 316 340 C 316 349 308 353 301 350 C 293 346 293 335 300 330 Z" fill="url(#gvs-patchGrad)" opacity="0.94"/>
            <ellipse cx="306" cy="250" rx="12" ry="90" fill="#B07840" opacity="0.14" transform="rotate(8 306 250)"/>
          </g>

          <g transform="translate(209 100) rotate(-38) translate(-100 -80)">
          <g className={styles.head}>
            <path d="M 97 27 C 91 14 85 3 79.5 -4" stroke="#4A331E" strokeWidth="5.4" strokeLinecap="round" fill="none"/>
            <path d="M 103 27 C 109 14 115 3 120.5 -4" stroke="#4A331E" strokeWidth="5.4" strokeLinecap="round" fill="none"/>
            <circle cx="78.5" cy="-5.2" r="4.7" fill="#3E2917"/>
            <circle cx="77.1" cy="-6.6" r="1.4" fill="#6E4E31" opacity="0.9"/>
            <circle cx="121.5" cy="-5.2" r="4.7" fill="#3E2917"/>
            <circle cx="120.1" cy="-6.6" r="1.4" fill="#6E4E31" opacity="0.9"/>
            <path d="M 81 33 C 73 26 61 24.5 56.5 29 C 53.5 32 57 38 64 40.5 C 71 43 78 41 81 37.5 Z" fill="#EFD9B2" stroke="#9C6740" strokeOpacity="0.3" strokeWidth="1"/>
            <path d="M 77 33.5 C 71 29 63 28 60 31 C 58.5 33 61 36.5 66 38 C 71 39.5 75.5 38 77 35.5 Z" fill="#BC5B36" opacity="0.88"/>
            <path d="M 119 33 C 127 26 139 24.5 143.5 29 C 146.5 32 143 38 136 40.5 C 129 43 122 41 119 37.5 Z" fill="#EFD9B2" stroke="#9C6740" strokeOpacity="0.3" strokeWidth="1"/>
            <path d="M 123 33.5 C 129 29 137 28 140 31 C 141.5 33 139 36.5 134 38 C 129 39.5 124.5 38 123 35.5 Z" fill="#BC5B36" opacity="0.88"/>
            <ellipse cx="100" cy="44" rx="21.5" ry="19.5" fill="url(#gvs-headGrad)" stroke="#9C6740" strokeOpacity="0.25" strokeWidth="1.2"/>
            <path d="M 78 54 C 78 42 88 37 100 37 C 112 37 122 42 122 54 C 122 68 113 80 100 80 C 87 80 78 68 78 54 Z" fill="url(#gvs-muzzleGrad)" stroke="#5E2312" strokeOpacity="0.35" strokeWidth="1.2"/>
            <ellipse cx="90" cy="47" rx="8" ry="4.5" fill="#D99062" opacity="0.35" transform="rotate(-18 90 47)"/>
            <path d="M 90.5 47 C 88.5 49 88 52 89.5 54.5" stroke="#4F1F12" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
            <path d="M 109.5 47 C 111.5 49 112 52 110.5 54.5" stroke="#4F1F12" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
            <path d="M 95 71 Q 100 74.5 105 71" stroke="#6E2F1C" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6"/>
            <g>
              <circle cx="82" cy="19" r="16.5" fill="url(#gvs-eyeGrad)"/>
              <path d="M 68.5 28.5 A 16.5 16.5 0 0 0 95.5 28.5" stroke="#C6B99F" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55"/>
              <g className={styles.pupil}>
                <circle cx="84" cy="22.5" r="4.8" fill="#3A2317"/>
                <circle cx="86" cy="20.5" r="1.7" fill="#FFFFFF" opacity="0.95"/><circle cx="81" cy="24.5" r="0.9" fill="#FFFFFF" opacity="0.45"/>
              </g>
              <ellipse className={`${styles.lid} ${styles.lidLeft}`} cx="82" cy="19" rx="16.9" ry="16.9" fill="#F0DCB8"/>
            </g>
            <g>
              <circle cx="118" cy="19" r="16.5" fill="url(#gvs-eyeGrad)"/>
              <path d="M 104.5 28.5 A 16.5 16.5 0 0 0 131.5 28.5" stroke="#C6B99F" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55"/>
              <g className={styles.pupil}>
                <circle cx="116" cy="22.5" r="4.8" fill="#3A2317"/>
                <circle cx="118" cy="20.5" r="1.7" fill="#FFFFFF" opacity="0.95"/><circle cx="113" cy="24.5" r="0.9" fill="#FFFFFF" opacity="0.45"/>
              </g>
              <ellipse className={`${styles.lid} ${styles.lidRight}`} cx="118" cy="19" rx="16.9" ry="16.9" fill="#F0DCB8"/>
            </g>
          </g>
          </g>
      </svg>
    </div>
  );
}
