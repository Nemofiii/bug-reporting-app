<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section class="row justify-center">
        <img src="~assets/buglogo.png" style="height: 150px;">
      </q-card-section>
      <q-card-section>
        <div class="text-h5 text-bold text-center">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled
            v-model="username"
            label="Username"
            :rules="[val => !!val || 'Username is required']"
          />

          <q-input filled
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
          />

          <div class="q-pt-md">
            <q-btn label="Login" type="submit" style="width: 100%;" class="bg-light-blue-10 text-white" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default {
  name: 'LoginPage',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const $q = useQuasar()

    const username = ref('')
    const password = ref('')

    const onSubmit = () => {
      // Simulate login process
      const user = userStore.users.find(u => u.name.toLowerCase() === username.value.toLowerCase())
      
      if (user) { // In a real app, you'd check the password properly
        userStore.login(user.id)
        
        // Redirect based on user role
        switch(userStore.currentUser.role) {
          case 'tester':
            router.push('/tester')
            break
          case 'admin':
            router.push('/admin')
            break
          case 'developer':
            router.push('/developer')
            break
          default:
            console.error('Unknown user role')
        }
      // } else {
      //   $q.notify({
      //     color: 'negative',
      //     message: 'Invalid username or password'
      //   })
      }
    }

    return {
      username,
      password,
      onSubmit
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 500px;
  height: 550px;
}

@media (max-width: 600px) {
  .login-card {
    width: 90%;
    padding: 10px;
  }
}

</style>