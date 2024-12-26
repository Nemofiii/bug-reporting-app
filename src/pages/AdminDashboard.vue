<template>
    <div class="q-pa-md">
      <h2 class="text-h4 q-mb-md text-center">Admin Dashboard</h2>

      <!-- Bug Status Knobs -->
    <div class="row justify-center q-mb-md q-col-gutter-md">
      <div class="col-12 col-sm-4 col-md-3 flex flex-center">
        <q-knob
          v-model="pendingBugs"
          :min="0"
          :max="totalBugs"
          show-value
          size="120px"
          color="orange"
          track-color="grey-3"
          class="q-ma-md"
        >
          <div class="text-center">
            <div class="text-h6">{{ pendingBugs }}</div>
            <div class="text-subtitle1">Pending</div>
          </div>
        </q-knob>
      </div>
      <div class="col-12 col-sm-4 col-md-3 flex flex-center">
        <q-knob
          v-model="completedBugs"
          :min="0"
          :max="totalBugs"
          show-value
          size="120px"
          color="green"
          track-color="grey-3"
          class="q-ma-md"
        >
          <div class="text-center">
            <div class="text-h6">{{ completedBugs }}</div>
            <div class="text-subtitle1">Completed</div>
          </div>
        </q-knob>
      </div>
      <div class="col-12 col-sm-4 col-md-3 flex flex-center">
        <q-knob
          v-model="totalBugs"
          :min="0"
          :max="totalBugs"
          show-value
          size="120px"
          color="primary"
          track-color="grey-3"
          class="q-ma-md"
        >
          <div class="text-center">
            <div class="text-h6">{{ totalBugs }}</div>
            <div class="text-subtitle1">Total</div>
          </div>
        </q-knob>
      </div>
    </div>

      <!-- Add User Button -->
    <!-- <q-btn
      label="Add New User"
      class="bg-light-blue-10 text-white q-mt-md"
      @click="showUserForm = true"
    /> -->

    <!-- Add User Dialog -->
    <!-- <q-dialog v-model="showUserForm">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add New User</div>
        </q-card-section>

        <q-card-section>
          <AddUserForm @user-added="onUserAdded" />
        </q-card-section>
      </q-card>
    </q-dialog> -->

      <BugList :bugs="allBugs" />

      <q-dialog v-model="showAssignForm">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Assign Bug</div>
          </q-card-section>
          <q-card-section>
            <AssignBugForm :bug="selectedBug" @assigned="onBugAssigned" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useBugStore } from '../stores/bugStore';
  import BugList from '../components/BugList.vue';
  import AssignBugForm from '../components/AssignBugForm.vue';
  // import AddUserForm from '../components/AddUserForm.vue';
  // import { useUserStore } from 'src/stores/userStore';

  export default {
    components: { BugList, AssignBugForm },
    setup() {
      const bugStore = useBugStore();
      const tab = ref('all');
      const showAssignForm = ref(false);
      const selectedBug = ref(null);
      
      // const showUserForm = ref(false);

      const allBugs = computed(() => bugStore.bugs);

    //   const selectedPriority = ref('all');

    // const priorityOptions = [
    //   { label: 'All Bugs', value: 'all' },
    //   { label: 'Low Priority', value: 'Low' },
    //   { label: 'Medium Priority', value: 'Medium' },
    //   { label: 'High Priority', value: 'High' },
    //   { label: 'Critical Priority', value: 'Critical' },
    // ];

    // const filteredBugs = computed(() => {
    //   if (selectedPriority.value === 'all') {
    //     console.log('Returning all bugs:', bugStore.bugs);
    //     return bugStore.bugs;
    //   }
    //   const filtered = bugStore.getBugsByPriority(selectedPriority.value);
    //   console.log('Filtered bugs:', filtered);
    //   return filtered;
    // });

    // const onPriorityChange = (value) => {
    //   console.log('Priority changed to:', value);
    // };

    // watch(selectedPriority, (newValue) => {
    //   console.log('selectedPriority changed to:', newValue);
    // });

      const onAssign = (bug) => {
        selectedBug.value = bug;
        showAssignForm.value = true;
      };
  
      const onBugAssigned = () => {
        showAssignForm.value = false;
      };
      

      const totalBugs = computed(() => allBugs.value.length)
      const pendingBugs = computed(() => allBugs.value.filter(bug => bug.status !=='Completed').length)
      const completedBugs = computed(() => allBugs.value.filter(bug => bug.status === 'Completed').length)

    //   const onUserAdded = () => {
    //   showUserForm.value = false;
    // };
  
      return {
        tab,
        // selectedPriority,
        // priorityOptions,
        // filteredBugs,
        // onPriorityChange,
        showAssignForm,
        selectedBug,
        onAssign,
        onBugAssigned,
        allBugs,
        totalBugs,
        pendingBugs,
        completedBugs,
        // showUserForm,
        // onUserAdded
      };
    }
  };
  </script>

<style>
   @media (max-width: 599px) {
    .q-knob {
      width: 100px !important;
      height: 100px !important;
    }
   }
</style>