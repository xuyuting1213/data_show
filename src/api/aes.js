import CryptoJS from 'crypto-js';

// 确保这些值是正确的Base64编码字符串，并且长度符合AES的要求。
const ivBase64 = "x8CN1UhWRmry4wXesFfuDA==client_code：LFAzIpqwzMBqGUtNjJZ+bpellt9q+2xs2HKw3PNjwZQQ2YAk5/bj0w+gC9qJOn2zFgLhpaj1zswH3B2HZbLDTWsT2/4N/MhzJwM4sxEjE0DJwYwKcPflbD01hntxYk0hIBF3P0UA6VuQcKLOVbwdJyXIrqwswGqZfSRIjiqv5nU%3D"; // 示例IV，确保是16字节Base64编码
const secretKeyBase64 = "15tyRz7Gz7/aHanqHO/1VbH32TJpZMpAqj3mZjzjWk8="; // 示例秘钥，确保是16或32字节Base64编码

export default {
  decryptWithAES(encryptedData) {
    try {
      // 将Base64编码的IV和秘钥转换为WordArray
      const iv = CryptoJS.enc.Base64.parse(ivBase64);
      const key = CryptoJS.enc.Base64.parse(secretKeyBase64);

      // 解密前检查输入是否为有效字符串
      if (!encryptedData || typeof encryptedData !== 'string') {
        throw new Error('Invalid encrypted data');
      }

      // 尝试解密
      let decrypted;
      try {
        decrypted = CryptoJS.AES.decrypt(
          encryptedData,
          key,
          { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
      } catch (error) {
        console.error('Error during decryption:', error.message);
        throw error;
      }

      // 将解密后的数据转换为字符串
      let decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      // 检查解密后的字符串是否为空或无效
      if (!decryptedString || decryptedString.trim() === '') {
        throw new Error('Decryption resulted in empty or invalid string');
      }

      // 检查是否为有效的 JSON 并返回
      try {
        return JSON.parse(decryptedString);
      } catch (e) {
        console.warn('Decrypted data is not valid JSON:', decryptedString);
        return decryptedString; // 如果不是 JSON，则直接返回字符串
      }
    } catch (error) {
      console.error('解密失败:', error.message);
      throw error;
    }
  },

  exampleUsage() {
    const encryptedData = "your_encrypted_data_string"; // 替换为实际的加密字符串

    try {
      const decryptedData = this.decryptWithAES(encryptedData);
      console.log('解密后的数据:', decryptedData);
    } catch (error) {
      console.error('Error in exampleUsage:', error.message);
    }
  }
}