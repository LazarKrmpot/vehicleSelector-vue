<script setup lang="ts">
import { ref, watch } from "vue";
import type { VehicleState, ApiError } from "../types/vehicle";
import * as vehicleApi from "../services/vehicleApi";

const state = ref<VehicleState>({
  years: [],
  makes: [],
  models: [],
  selectedYear: null,
  selectedMake: null,
  selectedModel: null,
});

const loading = ref(false);
const error = ref<ApiError | null>(null);

// Load initial years
const loadYears = async () => {
  try {
    loading.value = true;
    error.value = null;
    state.value.years = await vehicleApi.getYears();
  } catch (e) {
    error.value = { message: "Failed to load years. Please try again later." };
    state.value.years = [];
  } finally {
    loading.value = false;
  }
};

// Load makes when year changes
const loadMakes = async () => {
  if (!state.value.selectedYear) {
    state.value.makes = [];
    state.value.models = [];
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    state.value.makes = await vehicleApi.getMakes(state.value.selectedYear);
    // Reset dependent fields
    state.value.selectedMake = null;
    state.value.selectedModel = null;
    state.value.models = [];
  } catch (e) {
    error.value = { message: "Failed to load makes. Please try again later." };
    state.value.makes = [];
  } finally {
    loading.value = false;
  }
};

// Load models when make changes
const loadModels = async () => {
  if (!state.value.selectedYear || !state.value.selectedMake) {
    state.value.models = [];
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    state.value.models = await vehicleApi.getModels(
      state.value.selectedYear,
      state.value.selectedMake
    );
    state.value.selectedModel = null;
  } catch (e) {
    error.value = { message: "Failed to load models. Please try again later." };
    state.value.models = [];
  } finally {
    loading.value = false;
  }
};

const handleYearChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  state.value.selectedYear = target.value ? parseInt(target.value, 10) : null;
};

const handleMakeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  state.value.selectedMake = target.value || null;
};

const handleModelChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  state.value.selectedModel = target.value || null;
};

// Watch for changes
watch(() => state.value.selectedYear, loadMakes);
watch(() => state.value.selectedMake, loadModels);

// Load initial data
loadYears();
</script>

<template>
  <div class="vehicle-selector">
    <h2>Vehicle Selector</h2>

    <div v-if="error" class="error">
      {{ error.message }}
    </div>

    <div class="selectors" :class="{ 'is-loading': loading }">
      <!-- Year Selection -->
      <div class="select-group">
        <label for="year">Year:</label>
        <select
          id="year"
          :value="state.selectedYear || ''"
          @change="handleYearChange"
          :disabled="loading"
        >
          <option value="">Select Year</option>
          <option v-for="year in state.years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Make Selection -->
      <div class="select-group">
        <label for="make">Make:</label>
        <select
          id="make"
          :value="state.selectedMake || ''"
          @change="handleMakeChange"
          :disabled="loading || !state.selectedYear"
        >
          <option value="">Select Make</option>
          <option v-for="make in state.makes" :key="make" :value="make">
            {{ make }}
          </option>
        </select>
      </div>

      <!-- Model Selection -->
      <div class="select-group">
        <label for="model">Model:</label>
        <select
          id="model"
          :value="state.selectedModel || ''"
          @change="handleModelChange"
          :disabled="loading || !state.selectedMake"
        >
          <option value="">Select Model</option>
          <option v-for="model in state.models" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">Loading...</div>

    <div v-if="state.selectedModel" class="selection-summary">
      <h3>Selected Vehicle:</h3>
      <p>
        {{ state.selectedYear }} {{ state.selectedMake }}
        {{ state.selectedModel }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.vehicle-selector {
  width: 100%;
  width: 28rem;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #dce3e9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 16px;
  font-size: 1.8rem;
  text-align: center;
  color: #2b3945;
}

.selectors {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.select-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  color: #3d5a80;
  margin-bottom: 6px;
}

select {
  padding: 10px;
  border: 1px solid #cdd7e0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f4f8fc;
  color: #34495e;
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease;
}

select:focus {
  border-color: #3d5a80;
  box-shadow: 0 0 0 3px rgba(61, 90, 128, 0.3);
  background-color: #eef6fc;
}

select:hover:not(:disabled) {
  background-color: #eef6fc;
}

select:disabled {
  background-color: #f4f8fc;
  color: #9ca3af;
  cursor: not-allowed;
}

.error {
  padding: 14px;
  background-color: #ffe6e6;
  border: 1px solid #ffbcbc;
  border-radius: 8px;
  color: #d32f2f;
  text-align: center;
}

.loading-indicator {
  text-align: center;
  font-size: 1rem;
  color: #5a6978;
  margin-top: 10px;
  font-style: italic;
  animation: fade 1.5s infinite ease-in-out;
}

@keyframes fade {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.selection-summary {
  margin-top: 20px;
  padding: 16px;
  background-color: #f4f8fc;
  border: 1px solid #cdd7e0;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.selection-summary h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
  color: #34495e;
}

.selection-summary p {
  margin: 0;
  font-size: 1.1rem;
  color: #5a6978;
}

button {
  background-color: #3d5a80;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2b3945;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
