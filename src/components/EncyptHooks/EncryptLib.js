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



const encrypted1 = "0Ut8avv+ruk1pUmsCVOfgkzYcNapuqGikxyGPyF/NGfR4iHURyVcGtn0WVEgefYk";
const key1 = CryptoJS.enc.Utf8.parse("1234567812345678"); // 16 chars key
const iv = CryptoJS.enc.Utf8.parse("1234567812345678");  // must match the encryption IV

const decrypted1 = CryptoJS.AES.decrypt(
  { ciphertext: CryptoJS.enc.Base64.parse(encrypted1) },
  key1,
  {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }
).toString(CryptoJS.enc.Utf8);

console.log("Decrypted:", decrypted1);



/* const text = "Hello World";
const key = "12345678";

// Encrypt
const encrypted = CryptoJS.AES.encrypt(text, key).toString();
console.log("Encrypted:", encrypted);

// Decrypt immediately
const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
console.log("Decrypted:", decrypted); // Should print "Hello World"
 */


