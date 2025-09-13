  import CryptoJS from 'crypto-js'; 

  const pass = import.meta.VITE_APP_REACT_APP_DES_PASS
  
  export const encryptPassword = plainPassword => {
    const key = CryptoJS.enc.Utf8.parse(pass); // 8 char key for DES

    const encrypted = CryptoJS.DES.encrypt(plainPassword, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encodeURIComponent(encrypted.toString()); // Base64 + URL encode
  };