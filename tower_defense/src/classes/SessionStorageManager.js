export class SessionStorageManager {
  constructor(prefix) {
    this.prefix = prefix || "";
  }

  setItem(key, value) {
    if (typeof key !== "string" || typeof value === "undefined") {
      throw new Error("Key and value must be provided");
    }

    sessionStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
  }

  getItem(key) {
    if (typeof key !== "string") {
      throw new Error("Key must be provided");
    }

    const item = sessionStorage.getItem(`${this.prefix}${key}`);
    if (item) {
      return JSON.parse(item);
    }

    return null;
  }

  removeItem(key) {
    if (typeof key !== "string") {
      throw new Error("Key must be provided");
    }

    sessionStorage.removeItem(`${this.prefix}${key}`);
  }

  clear() {
    const prefixLength = this.prefix.length;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith(this.prefix)) {
        sessionStorage.removeItem(key);
      }
    }
  }
}
