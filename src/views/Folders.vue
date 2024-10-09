<template>
    <v-app>
      <v-container class="mt-16" fluid>
        <h1 v-if="!inFolderView">Root Directories</h1>
  
        <!-- Add Directory Button -->
        <v-btn @click="showAddRootDialog" color="primary" class="mb-2" style="text-transform: capitalize;" v-if="!inFolderView">Add a Directory</v-btn>
        <br>
        <br>
        
        <!-- Search Field -->
        <v-text-field
          v-model="searchQuery"
          label="Search Directories"
          @input="filterDirectories"
          variant="outlined"
          v-if="!inFolderView"
        ></v-text-field>
  
        <!-- Directory View -->
        <div v-if="!inFolderView" class="directory-container">
          <v-row>
            <v-col
              v-for="directory in filteredRootDirectories"
              :key="directory.id"
              cols="12" md="3" lg="2"  
            >
              <v-card class="directory-item" @click="selectDirectory(directory)" elevation="0">
                <v-card-title>
                  <v-icon left>mdi-folder</v-icon>
                  {{ directory.name }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </div>
  
        <!-- Subdirectories View -->
        <div v-else>
          <v-toolbar color="primary">
            <v-card-title>Subdirectories of {{ selectedDirectory.name }}</v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="backToRoot" color="neutral" class="mb-2" style="text-transform: capitalize;">Close</v-btn>
          </v-toolbar>
  
          <br>
          <v-row>
            <v-col
              v-for="child in selectedDirectory.children"
              :key="child.id"
              cols="12" md="3" lg="2" 
            >
              <v-card class="directory-item" @click="selectChildDirectory(child)" elevation="0">
                <v-card-title>
                  <v-icon left>mdi-folder</v-icon>
                  {{ child.name }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
  
          <!-- Files View -->
          <v-row class="mt-4">
            <v-col v-if="selectedChildDirectory && selectedChildDirectory.files && selectedChildDirectory.files.length > 0">
              <h3>Files in {{ selectedChildDirectory.name }}</h3>
              <v-list>
                <v-list-item-group>
                  <v-list-item
                    v-for="file in selectedChildDirectory.files"
                    :key="file.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ file.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </div>
  
        <!-- Dialogs remain the same -->
        <!-- Dialog for Adding Root Directory -->
        <v-dialog v-model="addRootDialog" max-width="500px">
          <v-card>
            <v-card-title>Add Root Directory</v-card-title>
            <v-card-text>
              <v-text-field v-model="newRootDirectory" label="Directory Name"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="addRootDirectory">Add</v-btn>
              <v-btn @click="addRootDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Dialog for Adding Child Directory -->
        <v-dialog v-model="addChildDialog" max-width="500px">
          <v-card>
            <v-card-title>Add Child Directory</v-card-title>
            <v-card-text>
              <v-text-field v-model="newChildDirectory" label="Directory Name"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="addChildDirectory">Add</v-btn>
              <v-btn @click="addChildDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Dialog for Adding File -->
        <v-dialog v-model="addFileDialog" max-width="500px">
          <v-card>
            <v-card-title>Add File</v-card-title>
            <v-card-text>
              <v-text-field v-model="newFile" label="File Name"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="addFile">Add</v-btn>
              <v-btn @click="addFileDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axiosInstance from '@/service/api';
  
  export default {
    data() {
      return {
        rootDirectories: [],
        filteredRootDirectories: [],
        searchQuery: '',
        selectedDirectory: null,
        selectedChildDirectory: null, // Track the selected child directory
        inFolderView: false, // Track if in folder view
        addRootDialog: false,
        addChildDialog: false,
        addFileDialog: false,
        newRootDirectory: '',
        newChildDirectory: '',
        newFile: '',
        currentParentDirectoryId: null, // Track the current parent directory ID for adding children
        currentDirectoryId: null, // Track the current directory ID for adding files
      };
    },
    methods: {
      async fetchRootDirectories() {
        try {
          const response = await axiosInstance.get('/directories');
          this.rootDirectories = response.data;
          this.filteredRootDirectories = this.rootDirectories.filter(dir => !dir.parent_id); // Filter to get root directories only
          // Add children to their respective parents
          this.rootDirectories.forEach(directory => {
            if (directory.parent_id) {
              const parent = this.rootDirectories.find(parent => parent.id === directory.parent_id);
              if (parent) {
                parent.children = parent.children || []; // Initialize children array
                parent.children.push(directory); // Add directory as child
              }
            }
          });
        } catch (error) {
          console.error('Error fetching root directories:', error);
        }
      },
      filterDirectories() {
        const query = this.searchQuery.toLowerCase();
        this.filteredRootDirectories = this.rootDirectories.filter(directory =>
          directory.name.toLowerCase().includes(query) && !directory.parent_id // Ensure we are only filtering root directories
        );
      },
      selectDirectory(directory) {
        this.selectedDirectory = directory; // Show selected directory's subdirectories
        this.inFolderView = true; // Enter folder view
        this.selectedChildDirectory = null; // Clear any previously selected child directory
      },
      backToRoot() {
        this.selectedDirectory = null; // Clear selected directory
        this.selectedChildDirectory = null; // Clear selected child directory
        this.inFolderView = false; // Go back to root view
      },
      showAddRootDialog() {
        this.addRootDialog = true; // Show dialog to add root directory
      },
      async addRootDirectory() {
        try {
          const response = await axiosInstance.post('/directories', { name: this.newRootDirectory });
          this.rootDirectories.push(response.data);
          this.filteredRootDirectories.push(response.data); // Add to filtered root directories
          this.addRootDialog = false;
          this.newRootDirectory = '';
        } catch (error) {
          console.error('Error adding root directory:', error);
        }
      },
      showAddChildDialog(directoryId) {
        this.addChildDialog = true; // Show dialog to add child directory
        this.currentParentDirectoryId = directoryId; // Store the ID of the parent directory
      },
      async addChildDirectory() {
        try {
          const response = await axiosInstance.post(`/directories/${this.currentParentDirectoryId}/children`, { name: this.newChildDirectory });
          const parentDirectory = this.rootDirectories.find(dir => dir.id === this.currentParentDirectoryId);
          if (parentDirectory) {
            parentDirectory.children = parentDirectory.children || []; // Initialize children array
            parentDirectory.children.push(response.data);
          }
          this.addChildDialog = false;
          this.newChildDirectory = '';
        } catch (error) {
          console.error('Error adding child directory:', error);
        }
      },
      selectChildDirectory(child) {
        // Handle selecting a child directory
        this.selectedChildDirectory = child; // Set the selected child directory
        console.log('Selected child directory:', child);
        // Fetch files for the selected child directory if necessary
        // You can replace this with a call to fetch files from the server if needed
        this.fetchFilesForDirectory(child.id);
      },
      async fetchFilesForDirectory(directoryId) {
        try {
          const response = await axiosInstance.get(`/directories/${directoryId}/files`);
          this.selectedChildDirectory.files = response.data; // Assuming your API returns files in this format
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      },
      showAddFileDialog(child) {
        this.addFileDialog = true; // Show dialog to add file
        this.currentDirectoryId = child.id; // Store the ID of the selected child directory
      },
      async addFile() {
        try {
          const response = await axiosInstance.post(`/directories/${this.currentDirectoryId}/files`, { name: this.newFile });
          if (this.selectedChildDirectory.files) {
            this.selectedChildDirectory.files.push(response.data); // Add file to the selected child's files
          } else {
            this.selectedChildDirectory.files = [response.data]; // Initialize if it was empty
          }
          this.addFileDialog = false;
          this.newFile = '';
        } catch (error) {
          console.error('Error adding file:', error);
        }
      },
    },
    mounted() {
      this.fetchRootDirectories(); // Fetch root directories on mount
    },
  };
  </script>
  
  <style scoped>
  .directory-container {
    display: flex;
    flex-wrap: wrap;
  }
  .directory-item {
    cursor: pointer;
  }
  </style>
  