import crypto from 'crypto';

// Basic 2FA service implementation
// In production, you might want to use libraries like 'speakeasy' or 'otpauth'

export const generateSecret = (email: string): string => {
  // Generate a base32 secret (simplified version)
  const secret = crypto.randomBytes(20).toString('base64').replace(/[^A-Za-z0-9]/g, '').substring(0, 32);
  return secret;
};

export const generateQRCode = async (label: string, secret: string): Promise<string> => {
  // In production, use a QR code library like 'qrcode'
  // For now, return a placeholder URL
  const otpUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=HerShield`;
  
  // This would normally generate a QR code image
  // For demo purposes, return the otpauth URL
  return otpUrl;
};

export const verifyToken = (token: string, secret: string): boolean => {
  // In production, implement proper TOTP verification
  // This is a simplified placeholder
  return token.length === 6 && /^\d{6}$/.test(token);
};

export const generateBackupCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(5).toString('hex').toUpperCase());
  }
  return codes;
};
