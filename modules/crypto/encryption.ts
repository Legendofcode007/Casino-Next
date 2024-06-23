import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const IV = 'e8a669435342e82a44ea076321f08133';

export const encrypt = async (text: string) => {

  let iv = Buffer.from(IV, 'hex');

  text = text.toString();

  let cipher = crypto.createCipheriv(
    algorithm, Buffer.from(key), iv);

  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');

}

export const decrypt = async (text: string) => {

  text = text.toString();

  let iv = Buffer.from(IV, 'hex');

  //console.log('d iv',iv)

  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
} 