import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  message: null,
  status: "idle",
  error: null,
}

const BASE_URL = "http://localhost:8080/rest/api/payment"

export const processPayment = createAsyncThunk("payment/processPayment", async (payment, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/save`, payment, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Ödeme Başarısız")
  }
})

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.status = "loading"
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.message = action.payload
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export default paymentSlice.reducer

