import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  fetchDashboardPortfolios,
  fetchPublicPortfolio,
  togglePortfolioVisibility,
} from "@/helper/functions"

const getPublicPortfolioKey = ({ token = null, index = 1 } = {}) => `${token || "default"}:${Number(index) || 1}`
const hasOrderIndex = (portfolio, orderIndex) => Number(portfolio.order_index) === Number(orderIndex)

const initialState = {
  publicPortfolio: {
    data: null,
    loading: false,
    error: null,
    requestKey: null,
  },
  dashboardPortfolios: {
    items: [],
    loading: false,
    error: null,
  },
}

export const loadPublicPortfolio = createAsyncThunk(
  "portfolio/loadPublicPortfolio",
  async ({ token = null, index = 1 } = {}) => fetchPublicPortfolio(token, index),
  {
    condition: (params, { getState }) => {
      const requestKey = getPublicPortfolioKey(params)
      const { publicPortfolio } = getState().portfolio
      return !(publicPortfolio.loading && publicPortfolio.requestKey === requestKey)
    },
  }
)

export const loadDashboardPortfolios = createAsyncThunk(
  "portfolio/loadDashboardPortfolios",
  async () => {
    const response = await fetchDashboardPortfolios()
    return response?.portfolios || []
  }
)

export const updatePortfolioVisibility = createAsyncThunk(
  "portfolio/updatePortfolioVisibility",
  async ({ orderIndex, currentStatus }, { rejectWithValue }) => {
    try {
      const response = await togglePortfolioVisibility(orderIndex)
      return {
        orderIndex,
        isEnabled: response?.is_enabled ?? !currentStatus,
      }
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to update visibility",
        orderIndex,
        currentStatus,
      })
    }
  }
)

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPublicPortfolio.pending, (state, action) => {
        state.publicPortfolio.loading = true
        state.publicPortfolio.error = null
        state.publicPortfolio.requestKey = getPublicPortfolioKey(action.meta.arg)
        state.publicPortfolio.data = null
      })
      .addCase(loadPublicPortfolio.fulfilled, (state, action) => {
        const requestKey = getPublicPortfolioKey(action.meta.arg)
        if (state.publicPortfolio.requestKey !== requestKey) return

        state.publicPortfolio.data = action.payload
        state.publicPortfolio.loading = false
      })
      .addCase(loadPublicPortfolio.rejected, (state, action) => {
        const requestKey = getPublicPortfolioKey(action.meta.arg)
        if (state.publicPortfolio.requestKey !== requestKey) return

        state.publicPortfolio.loading = false
        state.publicPortfolio.error = action.error?.message || "Failed to load portfolio"
      })
      .addCase(loadDashboardPortfolios.pending, (state) => {
        state.dashboardPortfolios.loading = true
        state.dashboardPortfolios.error = null
      })
      .addCase(loadDashboardPortfolios.fulfilled, (state, action) => {
        state.dashboardPortfolios.items = action.payload
        state.dashboardPortfolios.loading = false
      })
      .addCase(loadDashboardPortfolios.rejected, (state, action) => {
        state.dashboardPortfolios.loading = false
        state.dashboardPortfolios.error = action.error?.message || "Failed to load portfolios"
      })
      .addCase(updatePortfolioVisibility.pending, (state, action) => {
        const { orderIndex, currentStatus } = action.meta.arg
        const item = state.dashboardPortfolios.items.find((portfolio) => hasOrderIndex(portfolio, orderIndex))
        if (item) item.is_enabled = !currentStatus
      })
      .addCase(updatePortfolioVisibility.fulfilled, (state, action) => {
        const item = state.dashboardPortfolios.items.find(
          (portfolio) => hasOrderIndex(portfolio, action.payload.orderIndex)
        )
        if (item) item.is_enabled = action.payload.isEnabled
      })
      .addCase(updatePortfolioVisibility.rejected, (state, action) => {
        const payload = action.payload
        if (!payload) return

        const item = state.dashboardPortfolios.items.find((portfolio) => hasOrderIndex(portfolio, payload.orderIndex))
        if (item) item.is_enabled = payload.currentStatus
        state.dashboardPortfolios.error = payload.message
      })
  },
})

export const selectPublicPortfolio = (state) => state.portfolio.publicPortfolio
export const selectDashboardPortfolios = (state) => state.portfolio.dashboardPortfolios

export default portfolioSlice.reducer
