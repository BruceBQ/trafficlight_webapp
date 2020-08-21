import axios from 'axios'
import { API_URL } from 'constant/constant_endpoint'

export function filterChartData(payload){
  return axios({
    method: 'get',
    url: `${API_URL}api/waittime`,
    params: {
      filter: payload.filter,
      time: payload.time
    }
  })
}