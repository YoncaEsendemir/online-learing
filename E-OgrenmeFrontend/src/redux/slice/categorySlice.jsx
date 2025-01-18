import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';


const initialState = {
    categoryList: [], // Tüm Categoryleri getirir
    category: null, //Tek bir Kategori getirir
    message: '', // kategori silininc mesaj almak için 
    status: 'idle',// API çağrısı durumu
    error: null //hata mesajı
}

const BASE_URL = 'http://localhost:8080/rest/api/category';


// istekler yazılıyor 

/*
Hangi işlemin ne zaman tetiklendiğini kolayca anlayabilirsiniz.
Uygulamanın işleminin (akış) ayrıntılı bir şekilde görebilirsiniz.
Eğer bir hata varsa, hangi eylem sırasında olduğunu fark edebilirsiniz.
 */

// Kategorileri getirme (GET isteğe ile)

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/all-category`);
            
            // Gelen veri bir dizi mi kontrol ediyoruz.
            if (!Array.isArray(response.data)) {
                throw new Error('API did not return an array of Category');
            }

            return response.data;
        } catch (error) {
            // Hata mesajını rejectWithValue ile döndürüyoruz
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
// Tek bir kategoriyi silme (DELETE isteği ile)

/*
rejectWithValuebu hata mesajını Redux'a action.payloadiçinde gönderir. Böylece hata durumlarını Redux tarafında daha kolay ve özelleştirilmiş bir şekilde görebilirsiniz.
 */

export const deleteCategoryById = createAsyncThunk('category/deleteCategoryById', async (categoryId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete-category/${categoryId}`)
        return response.data; // Silinen kategorinin mesajını döndürür 
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Silme işlemi başarısız oldu")
    }
});

export const editCategory = createAsyncThunk('category/editCategory', async ({categoryId,category},{ rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_URL}/update-category/${categoryId}`, category, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        /*
        Sunucudan gelen bilgileri içerir (örneğin, HTTP 404 veya 500 hataları)
        Eğer error.response?.data nullveya undefinedise, 
        "Silme işlemi başarısız oldu"yedek hata mesajı olarak görüntülenir.
         */
        return rejectWithValue(error.response?.data?.message || "Güncelleme işlemi başarısız oldu!");
    }
})
// yeni Category Ekleme  
export const createCategory = createAsyncThunk('category/createCategory', async (category) => {
    try {
        const response = await axios.post(`${BASE_URL}/save-category`, category, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "Kategori eklenemedi");
    }
});

//categorySlice oluşturuluyor 
/*Bu kısım, dilime asenkron seçeneklerini seçmek için kullanılır. Asenkron işlemleri, createAsyncThunkile işlem işlemleri (thunks) işler. Örneğin: */
const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        updateLocal: (state, action) => {
          state.categoryList = action.payload;
        }
    },

    extraReducers: (builder) => {
        //fetchCategory Reducers
        //Tüm kategorileri getirme durumu
        //veriler bekletme durumunda verilerin gelmesinin beklenmesi
        builder.addCase(fetchCategory.pending, (state) => {
            state.status = 'loading';
        })

        //veriler başarılı bir şekide alındı
        builder.addCase(fetchCategory.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.categoryList = action.payload;
        })

        //Hata varsa bu durum döner
        builder.addCase(fetchCategory.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })

        .addCase(editCategory.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(editCategory.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const index = state.categoryList.findIndex(cat => cat.id === action.payload.id);
            if (index !== -1) {
                state.categoryList[index] = action.payload;
            }
        })
        .addCase(editCategory.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(deleteCategoryById.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteCategoryById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.categoryList = state.categoryList.filter(category => category.id !== action.payload);
        })
        .addCase(deleteCategoryById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        //Kategori eklme (Kayit durumları)
        //kategori başarılı bir şekilde eklendi ise
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.categoryList.push(action.payload);
        });

    }
});


export const { updateLocal } = categorySlice.actions;
export default categorySlice.reducer;