/**
 * A per-frame movement vector written by <TouchJoystick> (a normal DOM
 * overlay, rendered as a sibling of <Canvas>) and read by <WalkControls>
 * (inside the R3F tree) every frame. Plain mutable object on purpose —
 * this is transient input state read 60x/second; wiring it through React
 * state/context would mean either a re-render storm or fighting context's
 * "everything downstream re-renders on change" default for no benefit.
 *
 * forward/strafe are each -1..1. forward: +1 = walking forward. strafe:
 * +1 = strafing right. Both zero = joystick released / not touched.
 */
export const touchMoveVector = { forward: 0, strafe: 0 };

export function resetTouchMove() {
  touchMoveVector.forward = 0;
  touchMoveVector.strafe = 0;
}

/** Cheap capability check — real touch hardware, not just a narrow viewport. */
export function hasTouchSupport(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
