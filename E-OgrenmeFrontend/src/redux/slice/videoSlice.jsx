import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState={
    videoList:[],// Tüm videoları getir
    video:null, // tek bir video getir
    message:'',// video silinince mesaj almak için
    status:'idle',//API çağrisi durumu
    error:null//hata mesajı
};

const BASE_URL='http://localhost:8080/rest/api/video';

export const addVideo= createAsyncThunk('video/addVideo',async(courseId)=>{
try{
const response=await axios.post(`${BASE_URL}/add/${courseId}`,formdata,{
    headers:{
        'Content-Type': 'multipart/form-data',
    },
})
return response.data;
}
catch(error){
console.error('API Error:',error.response?.message);
return rejectWithValue(error.response?.data?.message || 'Video Eklenemedi');
}
});

export const fetchVideoByCoursId= createAsyncThunk('video/fetchVideoByCoursId',async(courseId)=>{
try{
    const response =await axios.get(`${BASE_URL}/course/${courseId}`)
    if(!Array.isArray(response.data)){
        throw new Error('API bir video dizisi dönmüyor!');
    }
    return response.data;
}
catch (error) {
    return rejectWithValue(error.response?.data || 'video bulunamadı');
  }
});

export const deleteVideo=createAsyncThunk('video/deleteVideo',
    async(courseId,{rejectWithValue})=>{
       try{
        const response =await axios.delete(`${BASE_URL}/delete/${courseId}`);
        return response.data;
       }
       catch (error) {
        return rejectWithValue(error.response?.data || 'Silme işlemi başarısız');
      }
    }
);

const videoSlice= createSlice({
    name:'video',
    initialState,
    reducers:{},

    extraReducers:(builder)=>{
        // Cours id göre Video getir
        builder.addCase(fetchVideoByCoursId.pending,(state,action) =>{
            state.status= 'loading';
        })
        .addCase(fetchVideoByCoursId.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.videoList=action.payload;
        } )
        .addCase(fetchVideoByCoursId.rejected,(state,action)=>{
            state.status='failed';
            satus.error=action.error.message;
        });

// video Silmw 
        
        builder.addCase(deleteVideo.fulfilled,()=>{
            state.status='succeeded';
            state.videoList = state.videoList.filter((video) => video.id !== action.meta.arg);
        })
        .addCase(deleteVideo.rejected,()=>{
            state.status='failed';
            satus.error=action.error.message;
        })

        // video kayit et 
        builder.addCase(addVideo.pending,(state)=>{
            state.status = 'loading';
        })
        .addCase(addVideo.fulfilled,(state,action)=>{
            state.status = 'succeeded';
            state.videoList.push(action.payload);  
        })
        .addCase(addVideo.rejected,(state,action)=>{
            state.status = 'failed';
            state.error = action.payload;
        })
    }

});

export default videoSlice.reducer