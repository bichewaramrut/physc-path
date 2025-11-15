/**
 * Advanced security utilities for healthcare data
 * 
 * This file contains security utilities for encrypting sensitive medical data,
 * implementing HIPAA-compliant security measures, and securing client-side storage.
 */

// Constants for security configuration
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const HASH_ALGORITHM = 'SHA-256';
const PBKDF2_ITERATIONS = 100000;

/**
 * Generate a secure encryption key from a password
 * 
 * @param password User password or secret key
 * @param salt Salt for key derivation
 * @returns Promise resolving to CryptoKey
 */
export async function generateEncryptionKey(password: string, salt: Uint8Array | ArrayBuffer): Promise<CryptoKey> {
  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Import key material
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', 
    passwordBuffer, 
    'PBKDF2', 
    false, 
    ['deriveBits', 'deriveKey']
  );
  
  // Derive key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt sensitive medical data
 * 
 * @param plaintext Data to encrypt
 * @param encryptionKey CryptoKey for encryption
 * @returns Promise resolving to encrypted data with IV
 */
export async function encryptMedicalData(plaintext: string, encryptionKey: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  // Generate a random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Encrypt the data
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: ENCRYPTION_ALGORITHM,
      iv
    },
    encryptionKey,
    data
  );
  
  // Combine IV and encrypted data
  const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  encryptedArray.set(iv);
  encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);
  
  // Convert to base64 for storage or transmission
  return btoa(Array.from(encryptedArray)
    .map(byte => String.fromCharCode(byte))
    .join(''));
}

/**
 * Decrypt encrypted medical data
 * 
 * @param encryptedData Base64 encoded encrypted data with IV
 * @param encryptionKey CryptoKey for decryption
 * @returns Promise resolving to decrypted data
 */
export async function decryptMedicalData(encryptedData: string, encryptionKey: CryptoKey): Promise<string> {
  // Convert base64 to array
  const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  // Extract IV and encrypted data
  const iv = encryptedBytes.slice(0, IV_LENGTH);
  const data = encryptedBytes.slice(IV_LENGTH);
  
  // Decrypt the data
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: ENCRYPTION_ALGORITHM,
      iv
    },
    encryptionKey,
    data
  );
  
  // Convert to string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Generate a secure hash of data
 * 
 * @param data Data to hash
 * @returns Promise resolving to hash as hex string
 */
export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const hashBuffer = await window.crypto.subtle.digest(HASH_ALGORITHM, dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Securely store sensitive data in localStorage with encryption
 * 
 * @param key Storage key
 * @param data Data to store
 * @param userKey User-specific encryption key
 * @returns Promise resolving when storage is complete
 */
export async function secureLocalStorage(key: string, data: any, userKey: string): Promise<void> {
  try {
    // Generate salt for key derivation
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Generate encryption key
    const encryptionKey = await generateEncryptionKey(userKey, salt);
    
    // Encrypt data
    const jsonData = JSON.stringify(data);
    const encryptedData = await encryptMedicalData(jsonData, encryptionKey);
    
    // Store with salt
    localStorage.setItem(`${key}_salt`, btoa(Array.from(salt)
      .map(byte => String.fromCharCode(byte))
      .join('')));
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error('Failed to securely store data:', error);
    throw error;
  }
}

/**
 * Retrieve securely stored data from localStorage
 * 
 * @param key Storage key
 * @param userKey User-specific encryption key
 * @returns Promise resolving to decrypted data
 */
export async function getSecureLocalStorage<T>(key: string, userKey: string): Promise<T | null> {
  try {
    const encryptedData = localStorage.getItem(key);
    const saltBase64 = localStorage.getItem(`${key}_salt`);
    
    if (!encryptedData || !saltBase64) {
      return null;
    }
    
    // Convert salt from base64
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    
    // Generate encryption key
    const encryptionKey = await generateEncryptionKey(userKey, salt);
    
    // Decrypt data
    const decryptedJson = await decryptMedicalData(encryptedData, encryptionKey);
    
    return JSON.parse(decryptedJson) as T;
  } catch (error) {
    console.error('Failed to retrieve secure data:', error);
    return null;
  }
}

/**
 * Check if the client environment is secure for healthcare data
 * 
 * @returns Information about security capabilities
 */
export function checkEnvironmentSecurity(): {
  webCryptoSupport: boolean;
  secureContext: boolean;
  httpsConnection: boolean;
  privateMode: boolean;
  storageAvailable: boolean;
} {
  return {
    webCryptoSupport: !!window.crypto && !!window.crypto.subtle,
    secureContext: window.isSecureContext,
    httpsConnection: window.location.protocol === 'https:',
    privateMode: detectPrivateMode(),
    storageAvailable: storageAvailable()
  };
}

/**
 * Detect if the browser is in private/incognito mode
 * 
 * @returns Boolean indicating if private mode is detected
 */
function detectPrivateMode(): boolean {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return false;
  } catch (e) {
    return true;
  }
}

/**
 * Check if localStorage is available
 * 
 * @returns Boolean indicating if localStorage is available
 */
