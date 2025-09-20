import CryptoJS from 'crypto-js';
const pass = import.meta.VITE_APP_REACT_APP_DES_PASS
export const encryptPassword = plainPassword => {
  const key = CryptoJS.enc.Utf8.parse("12345678");
  const encrypted = CryptoJS.DES.encrypt(plainPassword, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // no encodeURIComponent
};


/**
* Encrypts a password using HMAC-SHA256 and encodes it in Base64.
* @param {string} password - The plain text password
* @param {string} secretKey - The secret key for HMAC (default: "12345678")
* @returns {string} - Base64 encoded HMAC-SHA256 hash
*/
export function encryptloginPass(password, secretKey = "12345678") {
  const hash = CryptoJS.HmacSHA256(password, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}