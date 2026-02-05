/**
 * Device Detection Module
 * Detects device characteristics for rendering fixes
 */

/**
 * Detect iOS devices and add class for rendering fixes
 * iOS Safari needs special handling for liquescent glyphs in the Caeciliae font
 */
export function detectIOS() {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    document.documentElement.classList.add('ios-device');
  }

  return isIOS;
}

