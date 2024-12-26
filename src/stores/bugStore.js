import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useBugStore = defineStore('bug', {
  state: () => ({
    bugs: [
      { id: 1, 
        title: 'Login button not working', 
        description: 'Users unable to log in', 
        status: 'Pending', 
        assignedTo: null, 
        priority: 'High', 
        assignDate: '2024-06-01',
        deadline: '2024-08-01', 
        reportedBy: 'Tester1' 
      },
      { id: 2, 
        title: 'Page crash on mobile', 
        description: 'App crashes when opening profile on mobile', 
        status: 'In Progress', 
        assignedTo: 'Dev1', 
        priority: 'Critical', 
        assignDate: '2024-06-09',
        deadline: '2024-07-25', 
        reportedBy: 'Tester1' 
      },
    ]
  }),
  getters: {
    getBugsByPriority: (state) => (priority) => {
      return state.bugs.filter(bug => bug.priority === priority);
    }
  },
  actions: {
    addBug(bug) {
      this.bugs.push({ ...bug, id: this.bugs.length + 1 });
    },
    updateBug(updatedBug) {
      const index = this.bugs.findIndex(bug => bug.id === updatedBug.id);
      if (index !== -1) {
        this.bugs[index] = updatedBug;
      }
    },
    assignBug({ bugId, developerId, deadline, priority }) {
      const bug = this.bugs.find(bug => bug.id === bugId);
      if (bug) {
        bug.assignedTo = developerId;
        bug.status = 'Assigned';
        bug.deadline = deadline;
        bug.priority = priority
      }
    },
    updateBugStatus({ bugId, status, comments }) {
      const userStore = useUserStore();
      const bug = this.bugs.find(bug => bug.id === bugId);
      if (bug) {
        bug.status = status;
        if(comments) {
          if(!bug.comments) bug.comments = [];
          bug.comments.push({
            text: comments,
            date: new Date().toISOString(),
            user: userStore.currentUser ? userStore.currentUser.name : 'Unknown User'
          })
        }
        console.log('Bug updated successfully')
      } else {
        console.log('Bug not found')
      }
    }
  },
});