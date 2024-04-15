export class LocalStorageManager {
  constructor(keyPrefix) {
    this.keyPrefix = keyPrefix || "";
  }

  getKey(key) {
    return `${this.keyPrefix}${key}`;
  }

  setItem(key, value) {
    const fullKey = this.getKey(key);
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  getItem(key) {
    const fullKey = this.getKey(key);
    const item = localStorage.getItem(fullKey);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key) {
    const fullKey = this.getKey(key);
    localStorage.removeItem(fullKey);
  }

  clearAll() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.keyPrefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}
