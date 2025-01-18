import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  enrollmentList: [], // Tüm kayıtları tutar
  enrollment: null, // Tek bir kaydı tutar
  status: "idle", // API çağrısı durumu
  error: null, // Hata mesajı
};

const BASE_URL = "http://localhost:8080/rest/api/enrollment";

// ID'ye göre kayıt getir
export const fetchEnrollmentById = createAsyncThunk(
  "enrollment/fetchEnrollmentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kayıt bulunamadı");
    }
  }
);

// Kullanıcı ID'ye göre kayıt getir
export const fetchEnrollmentByUserId = createAsyncThunk(
  "enrollment/fetchEnrollmentByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getByUser/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kayıtlar bulunamadı");
    }
  }
);

// Kurs ID'ye göre kayıt getir
export const fetchEnrollmentByCourseId = createAsyncThunk(
  "enrollment/fetchEnrollmentByCourseId",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getByCourse/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kayıtlar bulunamadı");
    }
  }
);

// Tüm kayıtları getir
export const fetchAllEnrollments = createAsyncThunk(
  "enrollment/fetchAllEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kayıtlar getirilemedi");
    }
  }
);

// Yeni bir kayıt oluştur
export const saveEnrollment = createAsyncThunk(
  "enrollment/saveEnrollment",
  async (enrollmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/save`, enrollmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kayıt oluşturulamadı");
    }
  }
);

// Kayıt sil
export const deleteEnrollment = createAsyncThunk(
  "enrollment/deleteEnrollment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kayıt silinemedi");
    }
  }
);

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchEnrollmentById reducers
      .addCase(fetchEnrollmentById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnrollmentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrollment = action.payload;
      })
      .addCase(fetchEnrollmentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchEnrollmentByUserId reducers
      .addCase(fetchEnrollmentByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnrollmentByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrollmentList = action.payload;
      })
      .addCase(fetchEnrollmentByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchEnrollmentByCourseId reducers
      .addCase(fetchEnrollmentByCourseId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnrollmentByCourseId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrollmentList = action.payload;
      })
      .addCase(fetchEnrollmentByCourseId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchAllEnrollments reducers
      .addCase(fetchAllEnrollments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllEnrollments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrollmentList = action.payload;
      })
      .addCase(fetchAllEnrollments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // saveEnrollment reducers
      .addCase(saveEnrollment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveEnrollment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrollment = action.payload;
      })
      .addCase(saveEnrollment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // deleteEnrollment reducers
      .addCase(deleteEnrollment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.enrollmentList = state.enrollmentList.filter(
          (enrollment) => enrollment.id !== action.payload.id
        );
      })
      .addCase(deleteEnrollment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default enrollmentSlice.reducer;
