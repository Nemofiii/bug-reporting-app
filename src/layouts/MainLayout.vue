<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-light-blue-10" style="height: 55px;">
      <q-toolbar>
        
        <router-link to="/" class="q-ml-md" style="text-decoration: none; color: inherit;">
          <q-toolbar-title class="q-ml-md">
            <q-icon name="pest_control" size="40px"/>
            Bug Mine
          </q-toolbar-title>
        </router-link>

        <q-space />
        
        <q-btn flat @click="logout" v-if="userStore.currentUser">
          Logout
        </q-btn>

        <div class="q-ma-xs float-right" v-if="!userStore.currentUser">
          <q-tabs>
            <q-route-tab to="/login" label="Login" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const logout = () => {
      userStore.logout();
      router.push('/login');
    };

    return {
      userStore,
      logout
    };
  }
};
</script>
