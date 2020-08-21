import * as types from '../constant/constant_actions'
import actionCreator from '../utils/actionCreator'

export const filterWaitTimeChartData = actionCreator(
  types.FILTER_WAIT_TIME_CHART_DATA,
  'payload'
)

export const filterWaitTimeChartDataSuccess = actionCreator(
  types.FILTER_WAIT_TIME_CHART_DATA_SUCCESS,
  'payload'
)

export const filterWaitTimeChartDataFailure = actionCreator(
  types.FILTER_WAIT_TIME_CHART_DATA_FAILURE,
  'payload'
)