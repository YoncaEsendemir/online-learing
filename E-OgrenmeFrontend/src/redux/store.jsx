import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import categoryReducer from './slice/categorySlice';
import courseReducer from './slice/courseSlice';
import enrollmentReducer from './slice/enrollmentSlice';
import materialReducer from './slice/materialSlice';
import videoReducer from './slice/videoSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    category:categoryReducer,
    course:courseReducer,
    enrollment:enrollmentReducer,
    material:materialReducer,
    video:videoReducer

  },
});