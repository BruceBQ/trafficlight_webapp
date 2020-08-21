import { takeEvery, takeLatest, put } from 'redux-saga/effects'
import * as types from '../constant/constant_actions'

import {
  workerSearchVehicles,
} from './vehicle_saga'

export default function* watchVehicle(){
  // search vehicles
  yield takeEvery(types.SEARCH_VEHICLES, workerSearchVehicles)
}