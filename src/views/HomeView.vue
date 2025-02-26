<template>
  <div class="wardrobe-container">
    <h1>My Wardrobe</h1>

    <!-- Search and Filter Controls -->
    <div class="controls-container">
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search items..."
          class="search-input"
          @input="filterItems"
        />
      </div>

      <div class="sort-container">
        <label for="category-select">Filter by Category:</label>
        <select
          id="category-select"
          v-model="selectedCategory"
          @change="filterItems"
          class="category-select"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <label for="sort-select" class="ml-4">Sort by:</label>
        <select
          id="sort-select"
          v-model="sortBy"
          @change="filterItems"
          class="sort-select"
        >
          <option value="name">Name (A-Z)</option>
          <option value="nameDesc">Name (Z-A)</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="loading" class="status-message">Loading items...</div>
    <div v-else-if="filteredItems.length === 0" class="status-message">
      No items found. Try adjusting your search or filters.
    </div>

    <!-- Clothing Items List -->
    <ClothingItemList
      :items="filteredItems"
      :loading="loading"
      :error="error"
      @delete-item="deleteItem"
      @edit-item="editItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import ClothingItemList from '@/components/ClothingList.vue';

// API URL
const apiUrl = 'http://127.0.0.1:8000/api/clothing-items';

// Store original and filtered items separately
const originalItems = ref([]);
const filteredItems = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref([]);
const sortBy = ref('name');

// Fetch all clothing items
const fetchClothingItems = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    // Store the complete dataset
    originalItems.value = response.data.map(item => ({
      ...item,
      // Ensure searchable fields are always defined to prevent null/undefined errors
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      created_at: item.created_at || new Date().toISOString()
    }));

    // Extract unique categories from the items
    const uniqueCategories = new Set();
    originalItems.value.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    categories.value = Array.from(uniqueCategories).sort();

    // Initial filtering
    filterItems();
  } catch (err) {
    console.error('Error fetching clothing items:', err);
    error.value = err.message || 'Failed to load items';
    // Log additional details about the error for debugging
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }
  } finally {
    loading.value = false;
  }
};

// Filter and sort items based on search query, category, and sort option
const filterItems = () => {
  console.log('Filtering with search:', searchQuery.value, 'category:', selectedCategory.value);

  // First filter by search query and category
  let results = originalItems.value.filter(item => {
    // Search in name and description fields
    const searchLower = searchQuery.value.toLowerCase();
    const nameLower = (item.name || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();

    const matchesSearch = searchQuery.value === '' ||
      nameLower.includes(searchLower) ||
      descLower.includes(searchLower);

    const matchesCategory = selectedCategory.value === '' ||
      item.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });

  // Then sort the results
  results = sortItems(results);

  console.log(`Found ${results.length} items after filtering`);
  filteredItems.value = results;
};

// Sort items based on selected sort option
const sortItems = (items) => {
  return [...items].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'nameDesc':
        return (b.name || '').localeCompare(a.name || '');
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case 'oldest':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      default:
        return 0;
    }
  });
};

// Delete a clothing item
const deleteItem = async (id) => {
  try {
    await axios.delete(`${apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    await fetchClothingItems(); 
  } catch (err) {
    console.error('Error deleting item:', err);
    alert('Failed to delete item. Please try again.');
  }
};

// Edit item handler
const editItem = (id) => {
  router.push(`/edit/${id}`);

};
const refreshItems = () => {
  fetchClothingItems();
};


// Watch for changes in search query with debounce
let searchTimeout = null;
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    filterItems();
  }, 300);
});

// Watch for category and sort changes
watch([selectedCategory, sortBy], () => {
  filterItems();
});

onMounted(() => {
  fetchClothingItems();
});
</script>

<style scoped>
.wardrobe-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.controls-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  align-items: center;
}

.search-container {
  flex: 1;
  min-width: 250px;
}

.sort-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.search-input, .category-select, .sort-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.search-input {
  width: 100%;
}

.ml-4 {
  margin-left: 16px;
}

.status-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}
</style>
