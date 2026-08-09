/**
 * Cleans phone number to international wa.me format
 * Strips spaces, dashes, brackets, and replaces leading '+' or '00'
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  // Keep only digits
  let cleaned = phone.replace(/[^\d]/g, '');
  
  // If starts with 00, strip leading 00
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  
  return cleaned;
}

/**
 * Creates WhatsApp conversation link with pre-filled warm message
 */
export function getWhatsAppUrl(phone: string, personName: string): string {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return '';
  
  const defaultMsg = `السلام عليكم ورحمة الله وبركاته،\nأهلاً وسهلاً بك يا ${personName}، أردت أن أطمئن عليك وأتمنى لك ولأسرتك دوام الصحة والعافية والبركة. 🌿`;
  const encodedMsg = encodeURIComponent(defaultMsg);
  
  return `https://wa.me/${cleaned}?text=${encodedMsg}`;
}

/**
 * Opens WhatsApp conversation gracefully
 */
export function openWhatsApp(phone: string, personName: string): boolean {
  const url = getWhatsAppUrl(phone, personName);
  if (!url) return false;
  
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = url;
    }
    return true;
  } catch (err) {
    console.error('Failed to open WhatsApp:', err);
    return false;
  }
}

/**
 * Opens direct phone call dialer
 */
export function makePhoneCall(phone: string): boolean {
  if (!phone) return false;
  try {
    window.location.href = `tel:${phone.trim()}`;
    return true;
  } catch (err) {
    console.error('Failed to place phone call:', err);
    return false;
  }
}
