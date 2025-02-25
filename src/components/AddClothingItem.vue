<template>
  <div>
    <h1>Add New Clothing Item</h1>
    <form @submit.prevent="submitForm">
      <input v-model="form.name" type="text" placeholder="Name" required />
      <input v-model="form.category" type="text" placeholder="Category" required />
      <textarea v-model="form.description" placeholder="Description"></textarea>
      <input v-model="form.image_url" type="text" placeholder="Image URL" />
      <button type="submit">Add Item</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const form = ref({
      name: '',
      category: '',
      description: '',
      image_url: '',
    });
    const router = useRouter();

    const submitForm = async () => {
      try {
        await axios.post('/api/clothing-items', form.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        router.push('/'); // Redirect to home after adding
      } catch (error) {
        console.error('Error adding item:', error);
      }
    };

    return {
      form,
      submitForm,
    };
  },
};
</script>
