<template>
  <div class="clothing-list">
    <div class="item-count">
      <span v-if="loading">Loading items...</span>
      <span v-else-if="error">Error loading items</span>
      <span v-else>{{ items.length }} items found</span>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Edit Clothing Item</h2>
          <button class="close-btn" @click="closeEditModal">&times;</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateItem">
            <div class="form-grid">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  v-model="editForm.name"
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
                  v-model="editForm.brand"
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
                  v-model="editForm.size"
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
                  v-model="editForm.category"
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
                  v-if="editForm.category === 'other'"
                  v-model="customCategory"
                  type="text"
                  placeholder="Enter custom category"
                  class="form-input mt-2"
                  @input="editForm.category = customCategory"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                v-model="editForm.description"
                id="description"
                placeholder="Add details about the item, condition, etc."
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>



            <div v-if="updateStatus.message" :class="`alert ${updateStatus.type}`">
              {{ updateStatus.message }}
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeEditModal">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="isUpdating">
                <span v-if="isUpdating">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Loading items...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else-if="items.length > 0" class="items-grid">
      <div v-for="item in items" :key="item.id" class="item-card">
        <div class="item-header">
          <h3>{{ item.name }}</h3>
          <span class="category-badge">{{ item.category }}</span>
        </div>

        <div v-if="item.image_url" class="item-image">
          <img :src="item.image_url" :alt="item.name" />
        </div>

        <div class="item-details">
          <p v-if="item.description">{{ item.description }}</p>
          <p v-if="item.color"><strong>Color:</strong> {{ item.color }}</p>
          <p v-if="item.size"><strong>Size:</strong> {{ item.size }}</p>
        </div>

        <div class="item-actions">
          <button class="btn-edit" @click="editItem(item)">
            Edit
          </button>
          <button class="btn-delete" @click="confirmDelete(item.id, item.name)">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>No clothing items found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['delete-item', 'edit-item', 'item-updated']);

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

// Modal state
const showEditModal = ref(false);
const editForm = ref({
  id: null,
  name: '',
  brand: '',
  size: '',
  category: '',
  color: '',
  description: '',

});
const customCategory = ref('');
const isUpdating = ref(false);
const updateStatus = ref({ message: '', type: '' });

// Method 1: Navigate to edit page
const navigateToEditPage = (id) => {
  router.push(`/edit/${id}`);
};

// Method 2: Show edit modal
const editItem = (item) => {
  // You can choose to use either the modal approach or the navigate approach
  // Option 1: Use the modal
  editForm.value = { ...item };

  // Handle custom category
  if (!categories.includes(item.category) && item.category) {
    customCategory.value = item.category;
  } else {
    customCategory.value = '';
  }

  showEditModal.value = true;

  // Option 2: Navigate to dedicated edit page (comment the above code and uncomment this if you prefer)
  // navigateToEditPage(item.id);

  // Also emit the event in case parent component needs to handle it
  emit('edit-item', item.id);
};

const closeEditModal = () => {
  showEditModal.value = false;
  updateStatus.value = { message: '', type: '' };
};

const updateItem = async () => {
  if (isUpdating.value) return;

  isUpdating.value = true;
  updateStatus.value = { message: '', type: '' };

  try {
    const response = await axios.put(`http://localhost:8000/api/clothing-items/${editForm.value.id}`, editForm.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    updateStatus.value = {
      message: 'Item updated successfully!',
      type: 'success'
    };

    // Emit event to notify parent to refresh items
    emit('item-updated', response.data);

    setTimeout(() => {
      closeEditModal();
    }, 1000);

  } catch (error) {
    updateStatus.value = {
      message: error.response?.data?.message || 'Failed to update item. Please try again.',
      type: 'error'
    };
    console.error('Error updating item:', error.response?.data || error.message);
  } finally {
    isUpdating.value = false;
  }
};

const confirmDelete = (id, name) => {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    emit('delete-item', id);
  }
};
</script>

<style scoped>
.clothing-list {
  width: 100%;
  position: relative;
}

.item-count {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 500;
  display: flex;
  justify-content: flex-end;
  color: #4a5568;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.item-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background-color: white;
}

.item-header {
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-header h3 {
  margin: 0;
  font-size: 18px;
}

.category-badge {
  background-color: #4a5568;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.item-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  padding: 15px;
  flex-grow: 1;
}

.item-details p {
  margin: 5px 0;
}

.item-actions {
  display: flex;
  padding: 15px;
  border-top: 1px solid #ddd;
  gap: 10px;
}

.loading-state, .error-state, .empty-state {
  padding: 30px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.error-state {
  color: #e53e3e;
}

.btn-edit, .btn-delete, .btn-retry {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
}

.btn-edit {
  background-color: #4a5568;
  color: white;
}

.btn-delete {
  background-color: #e53e3e;
  color: white;
}

.btn-retry {
  background-color: #4299e1;
  color: white;
  display: inline-block;
  margin-top: 10px;
}

.btn-edit:hover {
  background-color: #2d3748;
}

.btn-delete:hover {
  background-color: #c53030;
}

.btn-retry:hover {
  background-color: #3182ce;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #4a5568;
}

.modal-body {
  padding: 20px;
}

/* Form styles */
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
