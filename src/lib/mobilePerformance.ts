/**
 * Mobile Performance Utilities
 * Optimize animations and rendering based on network conditions
 */

export interface NetworkStatus {
  isSlowNetwork: boolean;
  effectiveType: '4g' | '3g' | '2g' | '5g' | 'unknown';
  saveData: boolean;
}

/**
 * Get current network status (for mobile optimization)
 */
export const getNetworkStatus = (): NetworkStatus => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;

  if (connection) {
    return {
      effectiveType: connection.effectiveType || 'unknown',
      isSlowNetwork: connection.effectiveType === '3g' || connection.effectiveType === '4g',
      saveData: connection.saveData || false,
    };
  }

  return {
    effectiveType: 'unknown',
    isSlowNetwork: false,
    saveData: false,
  };
};

/**
 * Reduce animation duration for slow networks
 */
export const getAnimationDuration = (
  normalDuration: number,
  networkStatus?: NetworkStatus
): number => {
  if (!networkStatus) {
    networkStatus = getNetworkStatus();
  }
  
  // On slow networks or with save-data enabled, reduce animations
  if (networkStatus.isSlowNetwork || networkStatus.saveData) {
    return Math.min(normalDuration * 0.5, 0.2); // Max 0.2s on slow networks
  }
  
  return normalDuration;
};

/**
 * Defer heavy operations until the main thread is idle
 */
export const deferHeavyWork = (
  callback: () => void,
  fallbackDelay: number = 1000
): (() => void) => {
  let timeoutId: number;

  if ('requestIdleCallback' in window) {
    const idleId = requestIdleCallback(callback, { timeout: fallbackDelay });
    return () => cancelIdleCallback(idleId);
  } else {
    timeoutId = setTimeout(callback, fallbackDelay) as any;
    return () => clearTimeout(timeoutId);
  }
};

/**
 * Preload images for better mobile performance
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Check if device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get viewport dimensions
 */
export const getViewportDimensions = (): { width: number; height: number } => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
};
