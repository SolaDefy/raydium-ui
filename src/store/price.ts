import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { cloneDeep } from 'lodash-es'
import { PricesData } from '@/types/api'

import logger from '@/utils/logger'
import { NATIVE_SOL, WSOL_MINT } from '@/utils/tokens'

const AUTO_REFRESH_TIME = 60

export const state = () => ({
  initialized: false,
  loading: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,

  prices: {} as PricesData
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setInitialized(state) {
    state.initialized = true
  },

  setLoading(state, loading: boolean) {
    if (loading) {
      state.countdown = AUTO_REFRESH_TIME
    }

    state.loading = loading

    if (!loading) {
      state.countdown = 0
    }
  },

  setPrices(state, prices: PricesData) {
    state.prices = cloneDeep(prices)
  },

  setCountdown(state, countdown: number) {
    state.countdown = countdown
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestPrices({ commit }) {
      commit('setLoading', true)

      const prices: PricesData = await this.$api.getPrices()
      prices[NATIVE_SOL.mintAddress] = prices[WSOL_MINT]

      commit('setPrices', prices)
      logger('Price updated')

      commit('setInitialized')
      commit('setLoading', false)
    }
  }
)
