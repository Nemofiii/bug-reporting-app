import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    users: [
      { id: 1, name: 'Tester1', role: 'tester' },
      { id: 2, name: 'Admin1', role: 'admin' },
      { id: 3, name: 'Dev1', role: 'developer' },
    ]
  }),
  getters: {
    isAdmin: (state) => state.currentUser && state.currentUser.role === 'admin',
    isTester: (state) => state.currentUser && state.currentUser.role === 'tester',
    isDeveloper: (state) => state.currentUser && state.currentUser.role === 'developer',
  },
  actions: {
    login(userId) {
      this.currentUser = this.users.find(user => user.id === userId);
    },
    logout() {
      this.currentUser = null;
    },

    addUser(user) {
      this.users.push({
        ...user,
        id: this.users.length + 1
      });
      console.log('User added:', user)
    }
  }
});