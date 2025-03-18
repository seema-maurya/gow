import LZString from "lz-string";

// Utility function to cache data with compression
export const cacheDataWithTimestamp = (key, data) => {
  const compressedData = LZString.compressToUTF16(JSON.stringify(data)); // Compress the data
  const cache = {
    data: compressedData,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(key, JSON.stringify(cache));
};

// Utility function to retrieve compressed data and check if it's expired
export const getCacheDataWithTimestamp = (
  key,
  expirationTime = 5 * 60 * 1000
) => {
  const cachedData = JSON.parse(sessionStorage.getItem(key));
  if (!cachedData) return null;

  // Check if the cached data is still valid (not expired)
  if (Date.now() - cachedData.timestamp > expirationTime) {
    sessionStorage.removeItem(key); // Remove expired cache
    return null;
  }

  const decompressedData = LZString.decompressFromUTF16(cachedData.data); // Decompress the data
  return JSON.parse(decompressedData); // Return the decompressed data
};
