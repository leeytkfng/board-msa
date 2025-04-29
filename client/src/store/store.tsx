import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authSlice,  // ✅ userSlice 제거, auth만 사용
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = () => useDispatch();
export default store;
