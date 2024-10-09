<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card-title>Directory </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="directory in directories"
        :key="directory.id"
        cols="12" sm="6" md="4" lg="3" 
      >
        <directory-item
          :directory="directory"
          @directory-deleted="fetchDirectories"
          @file-deleted="$emit('file-deleted', $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axiosInstance from '@/service/api'; // Adjust the path as necessary
import DirectoryItem from './DirectoryItem.vue'; // Import the recursive directory item component

export default {
  name: 'DirectoryList',
  components: {
    DirectoryItem, // Register the component
  },
  props: {
    directories: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
