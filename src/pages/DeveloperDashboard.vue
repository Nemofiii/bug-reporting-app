<template>
    <div class="q-pa-md">
      <h2 class="text-h4 q-mb-md text-center">Developer Dashboard</h2>
      <BugList :bugs="assignedBugs"/>
      <!-- <q-tabs v-model="tab" class="text-teal">
        <q-tab name="all" label="All Assigned" />
        <q-tab name="low" label="Low Priority" />
        <q-tab name="medium" label="Medium Priority" />
        <q-tab name="high" label="High Priority" />
        <q-tab name="critical" label="Critical Priority" />
      </q-tabs>
  
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="all">
        <BugList :bugs="assignedBugs" />
      </q-tab-panel>
      <q-tab-panel name="low">
        <BugList :bugs="lowPriorityBugs" />
      </q-tab-panel>
      <q-tab-panel name="medium">
        <BugList :bugs="mediumPriorityBugs" />
      </q-tab-panel>
      <q-tab-panel name="high">
        <BugList :bugs="highPriorityBugs" />
      </q-tab-panel>
      <q-tab-panel name="critical">
        <BugList :bugs="criticalPriorityBugs" />
      </q-tab-panel>
    </q-tab-panels> -->
  
    

      <q-dialog v-model="showUpdateForm">
        <q-card style="width: 90vw; max-width: 700px;">
          <q-card-section>
            <div class="text-h6">Update Bug Status</div>
          </q-card-section>
          <q-card-section>
            <UpdateBugForm :bug="selectedBug" @updated="onBugUpdated" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useBugStore } from '../stores/bugStore';
  import { useUserStore } from '../stores/userStore';
  import BugList from '../components/BugList.vue';
  import UpdateBugForm from '../components/UpdateBugForm.vue';
  
  export default {
    components: { BugList, UpdateBugForm },
    setup() {
      const bugStore = useBugStore();
      const userStore = useUserStore();
      const tab = ref('assigned');
      const showUpdateForm = ref(false);
      const selectedBug = ref(null);
  
      const assignedBugs = computed(() => 
        bugStore.bugs.filter(bug => bug.assignedTo === userStore.currentUser.name)
        // && bug.status !== 'Completed'
      );

      // const lowPriorityBugs = computed(() => 
      //   assignedBugs.value.filter(bug => bug.priority === 'Low')
      // );
      // const mediumPriorityBugs = computed(() => 
      //   assignedBugs.value.filter(bug => bug.priority === 'Medium')
      // );
      // const highPriorityBugs = computed(() => 
      //   assignedBugs.value.filter(bug => bug.priority === 'High')
      // );
      // const criticalPriorityBugs = computed(() => 
      //   assignedBugs.value.filter(bug => bug.priority === 'Critical')
      // );
  
      const onUpdateStatus = (bug) => {
        selectedBug.value = bug;
        showUpdateForm.value = true;
      };
  
      const onBugUpdated = () => {
        showUpdateForm.value = false;
      };
  
      return {
        tab,
        assignedBugs,
        // lowPriorityBugs,
        // mediumPriorityBugs,
        // highPriorityBugs,
        // criticalPriorityBugs,
        showUpdateForm,
        selectedBug,
        onUpdateStatus,
        onBugUpdated
      };
    }
  };
  </script>