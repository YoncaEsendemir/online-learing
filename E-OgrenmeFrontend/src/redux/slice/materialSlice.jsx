import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  materialList: [], // Tüm materyalleri getir
  material: null, // Tek bir materyal
  message: "", // metodan gelen mesaj almak için
  status: "idle", // API çağrısı durumu
  error: null, // Hata mesajı
};


// Material silme
export const deleteMaterial = createAsyncThunk(
  "material/deleteMaterial",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Silme işlemi başarısız");
    }
  }
);

// ID'ye göre materyal fetch
export const fetchMaterialById = createAsyncThunk(
  "material/fetchMaterialById",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getMaterial/${courseId}`);
      if (!Array.isArray(response.data)) {
        throw new Error("API bir materyal dizisi döndürmüyor!");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Materialler bulunamadı");
    }
  }
);

// Video güncelleme
export const putVideo = createAsyncThunk(
  "material/putVideo",
  async ({ id, videoData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, videoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Video güncellenemedi");
    }
  }
);

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // deleteMaterial reducers
      .addCase(deleteMaterial.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchMaterialById reducers
      .addCase(fetchMaterialById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaterialById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.materialList = action.payload;
      })
      .addCase(fetchMaterialById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // putVideo reducers
      .addCase(putVideo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(putVideo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.material = action.payload;
      })
      .addCase(putVideo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default materialSlice.reducer;
