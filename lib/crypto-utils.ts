
export const PUBLIC_KEY_JWK = {
  "key_ops": [
    "encrypt"
  ],
  "ext": true,
  "alg": "RSA-OAEP-256",
  "kty": "RSA",
  "n": "u_CUQojoheMB1Yd90TatBWZrzV6dR3AdmBeqS4lurMot-XJx4kENXElGEWwLYNMdK46e9xurr2dDxdJHz_vMagR4yZ3dQ8p4zXDguCVs_2e9_-gSAwHLgDA4FwLHyogpaRET0nDezU28MFFCvoCDjaQXptX2nHA2z5NGAq9irjPTGwPonuhLL6pe5TfiU7nbX3_qWscbU-MNLmNxBzDCnVkuHqxjgvkxTmF7E8adNLrRhMpUt_Q2qIAhfmDl1xv5w1qU92nqWKJI1ces_stYPMfro5s9ri7BVeRTWgIjzzjcx9iGv0GBm9l7EMLezaMOr7SijWAPgCNaYwxvt2dTtQ",
  "e": "AQAB"
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptMessage(data: any): Promise<{ iv: string; key: string; data: string }> {
  const subtle = globalThis.crypto.subtle;
  // 1. Generate AES key
  const aesKey = await subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 2. Encrypt data with AES
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const encryptedContent = await subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedData
  );

  // 3. Encrypt AES key with RSA Public Key
  const publicKey = await subtle.importKey(
    "jwk",
    PUBLIC_KEY_JWK,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const rawAesKey = await subtle.exportKey("raw", aesKey);
  const encryptedKey = await subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawAesKey
  );

  return {
    iv: arrayBufferToBase64(iv),
    key: arrayBufferToBase64(encryptedKey),
    data: arrayBufferToBase64(encryptedContent)
  };
}

export async function importPrivateKey(jwkStr: string): Promise<CryptoKey> {
  const subtle = globalThis.crypto.subtle;
  const jwk = JSON.parse(jwkStr);
  return subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
}

export async function decryptMessage(encryptedPackage: { iv: string; key: string; data: string }, privateKey: CryptoKey): Promise<any> {
  const subtle = globalThis.crypto.subtle;
  const iv = base64ToArrayBuffer(encryptedPackage.iv);
  const encryptedKey = base64ToArrayBuffer(encryptedPackage.key);
  const encryptedData = base64ToArrayBuffer(encryptedPackage.data);

  // 1. Decrypt AES Key with RSA Private Key
  const rawAesKey = await subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedKey
  );

  const aesKey = await subtle.importKey(
    "raw",
    rawAesKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // 2. Decrypt content
  const decryptedContent = await subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encryptedData
  );

  return JSON.parse(new TextDecoder().decode(decryptedContent));
}
