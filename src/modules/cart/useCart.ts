import { ref } from "vue";
import type { CartItem, Order, OrderLine } from "../../interfaces/interfaces";

export const useCart = () => {
  const cart = ref<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const existingItem = cart.value.find((item) => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log("Increased quantity of existing item", cart.value);
    } else {
      cart.value.push({ ...product, quantity: 1 });
      console.log("Added new item to cart", cart.value);
    }
    localStorage.setItem("cart", JSON.stringify(cart.value));
    console.log("Cart updated in localStorage", cart.value);
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.value.find((item) => item._id === productId);
    if (existingItem) {
      cart.value = cart.value.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart.value));
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find((item) => item._id === productId);
    localStorage.setItem("cart", JSON.stringify(cart.value));
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart.value));
      }
    }
    console.log(`Updated quantity of item in cart: ${productId}, ${quantity}`);
  };

  const cartTotal = (): number => {
    return Number(
      cart.value
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
    );
  };

  const cartTotalIndividualProduct = (productId: string) => {
    const item = cart.value.find((item) => item._id === productId);
    return item ? item.price * item.quantity : 0;
  };

  const salesTax = (): number => {
    const taxRates = 0.25;
    return (Math.round(cartTotal() * taxRates) * 100) / 100;
  };

  const code = ref<string>("");

  const couponCodeDiscount = (codes: string) => {
    const couponCodeAccepted = codes === "DISCOUNT";
    return couponCodeAccepted ? 0.9 : 1;
  };

  const grandTotal = (): number => {
    return Number(
      ((cartTotal() + salesTax()) * couponCodeDiscount(code.value)).toFixed(2)
    );
  };

  // Checkout
  const placeOrder = () => {
    const storedOrders = localStorage.getItem("orders");
    const existingOrders: Order[] = storedOrders
      ? JSON.parse(storedOrders)
      : [];

    const newOrderId = `ORD-${Date.now()}`;
    const newOrderDate = new Date().toISOString();

    const lines: OrderLine[] = cart.value.map((item) => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      imageURL: item.imageURL,
    }));

    const totalPrice = lines.reduce((sum, item) => sum + item.total, 0);

    const newOrder: Order = {
      orderId: newOrderId,
      userName: "User",
      date: newOrderDate,
      status: "pending",
      lines,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };

    existingOrders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    cart.value = [];
    localStorage.setItem("cart", JSON.stringify([]));
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartTotalIndividualProduct,
    salesTax,
    code,
    grandTotal,
    placeOrder,
  };
};
