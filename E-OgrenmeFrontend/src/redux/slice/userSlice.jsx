import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [], // Tüm kullanıcılar
  user: null, // Tek bir kullanıcı
  loggedInUser: null, // Giriş yapmış kullanıcı    
  status: 'idle', // API çağrısı durumu
  error: null, // Hata mesajı
};

const BASE_URL = 'http://localhost:8080/rest/api/user';

// Tüm kullanıcıları getirme (GET /rest/api/user/list)
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(`${BASE_URL}/list`);
  if (!Array.isArray(response.data)) {
    throw new Error('API did not return an array of users');
  }
  return response.data;
});

// Tek bir kullanıcı getirme (GET /rest/api/user/list/:userId)
export const fetchUserById = createAsyncThunk('users/fetchUserById', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/list/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Kullanıcı düzenleme (PUT /rest/api/user/update/:userId)
export const editUser = createAsyncThunk('users/editUser', async ({ userId, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Güncelleme işlemi başarısız oldu!');
  }
});

// Kullanıcı giriş işlemi (POST /rest/api/user/login)
export const loginUser = createAsyncThunk('users/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Yeni kullanıcı ekleme (POST /rest/api/user/save)
export const createUser = createAsyncThunk('users/createUser', async (user, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/save`, user, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Kullanıcı silme (DELETE /rest/api/user/delet/:userId)
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/delet/${userId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return userId; // Sadece silinen kullanıcı ID'sini döndür
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Silme işlemi başarısız oldu!');
  }
});

// Kullanıcı arama (POST /rest/api/user/search)
export const searchUsers = createAsyncThunk("users/searchUsers", async (criteria) => {
  const response = await axios.post(`${BASE_URL}/search`, criteria)
  return response.data
})

// Slice oluşturma
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.loggedInUser = null;
      state.status = 'idle';
      state.error = null;
    },

    setUser:(state,action)=>{
      state.loggedInUser= action.payload;
    },
  },
  extraReducers: (builder) => {
    // Tüm kullanıcıları getirme durumları
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // Tek bir kullanıcıyı getirme durumları
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload || null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // Kullanıcı düzenleme durumları
    builder
      .addCase(editUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload || null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // Kullanıcı giriş işlemi durumları
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loggedInUser = action.payload || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // Yeni kullanıcı ekleme durumları
    builder
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // Kullanıcı silme durumları
    builder
    .addCase(deleteUser.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // Silinen kullanıcının ID'sine göre kullanıcı listesini güncelle
      state.users = state.users.filter((user) => user.id !== action.meta.arg); // action.meta.arg, gönderilen userId'yi içerir
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || action.error.message;
    });

    // Kullanıcı arama durumları
    builder
      .addCase(searchUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.users = action.payload
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })

  },
});

export const { logout ,setUser} = userSlice.actions;
export default userSlice.reducer;

