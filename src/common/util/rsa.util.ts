import * as crypto from 'crypto';
import * as fs from 'fs';
import * as forge from 'node-forge';
import * as path from 'path';
import { injectableDotEnvironment } from './dotenv.util';

injectableDotEnvironment(process.env.NODE_ENV);

const cwd = process.cwd();
const passphrasePath = path.resolve(cwd, process.env.RSA_PASSPHRASE_PATH);
const publicKeyPath = path.resolve(cwd, process.env.RSA_PUBLIC_KEY_PATH);
const privateKeyPath = path.resolve(cwd, process.env.RSA_PRIVATE_KEY_PATH);

export function getPassphrase() {
  return fs.readFileSync(passphrasePath, 'utf8');
}

export function getPrivateKeyPem() {
  return fs.readFileSync(privateKeyPath, 'utf8');
}

export function getPublicKeyPem() {
  return fs.readFileSync(publicKeyPath, 'utf8');
}

const passphrase = getPassphrase();
const privateKeyPem = getPrivateKeyPem();
const publicKeyPem = getPublicKeyPem();

export function encodeToBase64(data: string): string {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  });

  return forge.util.encode64(encrypted);
}

export function decodeFromBase64(encryptedData: string): string {
  const privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, passphrase);
  const decodedData = forge.util.decode64(encryptedData);

  const decrypted = privateKey.decrypt(decodedData, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  });

  return decrypted;
}

export function encryptToAes(data: string): {
  encryptedData: string;
  encryptedKey: string;
  iv: string;
} {
  const aesKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encryptedData = cipher.update(data, 'utf-8', 'base64');
  encryptedData += cipher.final('base64');

  const encryptedKey = crypto.publicEncrypt(publicKeyPem, aesKey);

  return {
    encryptedData,
    encryptedKey: encryptedKey.toString('base64'),
    iv: iv.toString('base64'),
  };
}

export function decryptFromAES(
  encryptedData: string,
  encryptedKey: string,
  iv: string,
): string {
  const privateKey = crypto.createPrivateKey({
    key: privateKeyPem,
    format: 'pem',
    passphrase,
  });

  const aesKey = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedKey, 'base64'),
  );

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    aesKey,
    Buffer.from(iv, 'base64'),
  );
  let decryptedData = decipher.update(encryptedData, 'base64', 'utf-8');
  decryptedData += decipher.final('utf-8');

  return decryptedData;
}
