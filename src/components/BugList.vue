<template>
  <div>
    <div class="q-mb-md">
      <q-select
        v-model="selectedPriority"
        :options="priorityOptions"
        label="Filter by Priority"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="width: 200px"
        @update:model-value="onPriorityChange"
      />
    </div>

    <!-- Desktop view -->
    <div class="q-pa-md">
      <q-table
      :rows="bugs"
      :columns="columns"
      row-key="id"
      :filter="filter"
      class="desktop-only"
    >
    <template v-slot:body="props">
        <q-tr :props="props" @click="onRowClick(props.row)">
          <q-td v-for="col in props.cols" :key="col.name" :props="props" class="custom-td">
              {{ col.value }}
          </q-td>
          <q-td>
              <q-btn v-if="userStore.isAdmin" label="Assign" @click.stop="onAssign(props.row)" class="text-light-blue-6 q-ml-md" flat dense />
              <q-btn v-if="userStore.isDeveloper" label="Update Status" @click.stop="onUpdateStatus(props.row)" class="text-light-blue-6 q-ml-md" flat dense />
           
          </q-td>
        </q-tr>

        <q-tr v-if="props.row.deadline && props.row.status !== 'Completed'">
          <q-td :colspan="columns.length + 1">
            
            <q-linear-progress
              :value="calculateProgress(props.row.deadline)"
              color="red"
              track-color="grey-3"
              style="width: 100%;"
            />
            <div v-if="calculateProgress !== 0" class="q-mt-xs float-right q-mr-xl">
                {{ daysRemaining(props.row.deadline) }}
            </div>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input placeholder="Search" v-model="filter" dense bordered />
      </template>
    </q-table>
    </div>
    
    <!-- Mobile view -->
    <div class="mobile-only">
      <q-list bordered separator>
        <q-item v-for="bug in bugs" :key="bug.id" @click="onRowClick(bug)" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ bug.title }}</q-item-label>
            <q-item-label caption>ID: {{ bug.id }}</q-item-label>
            <q-item-label caption class="text-green">Status: {{ bug.status }}</q-item-label>
            <q-item-label caption>Priority: {{ bug.priority }}</q-item-label>
            <q-item-label caption class="text-red">Deadline: {{ bug.deadline }}</q-item-label>
            <br>
            <q-item-label caption>Report Date: {{ bug.assignDate }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn v-if="userStore.isAdmin" label="Assign" @click.stop="onAssign(bug)" color="primary" flat dense />
            <q-btn v-if="userStore.isDeveloper" label="Update" @click.stop="onUpdateStatus(bug)" color="primary" flat dense />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Assign Bug Dialog -->
    <q-dialog v-model="showAssignDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Assign Bug</div>
        </q-card-section>
        <q-card-section>
          <AssignBugForm :bug="selectedBug" @assigned="onBugAssigned" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Update Bug Status Dialog -->
    <q-dialog v-model="showUpdateDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Update Bug Status</div>
        </q-card-section>
        <q-card-section>
          <UpdateBugForm :bug="selectedBug" @updated="onBugUpdated" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Bug Details Dialog -->
    <q-dialog v-model="showBugDetailsDialog">
      <q-card :style="dialogStyle">
        <q-card-section>
          <div class="text-h6">Bug Details</div>
        </q-card-section>
        <q-card-section v-if="selectedBug">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label overline>ID</q-item-label>
                <q-item-label>{{ selectedBug.id }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Title</q-item-label>
                <q-item-label>{{ selectedBug.title }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Description</q-item-label>
                <q-item-label>{{ selectedBug.description }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Status</q-item-label>
                <q-item-label>{{ selectedBug.status }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Priority</q-item-label>
                <q-item-label>{{ selectedBug.priority }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Assigned To</q-item-label>
                <q-item-label>{{ selectedBug.assignedTo || 'Not Assigned' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Deadline</q-item-label>
                <q-item-label>{{ selectedBug.deadline || 'Not Set' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Reported By</q-item-label>
                <q-item-label>{{ selectedBug.reportedBy }}</q-item-label>
              </q-item-section>
            </q-item>
            <div class="bg-red text-white">
              <q-item>
                <q-item-section>
                  <q-item-label overline class="text-white">Days Remaining</q-item-label>
                  <q-item-label>{{ daysRemaining(selectedBug.deadline) }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            
          </q-list>
          <br>
          <q-separator />
          <div class="q-mt-md">
            <div class="text-subtitle2">Comments:</div>
            <q-list v-if="selectedBug.comments && selectedBug.comments.length">
              <q-item v-for="comment in selectedBug.comments" :key="comment.date">
                <q-item-section>
                  <q-item-label caption>{{ new Date(comment.date).toLocaleString() }} - {{ comment.user }}</q-item-label>
                  <q-item-label>{{ comment.text }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else>No comments yet.</div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useBugStore } from '../stores/bugStore';
import { useUserStore } from '../stores/userStore';
import AssignBugForm from './AssignBugForm.vue';
import UpdateBugForm from './UpdateBugForm.vue';

export default {
  components: { AssignBugForm, UpdateBugForm },
  props: {
    bugs: {
      type: Array,
      required: true,
    }
    
  },
  setup(props) {
    const $q = useQuasar();
    const bugStore = useBugStore();
    const userStore = useUserStore();
    const filter = ref('');
    const showAssignDialog = ref(false);
    const showUpdateDialog = ref(false);
    const selectedBug = ref(null);
    const showBugDetailsDialog = ref(false);
    const selectedPriority = ref('all');

    // console.log('Bugs received in BugList:', props.bugs);
    const priorityOptions = [
      { label: 'All Bugs', value: 'all' },
      { label: 'Low', value: 'Low' },
      { label: 'Medium', value: 'Medium' },
      { label: 'High', value: 'High' },
      { label: 'Critical', value: 'Critical' },
    ];

    const columns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'title', label: 'Title', field: 'title', sortable: true },
      { name: 'assignDate', label: 'Assigning Date', field: 'assignDate', sortable: true },
      { name: 'status', label: 'Status', field: 'status', sortable: true },
      { name: 'priority', label: 'Priority', field: 'priority', sortable: true },
      { name: 'deadline', label: 'Deadline', field: 'deadline', sortable: true },
      { name: 'assignedTo', label: 'Assigned To', field: 'assignedTo', sortable: true },
    ];

    // const bugs = computed(() => {
    //   console.log('Bugs in store:', bugStore.bugs);
    //   console.log('Current user:', userStore.currentUser);
    //   if (userStore.isDeveloper) {
    //     return bugStore.bugs.filter(bug => bug.assignedTo === userStore.currentUser.name);
    //   }
    //   return bugStore.bugs;
    // });

    const bugs = computed(() => {
      let filteredList = props.bugs;
      if (userStore.isDeveloper) {
        filteredList = filteredList.filter(bug => bug.assignedTo === userStore.currentUser.name);
      }
      if (selectedPriority.value !== 'all') {
        filteredList = filteredList.filter(bug => bug.priority === selectedPriority.value);
      }
      return filteredList;
    });

    const onPriorityChange = (value) => {
      console.log('Priority changed to:', value);
    };

    const onAssign = (bug) => {
      selectedBug.value = bug;
      showAssignDialog.value = true;
    };

    const onUpdateStatus = (bug) => {
      selectedBug.value = bug;
      showUpdateDialog.value = true;
    };

    const onBugAssigned = () => {
      showAssignDialog.value = false;
    };

    const onBugUpdated = () => {
      showUpdateDialog.value = false;
    };

    const onRowClick = (row) => {
      selectedBug.value = row;
      showBugDetailsDialog.value = true;
    };

    const daysRemaining = (deadline) => {
      if(!deadline) return 'No deadline set';

      const today = new Date();
      const deadlineDate = new Date(deadline);
      const timeDifference = deadlineDate - today;
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 *24));

      return daysDifference >= 0 ? daysDifference + ' days to go': "Past Deadline";
    }

    const calculateProgress = (deadline) => {
      if (!deadline) return 0;

      const today = new Date();
      const deadlineDate = new Date(deadline);
      const totalDuration = Math.max(deadlineDate - new Date(props.bugs[0].assignDate), 0);
      const remainingTime = Math.max(deadlineDate - today, 0);
      const progress = 1 - (remainingTime / totalDuration);

      return Math.min(Math.max(progress, 0), 1); // Ensure the progress is between 0 and 1
    };

    const dialogStyle = computed(() => {
      return {
        width: $q.screen.lt.sm ? '90vw' : '500px',
        maxWidth: '90vw',
        maxHeight: $q.screen.lt.sm ? '90vh' : '80vh'
      }
    })

    return {
      bugs,
      // filteredBugs,
      columns,
      filter,
      bugStore,
      userStore,
      showAssignDialog,
      showUpdateDialog,
      selectedBug,
      onAssign,
      onUpdateStatus,
      onBugAssigned,
      onBugUpdated,
      showBugDetailsDialog,
      onRowClick,
      selectedPriority,
      priorityOptions,
      onPriorityChange,
      daysRemaining,
      calculateProgress,
      dialogStyle
    };
  }
};
</script>

<style scoped>
@media (max-width: 599px) {
  .desktop-only {
    display: none;
  }
}

@media (min-width: 600px) {
  .mobile-only {
    display: none;
  }
}
</style>