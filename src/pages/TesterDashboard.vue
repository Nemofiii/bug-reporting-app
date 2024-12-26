<template>
    <div class="q-pa-md">
      <h2 class="text-h4 q-mb-md text-center">Tester Dashboard</h2>
      <q-btn label="Report New Bug" @click="showBugForm = true" class="bg-light-blue-10 text-white q-mb-md report-bug-btn" />
      <BugList :bugs="bugs"/>
      <q-dialog v-model="showBugForm">
        <q-card style="width: 90vw; max-width: 700px;">
          <q-card-section>
            <div class="text-h6 text-bold">Report New Bug</div>
          </q-card-section>
          <q-card-section>
            <BugForm @submit="onBugSubmitted" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import BugList from '../components/BugList.vue';
  import BugForm from '../components/BugForm.vue';
  import { useBugStore } from '../stores/bugStore';
  import { useUserStore } from '../stores/userStore';

  export default {
    components: { BugList, BugForm },
    setup() {
      const showBugForm = ref(false);
      const bugStore = useBugStore();
      const userStore = useUserStore();

      const bugs = computed(() => bugStore.bugs || []);

      const onBugSubmitted = () => {
        showBugForm.value = false;
      };

      const reportedBugs = computed(() => 
        bugStore.bugs.filter(bug => bug.reportedBy === userStore.currentUser.name || 'No data')
        // && bug.status !== 'Completed'
      );

      return {
        showBugForm,
        onBugSubmitted,
        bugs,
        reportedBugs
      };
    }
  };
  </script>

<style scoped>
.report-bug-btn {
  width: auto;
}

@media (max-width: 600px) {
  .report-bug-btn {
    width: 100%;
  }
}
</style>