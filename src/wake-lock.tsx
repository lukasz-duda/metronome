import { useRef } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel>(null);

  async function requestScreenWakeLock() {
    wakeLockRef.current = await navigator.wakeLock.request("screen");
  }

  function releaseWakeLock() {
    wakeLockRef.current?.release();
    wakeLockRef.current = null;
  }

  return {
    requestScreenWakeLock,
    releaseWakeLock,
  };
}
