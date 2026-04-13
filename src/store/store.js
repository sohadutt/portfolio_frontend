import { configureStore } from "@reduxjs/toolkit"
import portfolioReducer from "@/store/portfolioSlice"

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
})
