<template>
  <div class="register-container">
    <div class="form-wrapper">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            class="form-control"
          />
        </div>

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

        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="password_confirmation"
            required
            class="form-control"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>

        <p class="login-link">
          Already have an account? <router-link to="/login">Login</router-link>
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
  name: 'Register',
  setup() {
    const store = useStore();
    const router = useRouter();

    const name = ref('');
    const email = ref('');
    const password = ref('');
    const password_confirmation = ref('');
    const loading = ref(false);
    const error = ref('');

    const register = async () => {
      if (password.value !== password_confirmation.value) {
        error.value = 'Passwords do not match';
        return;
      }

      try {
        loading.value = true;
        const response = await axios.post('http://localhost:8000/api/signin', {
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        });

        console.log('Registration successful:', response.data);
        router.push({ name: 'Home' });
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to register';
        console.error('Registration error:', err.response?.data);
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      email,
      password,
      password_confirmation,
      loading,
      error,
      register
    };
  }
});
</script>

<style scoped>
.register-container {
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
}

.form-group {
  margin-bottom: 16px;
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

.login-link {
  margin-top: 16px;
  text-align: center;
}
</style>
