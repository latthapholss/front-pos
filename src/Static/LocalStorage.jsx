const localStorageKeys = {
  loginSession: 'login_session',
};

class LocalStorage {
  constructor() {
    if (!LocalStorage.instance) {
      this.storage = window.localStorage;
      LocalStorage.instance = this;
    }

    return LocalStorage.instance;
  }

  getItem(key) {
    return this.storage.getItem(key);
  }

  setItem(key, value) {
    this.storage.setItem(key, value);
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }
}

const instance = new LocalStorage();
Object.freeze(instance);

export { instance as LocalStorage, localStorageKeys };
  