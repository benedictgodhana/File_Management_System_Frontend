<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">File List</h1>
      <v-card v-for="file in files" :key="file.id" class="mb-4">
        <v-card-title>{{ file.name }}</v-card-title>
        <v-card-actions>
          <v-btn @click="viewFileDetails(file.id)" color="primary">View Details</v-btn>
          <v-btn color="red" @click="deleteFile(file.id)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </template>
  
  <script>
  import axiosInstance from '@/service/api'; // Adjust the path as necessary
  
  export default {
    name: 'FileList',
    data() {
      return {
        files: [],
      };
    },
    methods: {
      async fetchFiles() {
        try {
          const response = await axiosInstance.get('/files/');
          this.files = response.data;
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      },
      viewFileDetails(id) {
        this.$router.push({ name: 'FileDetails', params: { id } });
      },
      async deleteFile(id) {
        if (confirm('Are you sure you want to delete this file?')) {
          try {
            await axiosInstance.delete(`/files/${id}`);
            this.fetchFiles();
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
      },
    },
    mounted() {
      this.fetchFiles();
    },
  };
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  