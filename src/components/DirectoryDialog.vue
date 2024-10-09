<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="name" :label="label"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="submit">{{ buttonText }}</v-btn>
        <v-btn @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Add Directory',
    },
    label: {
      type: String,
      default: 'Directory Name',
    },
    buttonText: {
      type: String,
      default: 'Add',
    },
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.name);
    },
    closeDialog() {
      this.$emit('update:dialog', false); // To control closing the dialog from parent
    },
  },
};
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
