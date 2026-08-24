import { useEffect, useRef } from 'react';

interface UseGazeTrackingOptions {
  usernameFocused: boolean;
  usernameLength: number;
  passwordFocused: boolean;
  passwordLength: number;
}

interface PointerPosition {
  x: number;
  y: number;
}

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(Math.max(value, min), max);

/**
 * Publishes the gaze direction as two unitless ratios in the -1..1 range.
 *
 * The raccoon mascot resolved pupil offsets to pixels because its eyes were
 * raster layers. The giraffe is drawn in SVG user units, so the ratios stay
 * abstract here and the stylesheet decides how far a pupil, an eyelid or the
 * whole head is allowed to travel.
 */
export function useGazeTracking({
  usernameFocused,
  usernameLength,
  passwordFocused,
  passwordLength,
}: UseGazeTrackingOptions) {
  const mascotRef = useRef<HTMLDivElement>(null);

  const latestPointer = useRef<PointerPosition>({
    x: 0,
    y: 0,
  });

  const pointerInitialized = useRef(false);

  const inputFocused =
    usernameFocused || passwordFocused;

  useEffect(() => {
    const mascot = mascotRef.current;

    if (!mascot) {
      return;
    }

    let animationFrameId: number | null = null;

    if (!pointerInitialized.current) {
      latestPointer.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      pointerInitialized.current = true;
    }

    const updatePointerGaze = () => {
      const bounds = mascot.getBoundingClientRect();

      const centerX =
        bounds.left + bounds.width / 2;

      // The eyes sit near the top of the artwork, not at its centre.
      const centerY =
        bounds.top + bounds.height * 0.09;

      const horizontal = clamp(
        (
          latestPointer.current.x - centerX
        ) / (window.innerWidth * 0.3),
        -1,
        1,
      );

      // The eye line sits near the top of the viewport, so almost the
      // whole screen is below it. Upward gaze gets a much shorter runway
      // than downward, or the eyes would never visibly look up.
      const dy = latestPointer.current.y - centerY;

      const vertical = clamp(
        dy / (window.innerHeight * (dy < 0 ? 0.08 : 0.3)),
        -1,
        1,
      );

      mascot.style.setProperty(
        '--gaze-x',
        `${horizontal.toFixed(3)}`,
      );

      mascot.style.setProperty(
        '--gaze-y',
        `${vertical.toFixed(3)}`,
      );

      animationFrameId = null;
    };

    const requestGazeUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId =
        window.requestAnimationFrame(
          updatePointerGaze,
        );
    };

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      if (event.pointerType !== 'mouse') {
        return;
      }

      latestPointer.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (!inputFocused) {
        requestGazeUpdate();
      }
    };

    const handleResize = () => {
      if (!inputFocused) {
        requestGazeUpdate();
      }
    };

    window.addEventListener(
      'pointermove',
      handlePointerMove,
      { passive: true },
    );

    window.addEventListener(
      'resize',
      handleResize,
      { passive: true },
    );

    if (!inputFocused) {
      updatePointerGaze();
    }

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove,
      );

      window.removeEventListener(
        'resize',
        handleResize,
      );

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }
    };
  }, [inputFocused]);

  useEffect(() => {
    const mascot = mascotRef.current;

    if (!mascot || !inputFocused) {
      return;
    }

    // While a field has focus the giraffe reads along with the caret instead
    // of following the pointer.
    const textLength = passwordFocused
      ? passwordLength
      : usernameLength;

    const progress = clamp(
      textLength / 14,
      0,
      1,
    );

    mascot.style.setProperty(
      '--gaze-x',
      `${(-0.9 + progress * 1.8).toFixed(3)}`,
    );

    mascot.style.setProperty('--gaze-y', '0.85');
  }, [
    inputFocused,
    usernameFocused,
    usernameLength,
    passwordFocused,
    passwordLength,
  ]);

  return mascotRef;
}
