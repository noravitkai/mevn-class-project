import { reactive, watch } from "vue";

// Initialize isLoggedIn from localStorage or default to false
const isLoggedInFromStorage = localStorage.getItem("isLoggedIn") === "true";

export const state = reactive({
  isLoggedIn: isLoggedInFromStorage,
});

// Watch for changes in isLoggedIn and update localStorage
watch(
  () => state.isLoggedIn,
  (newValue) => {
    localStorage.setItem("isLoggedIn", String(newValue));
  }
);
