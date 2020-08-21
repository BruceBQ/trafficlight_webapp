import { put, call, select} from 'redux-saga/effects'
import _ from 'lodash'
import * as WaitTimeApi from 'api/waitTime'
import { filterWaitTimeChartDataSuccess } from 'actions/action_wait_time'

export function* workerFilterWaitTimeChartData(action){
  try {
    const res = yield call(WaitTimeApi.filterChartData, action.payload)
    console.log(res)
    yield put(filterWaitTimeChartDataSuccess(res.data.data))
  } catch (error) {
    
  }
}