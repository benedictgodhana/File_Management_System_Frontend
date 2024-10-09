<template>
    <div class="desktop-container">
      <!-- Conditional Rendering of Root Folder or Current Folder -->
      <div v-if="isRootFolder">
        <div 
          class="folder" 
          @click="openFolder" 
          @contextmenu.prevent="showContextMenu($event, directory)"
        >
          <span class="material-icons" style="font-size: 48px;">folder</span>
          <span class="folder-name">{{ directory.name }}</span>
        </div>
      </div>
      
      <!-- Child Directories -->
      <div v-else>
        <v-btn icon @click="goBack" elevation="0">
          <span class="material-icons">arrow_back</span>
        </v-btn>
        <h3 class="current-folder-title">{{ directory.name }}</h3>
        <div class="child-directories">
          <directory-item
            v-for="child in directory.children"
            :key="child.id"
            :directory="child"
            @directory-deleted="$emit('directory-deleted')"
            @file-deleted="$emit('file-deleted', $event)"
          />
        </div>
        
        <!-- Files List -->
        <div v-if="directory.files && directory.files.length > 0" class="file-list">
          <div v-for="file in directory.files" :key="file.id" class="file-item">
            <span class="material-icons">insert_drive_file</span>
            <span class="file-name">{{ file.name }}</span>
            <v-btn @click.stop="deleteFile(file.id)" color="red" icon>
              <span class="material-icons">delete</span>
            </v-btn>
          </div>
        </div>
      </div>
  
      <!-- Context Menu -->
      <v-menu
        v-model="contextMenu.visible"
        :position-x="contextMenu.x"
        :position-y="contextMenu.y"
        offset-y
      >
        <v-list>
          <v-list-item @click="copyDirectory(directory)">Copy</v-list-item>
          <v-list-item @click="deleteDirectory(directory.id)">Delete</v-list-item>
          <v-list-item @click="renameDirectory(directory)">Rename</v-list-item>
          <v-list-item @click="pasteDirectory(directory)">Paste</v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>
  
  <script>
  import axiosInstance from '@/service/api';
  
  export default {
    name: 'DirectoryItem',
    props: {
      directory: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showChildren: false,
        contextMenu: {
          visible: false,
          x: 0,
          y: 0,
        },
        currentDirectory: null,
      };
    },
    computed: {
      isRootFolder() {
        // Check if we're at the root level or not
        return this.currentDirectory === null;
      }
    },
    methods: {
      openFolder() {
        // Store the current directory
        this.currentDirectory = this.directory;
        this.showChildren = true; // Show child directories
      },
      goBack() {
        // Logic to go back to the parent directory
        this.currentDirectory = null; // Set to null to show root folder
        this.showChildren = false; // Hide child directories
      },
      showContextMenu(event, directory) {
        this.contextMenu.visible = true;
        this.contextMenu.x = event.clientX;
        this.contextMenu.y = event.clientY;
        this.currentDirectory = directory; // Store the current directory for context actions
      },
      async deleteDirectory(id) {
        if (confirm('Are you sure you want to delete this directory?')) {
          try {
            await axiosInstance.delete(`/directories/${id}`);
            this.$emit('directory-deleted'); // Emit event to parent to refresh
          } catch (error) {
            console.error('Error deleting directory:', error);
          }
        }
      },
      async deleteFile(id) {
        if (confirm('Are you sure you want to delete this file?')) {
          try {
            await axiosInstance.delete(`/files/${id}`);
            this.$emit('file-deleted', id); // Emit event to parent to refresh
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
      },
      copyDirectory(directory) {
        // Implement the logic for copying a directory
        console.log('Copying directory:', directory);
      },
      renameDirectory(directory) {
        // Implement the logic for renaming a directory
        console.log('Renaming directory:', directory);
      },
      pasteDirectory(directory) {
        // Implement the logic for pasting a directory
        console.log('Pasting to directory:', directory);
      },
    },
  };
  </script>
  
  <style scoped>
  .desktop-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items to the start */
    padding: 10px;
  }
  
  .folder {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    cursor: pointer;
  }
  
  .child-directories {
    margin-left: 20px;
  }
  
  .file-list {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .file-item {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  
  .folder-name,
  .file-name {
    margin-left: 10px;
  }
  
  .current-folder-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 10px 0;
  }
  </style>
  