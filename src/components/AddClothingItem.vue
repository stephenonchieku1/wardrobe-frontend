<template>
  <div class="add-item-container">
    <div class="form-card">
      <h1 class="form-title">Add New Clothing Item</h1>

      <div v-if="message.text" :class="`alert ${message.type}`">
        {{ message.text }}
      </div>

      <form @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              placeholder="E.g., Black T-Shirt"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="brand">Brand</label>
            <input
              v-model="form.brand"
              type="text"
              id="brand"
              placeholder="E.g., Nike"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="size">Size</label>
            <input
              v-model="form.size"
              type="text"
              id="size"
              placeholder="E.g., Medium"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select
              v-model="form.category"
              id="category"
              required
              class="form-input"
            >
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
              <option value="other">Other</option>
            </select>
            <input
              v-if="form.category === 'other'"
              v-model="customCategory"
              type="text"
              placeholder="Enter custom category"
              class="form-input mt-2"
              @input="form.category = customCategory"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            v-model="form.description"
            id="description"
            placeholder="Add details about the item, condition, etc."
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="color">Color</label>
          <input
            v-model="form.color"
            type="text"
            id="color"
            placeholder="E.g., Black"
            class="form-input"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="cancelForm">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Adding...</span>
            <span v-else>Add Item</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSubmitting = ref(false);
const customCategory = ref('');
const message = ref({ text: '', type: '' });

// Predefined categories
const categories = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Underwear'
];

const form = ref({
  name: '',
  brand: '',
  size: '',
  category: '',
  color: '',
  description: '',
  image: '',
});

const submitForm = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  message.value = { text: '', type: '' };

  try {
    await axios.post('http://localhost:8000/api/clothing-items', form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    // Show success message
    message.value = {
      text: 'Item added successfully!',
      type: 'success'
    };

    // Navigate to home after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (error) {
    // Show error message
    message.value = {
      text: error.response?.data?.message || 'Failed to add item. Please try again.',
      type: 'error'
    };
    console.error('Error adding item:', error.response?.data || error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelForm = () => {
  router.push('/');
};
</script>

<style scoped>
.add-item-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
}

.form-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.form-title {
  margin-top: 0;
  margin-bottom: 24px;
  color: #2d3748;
  font-size: 24px;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  border-color: #4a5568;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.2);
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4a5568;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2d3748;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.mt-2 {
  margin-top: 8px;
}

.alert {
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-weight: 500;
}

.success {
  background-color: #c6f6d5;
  color: #276749;
  border: 1px solid #9ae6b4;
}

.error {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}
</style>
