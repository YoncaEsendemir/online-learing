import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  comments: [], // Changed back to an array as we're not storing by courseId anymore
  status: "idle",
  error: null,
}

const BASE_URL = "http://localhost:8080/rest/api/comments"

export const createComment = createAsyncThunk("comment/createComment", async (commentData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/save`, commentData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Kayıt oluşturulamadı")
  }
})

export const fetchCommentsByCourseId = createAsyncThunk(
  "comment/fetchCommentsByCourseId",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getcomments/${courseId}`)
      if (!Array.isArray(response.data)) {
        throw new Error("API bir yorum dizisi döndürmüyor!")
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Yorumlar bulunamadı")
    }
  },
)

const commentsSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByCourseId.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCommentsByCourseId.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.comments = action.payload
      })
      .addCase(fetchCommentsByCourseId.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(createComment.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.comments.push(action.payload)
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export default commentsSlice.reducer

