<template>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="bug.title" label="Bug Title" required />
      <q-input v-model="bug.description" type="textarea" label="Description" required />
      <q-select v-model="bug.priority" :options="['Low', 'Medium', 'High', 'Critical']" label="Priority" required />
      <q-input v-model="bug.assignDate" type="date" label="Date of Reporting" required />
      <q-btn label="Submit" type="submit" class="bg-light-blue-10 text-white" />
    </q-form>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useBugStore } from '../stores/bugStore';
  import { useUserStore } from '../stores/userStore';
  
  export default {
    setup() {
      const bugStore = useBugStore();
      const userStore = useUserStore();
  
      const bug = ref({
        title: '',
        description: '',
        priority: '',
        deadline: '',
        status: 'Pending',
        reportedBy: userStore.currentUser.name
      });
  
      const onSubmit = () => {
        if (userStore.currentUser) {
           bugStore.addBug(bug.value);
           // Reset form
           bug.value = {
               title: '',
               description: '',
               priority: '',
               deadline: '',
               status: 'Pending',
               reportedBy: userStore.currentUser.name
            };
        } else {
            console.error('No user logged in');
        }
      };
  
      return {
        bug,
        onSubmit
      };
    }
  };
  </script>