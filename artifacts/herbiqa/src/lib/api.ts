export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  stockCount: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  payment: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paidAt?: string;
    method: string;
    amount: number;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RazorpayOrderInfo {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

export const api = {
  // auth
  signup: (body: { email: string; password: string; name: string }) =>
    request<{ user: AuthUser }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: AuthUser }>("/auth/me"),

  // products
  listProducts: () => request<Product[]>("/products"),
  getProduct: (idOrSlug: string) => request<Product>(`/products/${idOrSlug}`),
  createProduct: (body: Partial<Product>) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateProduct: (id: string, body: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteProduct: (id: string) =>
    request<void>(`/products/${id}`, { method: "DELETE" }),

  // orders
  createOrder: (body: {
    items: { productId: string; quantity: number }[];
    shippingAddress: ShippingAddress;
    notes?: string;
  }) =>
    request<{ order: Order; razorpay: RazorpayOrderInfo }>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyOrder: (
    id: string,
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ) =>
    request<{ order: Order }>(`/orders/${id}/verify`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  myOrders: () => request<Order[]>("/orders/mine"),

  // admin
  adminStats: () =>
    request<{
      userCount: number;
      productCount: number;
      totalOrders: number;
      paidOrders: number;
      revenue: number;
      recentOrders: {
        id: string;
        userEmail: string;
        total: number;
        status: string;
        createdAt: string;
      }[];
    }>("/admin/stats"),
  adminUsers: () =>
    request<
      {
        id: string;
        email: string;
        name: string;
        role: "user" | "admin";
        createdAt: string;
      }[]
    >("/admin/users"),
  adminUpdateUser: (id: string, body: { role: "user" | "admin" }) =>
    request<{ id: string; email: string; name: string; role: "user" | "admin" }>(
      `/admin/users/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
    ),
  adminOrders: () => request<Order[]>("/admin/orders"),
  adminUpdateOrder: (
    id: string,
    body: { status?: Order["status"]; notes?: string },
  ) =>
    request<{ id: string; status: Order["status"]; notes: string }>(
      `/admin/orders/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
    ),
  adminPayments: () =>
    request<
      {
        orderId: string;
        userEmail: string;
        amount: number;
        currency: string;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        paidAt?: string;
        method: string;
      }[]
    >("/admin/payments"),
};

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