function storageAvailable(): boolean {
  try {
    const storage = window.localStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Mask sensitive patient information for display
 * 
 * @param info Sensitive information to mask
 * @param maskChar Character to use for masking
 * @param showLastN Number of characters to show at the end
 * @returns Masked string
 */
export function maskSensitiveInfo(info: string, maskChar: string = '*', showLastN: number = 4): string {
  if (!info || info.length <= showLastN) {
    return info;
  }
  
  const visiblePart = info.slice(-showLastN);
  const maskedPart = maskChar.repeat(info.length - showLastN);
  
  return maskedPart + visiblePart;
}

/**
 * Sanitize potentially harmful HTML/JS in user input
 * 
 * @param input User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeUserInput(input: string): string {
  const element = document.createElement('div');
  element.textContent = input;
  return element.innerHTML;
}

/**
 * Create an audit log entry for sensitive data access
 * 
 * @param action The action performed (view, edit, delete, etc.)
 * @param dataType Type of data accessed (prescription, medical record, etc.)
 * @param dataId ID of the accessed data
 * @param userId ID of the user performing the action
 * @returns Promise resolving when log is created
 */
export async function createAuditLogEntry(
  action: string,
  dataType: string,
  dataId: string,
  userId: string
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const clientInfo = {
      userAgent: navigator.userAgent,
      ip: 'client-side', // Will be populated server-side
      timestamp
    };
    
    // Send audit log to server
    await fetch('/api/security/audit-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        dataType,
        dataId,
        userId,
        clientInfo
      })
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Even if client-side logging fails, server-side should still capture this
  }
}

/**
 * Redact sensitive information from medical data for display
 * 
 * @param data Medical data object
 * @param fieldsToRedact Fields to redact
 * @returns Copy of data with sensitive fields redacted
 */
export function redactSensitiveData<T extends Record<string, any>>(
  data: T,
  fieldsToRedact: string[] = ['ssn', 'dob', 'address', 'phoneNumber', 'email']
): T {
  // Create a deep copy to avoid modifying original data
  const redactedData = JSON.parse(JSON.stringify(data)) as Record<string, any>;
  
  // Redact specified fields
  fieldsToRedact.forEach(field => {
    if (field in redactedData) {
      redactedData[field] = '██████████';
    }
  });
  
  return redactedData as T;
}

/**
 * Check if data access is authorized for the current user
 * 
 * @param dataType Type of data being accessed
 * @param dataId ID of the data being accessed
 * @param requiredPermissions Permissions required for access
 * @returns Promise resolving to authorization result
 */
export async function checkDataAccessAuthorization(
  dataType: string,
  dataId: string,
  requiredPermissions: string[] = ['view']
): Promise<boolean> {
  try {
    // Request authorization check from server
    const response = await fetch('/api/security/check-authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataType,
        dataId,
        requiredPermissions,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Authorization check failed');
    }
    
    const result = await response.json();
    return result.authorized === true;
  } catch (error) {
    console.error('Authorization check error:', error);
    return false; // Default to denied access on error
  }
}

/**
 * Generate a secure session key for encrypting sensitive data during the current session
 * 
 * @returns Promise resolving to session key
 */
export async function generateSecureSessionKey(): Promise<CryptoKey> {
  // Generate a random key for this session only
  return window.crypto.subtle.generateKey(
    {
      name: ENCRYPTION_ALGORITHM,
      length: KEY_LENGTH
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Apply HIPAA-compliant security measures to patient data
 * 
 * @param patientData Patient data object 
 * @param securityLevel Level of security to apply (standard, high, extreme)
 * @returns Secured data object
 */
export function applyHIPAACompliance<T extends Record<string, any>>(
  patientData: T,
  securityLevel: 'standard' | 'high' | 'extreme' = 'standard'
): T {
  // Create a deep copy to avoid modifying original data
  const securedData = JSON.parse(JSON.stringify(patientData)) as Record<string, any>;
  
  // Fields to protect based on security level
  const standardFields = ['ssn', 'dob', 'phoneNumber'];
  const highFields = [...standardFields, 'address', 'email', 'insuranceId'];
  const extremeFields = [...highFields, 'name', 'gender', 'medications'];
  
  let fieldsToProtect: string[];
  
  switch (securityLevel) {
    case 'extreme':
      fieldsToProtect = extremeFields;
      break;
    case 'high':
      fieldsToProtect = highFields;
      break;
    default:
      fieldsToProtect = standardFields;
  }
  
  // Apply protection to fields
  fieldsToProtect.forEach(field => {
    if (field in securedData) {
      // Apply different protections based on security level
      if (securityLevel === 'extreme') {
        // Remove data entirely from client
        delete securedData[field];
      } else if (securityLevel === 'high') {
        // Mask data
        if (typeof securedData[field] === 'string') {
          securedData[field] = maskSensitiveInfo(securedData[field], '█');
        } else {
          securedData[field] = '██████████';
        }
      } else {
        // Standard - partial masking
        if (typeof securedData[field] === 'string') {
          securedData[field] = maskSensitiveInfo(securedData[field]);
        }
      }
    }
  });
  
  // Add security metadata
  securedData.__securityApplied = {
    level: securityLevel,
    timestamp: new Date().toISOString(),
    fieldsProtected: fieldsToProtect
  };
  
  return securedData as T;
}
