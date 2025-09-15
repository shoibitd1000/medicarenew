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







