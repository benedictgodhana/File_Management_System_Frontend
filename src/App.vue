<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        app
        permanent
        expand-on-hover
        color="primary"
      >
      <v-list-item-avatar>
            <v-img src="/University-Logo-Vertical-01.png" alt="tailus logo" class="mt-13"></v-img>
          </v-list-item-avatar>
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-folder"
            title="My Folders"
            @click="navigateToFiles"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account-multiple"
            title="Shared with Me"
            @click="navigateToShared"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-star"
            title="Starred"
            @click="navigateToStarred"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-delete"
            title="Trash"
            @click="navigateToTrash"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-clock"
            title="Recent"
            @click="navigateToRecent"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-cog"
            title="Settings"
            @click="navigateToSettings"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="primary" dark elevation="0">
        <v-toolbar-title>File Management System</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <router-view />

        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  methods: {
    toggleDrawer() {
      this.$refs.drawer.toggle();
    },
    navigateToFiles() {
      this.$router.push('/folders');
    },
    navigateToShared() {
      this.$router.push('/shared');
    },
    navigateToStarred() {
      this.$router.push('/starred');
    },
    navigateToTrash() {
      this.$router.push('/trash');
    },
    navigateToRecent() {
      this.$router.push('/recent');
    },
    navigateToSettings() {
      this.$router.push('/settings');
    },
  },
};
</script>

<style scoped>
.v-toolbar {
  background-color: #3f51b5; /* Change to your preferred color */
}

.v-list-item {
  transition: background-color 0.3s ease; /* Smooth transition on hover */
}

.v-list-item:hover {
  background-color: #e3f2fd; /* Light blue hover effect */
}

</style>
