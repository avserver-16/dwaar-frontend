import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE = `${process.env.EXPO_PUBLIC_API_URL}/users`;

// CHECK PHONE
export const checkPhone = async (phone: string) => {
  const res = await fetch(`${BASE}/check-phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Phone check failed");
  return data;
};

// LOGIN — stores token if returned
export const loginUser = async (payload: {
  phone: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Login failed");

  // Store token and user if present
  if (data.token) {
    await AsyncStorage.setItem("authToken", data.token);
  }
  if (data.user) {
    await AsyncStorage.setItem("authUser", JSON.stringify(data.user));
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Registration failed");
  return data;
};

// LOGOUT — clears token
export const logoutUser = async () => {
  const res = await fetch(`${BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Logout failed");

  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("authUser");

  return data;
};

// GET stored session (used for auto-login check)
export const getStoredSession = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userStr = await AsyncStorage.getItem("authUser");

    if (!token || !userStr) return null;

    const user = JSON.parse(userStr);

    return {
      token,
      user,
      userId: user?._id,
    };
  } catch (error) {
    console.log("Session parse error:", error);
    return null;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const session = await getStoredSession();

    if (!session) return null;

    const userId = session.user?._id;

    /*
      FIRST REQUEST
    */
    let response = await fetch(
      `${BASE}/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    /*
      TOKEN EXPIRED
    */
    if (response.status === 401) {
      const newToken =
        await refreshAccessToken();

      if (!newToken) return null;

      /*
        RETRY REQUEST
      */
      response = await fetch(
        `${BASE}/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.msg || "Failed to fetch user"
      );
    }

    if (data.user) {
      await AsyncStorage.setItem(
        "authUser",
        JSON.stringify(data.user)
      );
    }

    return data;
  } catch (error) {
    console.log("Fetch user error:", error);
    return null;
  }
};
export const refreshAccessToken = async () => {
  try {
    const refreshToken =
      await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) return null;

    const response = await fetch(
      `${BASE}/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.msg || "Refresh token failed"
      );
    }

    /*
      STORE NEW ACCESS TOKEN
    */
    if (data.token) {
      await AsyncStorage.setItem(
        "authToken",
        data.token
      );
    }

    return data.token;
  } catch (error) {
    console.log("Refresh token error:", error);

    /*
      SESSION EXPIRED
    */
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("authUser");

    return null;
  }
};