import * as types from 'constant/constant_actions'

const initialState = {
  data: {
    wait: [],
    waittime: [],
    waittimeavg: []
  },
  filter: {
    date: new Date()
  },
  api: {
    isFetchingChartData: false
  }
}

export default function waitTimeReducer(state= initialState, action){
  switch (action.type) {
    case types.FILTER_WAIT_TIME_CHART_DATA:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload
        },
        api: {
          ...state.api,
          isFetchingChartData: true
        }
      }
    case types.FILTER_WAIT_TIME_CHART_DATA_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload 
        },
        api: {
          ...state.api,
          isFetchingChartData: false
        }
      }

    case types.FILTER_WAIT_TIME_CHART_DATA_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          ...initialState.data
        },
        api: {
          ...state.api,
          isFetchingChartData: false
        }
      }
    default:
      return state
  }
}