import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    courseList: [], // Tüm Kurs getirir
    course: null, //Tek bir Kurs getirir
    message: '', // Kurs silininc mesaj almak için 
    status: 'idle',// API çağrısı durumu
    error: null //hata mesajı
};

const BASE_URL = 'http://localhost:8080/rest/api/course';

export const fetchCourseById= createAsyncThunk('course/fetchCourseById',async(courseId)=>{
 try{
        const response= await axios.get(`${BASE_URL}/getById/${courseId}`);
        return response.data;
 }
 catch(error){
  /*: Eğer hata nesnesinin response özelliği varsa ve bu özelliğin altında bir data özelliği daha varsa, bu data özelliği içindeki değeri alır. Bu genellikle API'den gelen bir hata mesajı olabilir. */
   throw error.response?.data || 'kurs  bulunamadı ';
 }
});
/*   (?.): Bu operatör, bir nesnenin özelliğinin olup olmadığını kontrol etmenin daha kısa bir yoludur. 
Eğer error.response null veya undefined ise, data özelliğine erişmeye çalışmak yerine undefined döner.);
    } */

export const fetchCourses = createAsyncThunk('course/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAll`);
    if (!Array.isArray(response.data)) {
      throw new Error('API bir kurs dizisi döndürmüyor!');
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Kurslar bulunamadı');
  }
});

export const deleteCourse = createAsyncThunk(
  'course/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${courseId}`);
      return courseId; // Silinen kursun ID'sini dön
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Silme işlemi başarısız');
    }
  }
);

export const creatCourse = createAsyncThunk(
  'course/creatCourse',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Kurs oluşturulamadı');
    }
  }
);

// Kurs Güncelleme
export const updateCourse = createAsyncThunk(
  'course/updateCourse',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; // Güncellenen kurs bilgisi döner
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Kurs güncellenemedi');
    }
  }
);

export const searchCourses = createAsyncThunk("course/searchCourses", async (criteria, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/search`, criteria)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Kurslar aranamadı")
  }
})

const courseSlice = createSlice({
  name:'course',
  initialState,
  reducers: {},

  extraReducers:(builder)=>{
    // Tüm Kursları getirir 
     //Kurs getirme bekleme durumu 
      builder.addCase(fetchCourses.pending,(state)=>{
        state.status= 'loading';
      })
      // eğer kurs başarılı bir şekilde dönerse
      .addCase(fetchCourses.fulfilled,(state,action)=>{
        state.status= 'succeeded';
        state.courseList=action.payload;
      })
      //eğer kursa döndürmete hata oluşursa
      .addCase(fetchCourses.rejected,(state,action)=>{
        state.status='failed';
        satus.error=action.error.message;
      });

      // Tek bir Kurs getirme durmu 
      builder.addCase(fetchCourseById.pending,(state)=>{
        state.status='loading';
      })
      .addCase(fetchCourseById.fulfilled,(state,action)=>{
         state.status='succeeded';
         state.course=action.payload;
      })
      .addCase(fetchCourseById.rejected,(state,action)=>{
          state.status='failed';
          state.error=action.error.message;
      });

      //Kurs Silme durumu 
              builder
              .addCase(deleteCourse.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courseList = state.courseList.filter((course) => course.id !== action.meta.arg);
              })
              .addCase(deleteCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
              });

      //Kurs kayıt Et 
      builder
      .addCase(creatCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(creatCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courseList.push(action.payload);
      })
      .addCase(creatCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });


        // Kurs Güncelle
    builder
    .addCase(updateCourse.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(updateCourse.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const updatedCourseIndex = state.courseList.findIndex((course) => course.id === action.payload.id);
      if (updatedCourseIndex !== -1) {
        state.courseList[updatedCourseIndex] = action.payload; // Kursu güncelle
      }
    })
    .addCase(updateCourse.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    //Kurs Arama için 
    builder
    .addCase(searchCourses.pending, (state) => {
      state.status = "loading"
    })
    .addCase(searchCourses.fulfilled, (state, action) => {
      state.status = "succeeded"
      state.courseList = action.payload
    })
    .addCase(searchCourses.rejected, (state, action) => {
      state.status = "failed"
      state.error = action.payload
    })

  },

});

export default courseSlice.reducer

