import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("/user/login", { email, password });
    if (res.status !== 200) {
      throw new Error("Failed to login");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};

export const signupUser = async (name:string,email: string, password: string) => {
  try {
    const res = await axios.post("/user/signup", { name,email, password });
    if (res.status !== 201) {
      throw new Error("Failed to Register");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};


export const checkAuthStatus = async () => {
  try {
    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) {
      throw new Error("Failed to Authenticate");
    }
    if (!res.data || !res.data.name) {
      throw new Error("Invalid Authentication Data");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};

export const sendChatRequest = async (message: string) => {
  try {
    const res = await axios.post("/chat/new", { message });
    if (res.status !== 200) {
      throw new Error("Failed to Authenticate");
    }
    if (!res.data || !res.data.name) {
      throw new Error("Invalid Authentication Data");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};

export const getUserChats = async () => {
  try {
    const res = await axios.get("/chat/all-chats");
    if (res.status !== 200) {
      throw new Error("Failed to Authenticate");
    }
    if (!res.data || !res.data.name) {
      throw new Error("Invalid Authentication Data");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await axios.delete("/chat/delete");
    if (res.status !== 200) {
      throw new Error("Failed to Authenticate");
    }
    if (!res.data || !res.data.name) {
      throw new Error("Unable to delete chat");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get("/user/logout");
    if (res.status !== 200) {
      throw new Error("Failed to Authenticate");
    }
    if (!res.data || !res.data.name) {
      throw new Error("Unable to delete chat");
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw error to be caught in the calling function
  }
};

