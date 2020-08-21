import { takeEvery, takeLatest} from 'redux-saga/effects'
import * as types from 'constant/constant_actions'

import {
  workerFilterWaitTimeChartData
} from './waitTime_saga'

export default function* watchWaitTime(){
  yield takeEvery(types.FILTER_WAIT_TIME_CHART_DATA, workerFilterWaitTimeChartData)
}