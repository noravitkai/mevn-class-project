import { ref } from "vue";
import type { Product, newProduct } from "../interfaces/interfaces";

export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(
        "https://ments-restapi.onrender.com/api/products"
      );
      if (!response.ok) {
        throw new Error("No data available");
      }
      const data: Product[] = await response.json();
      products.value = data;
      console.log("Products fetched successfully", products.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const getTokenAndUserId = (): { token: string; userId: string } => {
    const token = localStorage.getItem("lsToken");
    const userId = localStorage.getItem("userIdToken");
    if (!token) {
      throw new Error("No token available");
    }
    if (!userId) {
      throw new Error("No user id available");
    }
    return { token, userId };
  };

  const validateProduct = (product: newProduct): void => {
    if (!product.name) {
      throw new Error("Product name is required");
    }
  };

  const setDefaultValues = (product: newProduct, userId: string) => {
    return {
      name: product.name,
      description: product.description || "Product Description Default Value",
      imageURL: product.imageURL || "https://picsum.photos/500/500",
      price: product.price || 2,
      stock: product.stock || 45,
      discount: product.discount || false,
      discountPct: product.discountPct || 0,
      isHidden: product.isHidden || false,
      _createdBy: userId,
    };
  };

  const addProduct = async (product: newProduct): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();
      validateProduct(product);
      const productWithDefaults = setDefaultValues(product, userId);

      const response = await fetch(
        "https://ments-restapi.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(productWithDefaults),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "No data available");
      }
      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("Product added successfully", newProduct);
      await fetchProducts();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const deleteProductFromServer = async (
    id: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(
      `https://ments-restapi.onrender.com/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      }
    );
    if (!response.ok) {
      console.log("Product not deleted");
      throw new Error("No data available");
    }
  };

  const removeProductFromState = (id: string): void => {
    products.value = products.value.filter((product) => product._id !== id);
    console.log("Product deleted successfully", id);
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteProductFromServer(id, token);
      removeProductFromState(id);
      console.log("Deleting product with id", id);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const updateProductOnServer = async (
    id: string,
    updatedProduct: Partial<Product>,
    token: string
  ): Promise<Product> => {
    const response = await fetch(
      `https://ments-restapi.onrender.com/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(updatedProduct),
      }
    );
    if (!response.ok) {
      throw new Error("No data available");
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch {
      return { message: responseText } as unknown as Product;
    }
    //return await response.json()
  };

  const updateProductInState = (id: string, updatedProduct: Product) => {
    const index = products.value.findIndex((product) => product._id === id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  };

  const updateProduct = async (
    id: string,
    updatedProduct: Partial<Product>
  ): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      const updatedProductResponse = await updateProductOnServer(
        id,
        updatedProduct,
        token
      );
      updateProductInState(id, updatedProductResponse);
      await fetchProducts();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const fetchProductById = async (id: string): Promise<Product[] | null> => {
    try {
      const response = await fetch(
        `https://ments-restapi.onrender.com/api/products/${id}`
      );
      if (!response.ok) {
        throw new Error("No data available");
      }
      const data: Product[] = await response.json();
      console.log("Product fetched successfully", data);
      return data;
    } catch (err) {
      console.log("Error fetching product by ID:", err);
      return null;
    }
  };

  return {
    error,
    loading,
    products,
    fetchProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getTokenAndUserId,
    fetchProductById,
  };
};
