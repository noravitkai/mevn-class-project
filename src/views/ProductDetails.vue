<template>
  <div v-if="product && product.length > 0" class="flex flex-wrap">
    <div class="w-1/2 p-4">
      <img
        class="w-full rounded-lg object-cover h-full"
        :src="product[0].imageURL"
        alt=""
      />
    </div>
    <div class="w-1/2 p-4">
      <h2 class="text-2xl font-bold mb-4">{{ product[0].name }}</h2>
      <p class="text-slate-400 mb-4">{{ product[0].description }}</p>
      <p class="text-slate-300 font-bold">{{ product[0].stock }}</p>
    </div>
  </div>
  <div v-else>Loading product details</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProducts } from "../modules/useProducts";
import type { Product } from "../interfaces/interfaces";

const route = useRoute();
const product = ref<Product[] | null>(null);

const { fetchProductById } = useProducts();

onMounted(async () => {
  const productId = route.params.id as string;
  const fetchedProduct = await fetchProductById(productId);
  console.log("Fetched product:", fetchedProduct);
  product.value = fetchedProduct;
  console.log("Product value:", product.value);
});
</script>
