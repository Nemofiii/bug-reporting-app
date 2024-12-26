<template>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select
        v-model="selectedDeveloper"
        :options="developers"
        option-label="name"
        label="Assign to Developer"
        :rules="[val => !!val || 'Please select a developer']"
      />
      <q-input
        v-model="deadline"
        type="date"
        label="Set Deadline"
        :rules="[val => !!val || 'Please set a deadline']"
      />

      <q-select
        v-model="priority"
        label="Update Priority (if any)"
        :options="['Low', 'Medium', 'High', 'Critical']"
        :rules="[val => !!val || 'Please select a priority']"
      />

      <q-btn label="Assign" type="submit" class="bg-light-blue-10 text-white"/>
    </q-form>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useBugStore } from '../stores/bugStore';
  import { useUserStore } from '../stores/userStore';
  
  export default {
    props: ['bug'],
    emits: ['assigned'],
    setup(props, { emit }) {
      const bugStore = useBugStore();
      const userStore = useUserStore();
  
      const selectedDeveloper = ref(null);
      const deadline = ref(props.bug.deadline || null);
      const priority = ref(props.bug.priority || null);
  
      const developers = computed(() => 
        userStore.users.filter(user => user.role === 'developer')
      );

      const onSubmit = () => {
        bugStore.assignBug({ 
          bugId: props.bug.id, 
          developerId: selectedDeveloper.value.name,
          deadline: deadline.value,
          priority: priority.value
        });
        emit('assigned');
      };
  
      return {
        selectedDeveloper,
        deadline,
        priority,
        developers,
        onSubmit
      };
    }
  };
  </script>