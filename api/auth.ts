// api/auth.ts

const BASE = `${process.env.EXPO_PUBLIC_API_URL}/users`;


// CHECK PHONE
export const checkPhone = async (phone: string) => {
  const res = await fetch(`${BASE}/check-phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Phone check failed");
  }

  return data;
};


// LOGIN
export const loginUser = async (payload: {
  phone: string;
  email: string;
  password: string;
}) => {

  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log("LOGIN STATUS:", res.status);
  console.log("LOGIN DATA:", data);

  if (!res.ok) {
    throw new Error(data.msg || data.error || "Login failed");
  }

  return data;
};


// REGISTER
export const registerUser = async (payload: {
  phone: string;
  name: string;
  email: string;
  password: string;
}) => {

  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log("REGISTER STATUS:", res.status);
  console.log("REGISTER DATA:", data);

  if (!res.ok) {
    throw new Error(data.msg || data.error || "Registration failed");
  }

  return data;
};

//LOGOUT
export const logoutUser = async () => {
  const res = await fetch(`${BASE}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  console.log("LOGOUT STATUS:", res.status);
  console.log("LOGOUT DATA:", data);

  if (!res.ok) {
    throw new Error(data.msg || data.error || "Logout failed");
  }

  return data;
};
