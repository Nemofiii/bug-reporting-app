<template>
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-select
        v-model="status"
        :options="statusOptions"
        label="Update Status"
        :rules="[val => !!val || 'Please select a status']"
      />
      <q-input
        v-model="comments"
        type="textarea"
        label="Comments"
      />
      <q-btn label="Update" type="submit" class="bg-light-blue-10 text-white"/>
    </q-form>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useBugStore } from '../stores/bugStore';
  
  export default {
    props: ['bug'],
    emits: ['updated'],
    setup(props, { emit }) {
      const bugStore = useBugStore();
  
      const status = ref(props.bug.status);
      const comments = ref('');
      const statusOptions = ['In Progress', 'Testing', 'Completed'];
  
      const onSubmit = () => {
        bugStore.updateBugStatus({ 
          bugId: props.bug.id, 
          status: status.value,
          comments: comments.value
        });
        emit('updated');
      };
  
      return {
        status,
        comments,
        statusOptions,
        onSubmit
      };
    }
  };
  </script>