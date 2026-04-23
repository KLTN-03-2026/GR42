export const encodeId = (id: number | string): string => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numId)) return id.toString();
  
  const encoded = numId * 1357 + 246810;
  return encoded.toString();
};

export const decodeId = (encoded: string): string => {
  const numEncoded = parseInt(encoded, 10);
  if (isNaN(numEncoded)) return encoded;
  
  const decoded = (numEncoded - 246810) / 1357;
  
  if (decoded % 1 !== 0) return encoded;
  
  return decoded.toString();
};
