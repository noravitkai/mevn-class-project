<template>
  <h2 class="text-2xl font-bold mb-4">Order History</h2>

  <p v-if="orders.length === 0" class="text-center">No orders found</p>

  <div v-else>
    <div
      v-for="order in orders"
      :key="order.orderId"
      class="mb-8 border-b pb-4"
    >
      <div class="flex justify-between items-center mb-4">
        <div>
          <p class="font-semibold">Order ID: {{ order.orderId }}</p>
          <p class="text-gray-500">Order Date: {{ order.date }}</p>
        </div>
        <div>
          <p class="font-semibold">
            Order Total: ${{ order.totalPrice.toFixed(2) }}
          </p>
          <select
            class="border p-1 text-[#181818] rounded"
            v-model="order.status"
          >
            <option value="pending">Processing</option>
            <option value="confirmed">Shipped</option>
            <option value="shipped">Delivered</option>
          </select>
          <button
            class="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600"
          >
            Archive
          </button>
        </div>
      </div>

      <div
        v-for="item in order.lines"
        :key="item.productId"
        class="flex items-center mb-4"
      >
        <div class="w-1/6">
          <img
            :src="item.imageURL"
            alt="Product Image"
            class="w-full h-24 object-cover rounded-lg"
          />
        </div>
        <div class="w-2/6 px-4">
          <p class="font-semibold">{{ item.name }}</p>
        </div>
        <div class="w-1/6 text-center">
          <p class="mx-2">{{ item.quantity }}</p>
        </div>
        <div class="w-1/6 text-right">
          <p class="font-semibold">${{ item.price.toFixed(2) }}</p>
        </div>
        <div class="w-1/6 text-right">
          <p class="font-semibold">${{ item.total.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Order } from "../../interfaces/interfaces";

const orders = ref<Order[]>([]);

onMounted(() => {
  const saved = localStorage.getItem("orders");
  orders.value = saved ? JSON.parse(saved) : [];
});
</script>

<style scoped>
/* Add your styles here */
</style>
