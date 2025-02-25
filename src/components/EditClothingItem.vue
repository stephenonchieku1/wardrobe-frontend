<template>
  <div>
    <h1>Edit Clothing Item</h1>
    <form @submit.prevent="submitForm">
      <input v-model="form.name" type="text" placeholder="Name" required />
      <input v-model="form.category" type="text" placeholder="Category" required />
      <textarea v-model="form.description" placeholder="Description"></textarea>
      <input v-model="form.image_url" type="text" placeholder="Image URL" />
      <button type="submit">Update Item</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const form = ref({
      name: '',
      category: '',
      description: '',
      image_url: '',
    });
    const router = useRouter();

    // Fetch the item to edit
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/clothing-items/${props.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        form.value = response.data;
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    // Update the item
    const submitForm = async () => {
      try {
        await axios.put(`/api/clothing-items/${props.id}`, form.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        router.push('/'); // Redirect to home after updating
      } catch (error) {
        console.error('Error updating item:', error);
      }
    };

    onMounted(() => {
      fetchItem();
    });

    return {
      form,
      submitForm,
    };
  },
};
</script>
