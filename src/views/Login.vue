<template>
  <div class="login-container">
    <div class="form-wrapper">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>

        <p class="register-link">
          Don't have an account? <router-link to="/register">Register</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');

  const login = async () => {
  try {
    loading.value = true;
    error.value = '';

    const response = await axios.post('http://localhost:8000/api/login', {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('token', response.data.token);

    store.commit('SET_USER', response.data.user);

    router.push({ name: 'Home' });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to login. Please try again.';
  } finally {
    loading.value = false;
  }
};

    return {
      email,
      password,
      loading,
      error,
      login,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 24px;
  text-align: center;
  color: black;
}

.form-group {
  margin-bottom: 16px;
  color: black;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #4a5568;
  color: white;
}

.btn-primary:hover {
  background-color: #2d3748;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 16px;
}

.register-link {
  margin-top: 16px;
  text-align: center;
}
</style>
