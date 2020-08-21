import * as types from 'actions/draw_zones/action_types'

const initialState = {
  controlDraw: {
    status: null,
  },
  controlDrawDirect: {
    status: null,
  },
  dimension: null,
  idDirect: null,
  idShape: null,
  ratio: null,
  shapeSelected: null,
  zoneOptions: [
    { id: 1, title: 'Đèn đỏ', type: 'Red light', color: '#d50000', shape: 'rectangle', direct: 'no', vertices: [] },
    { id: 2, title: 'Đèn vàng', type: 'Yellow light', color: '#ffff00', shape: 'rectangle', direct: 'no', vertices: [] },
    { id: 3, title: 'Đèn xanh', type: 'Green light', color: '#4caf50', shape: 'rectangle', direct: 'no', vertices: [] },
    { id: 4, title: 'Vượt đèn đỏ', type: 'Stoplights', color: '#f44336', shape: 'polygon', direct: 'yes', vertices: [], arrow: [] },
    { id: 5, title: 'Lấn làn', type: 'Roadlane', color: '#009688', shape: 'polygon', direct: 'yes', vertices: [], arrow: [] },
    { id: 6, title: 'Đếm lưu lượng', type: 'Flow calculator', color: '#e65100', shape: 'polygon', direct: 'yes', vertices: [], arrow: [] },
    { id: 7, title: 'Dòng chờ 10m', type: 'Waitline 10m', color: '#ef6c00', shape: 'polygon', direct: 'no', vertices: [] },
    { id: 8, title: 'Dòng chờ 20m', type: 'Waitline 20m', color: '#f57c00', shape: 'polygon', direct: 'no', vertices: [] },
    { id: 9, title: 'Dòng chờ 30m', type: 'Waitline 30m', color: '#fb8c00', shape: 'polygon', direct: 'no', vertices: [] },
    { id: 10, title: 'Dòng chờ 40m', type: 'Waitline 40m', color: '#ff9800', shape: 'polygon', direct: 'no', vertices: [] },
    { id: 11, title: 'Đếm thời gian chờ', type: 'Waittime', color: '#ffa726', shape: 'polygon', direct: 'no', vertices: [] },
  ],
}

const DrawZones = (state = initialState, action) => {
  switch (action.type) {
    case types.IS_DRAW_ZONES:
      // let statusDraw = null;
      // if(state.controlDrawDirect.status === 1) {
      //   statusDraw = null
      // }
      return {
        ...state,
        controlDraw: {
          status: 1,
          ...action.payload,
        },
        // controlDrawDirect: {
        //   status: statusDraw,
        // },
        idDirect: null,
        idShape: null,
      }
    case types.IS_DRAW_ARROW:
      // let statusDrawDirect = null;
      // if(state.controlDraw.status === 1) {
      //   statusDrawDirect = null
      // }
      return {
        ...state,
        controlDrawDirect: {
          status: 1,
          ...action.payload,
        },
        // controlDraw: {
        //   status: statusDrawDirect,
        // },
        idShape: null,
        idDirect: null,
      }
    case types.FINISH_SHAPE:
      let status = null

      if (state.controlDrawDirect.status) {
        status = 2
      }
      state.zoneOptions.map((zone) => {
        action.payload.find((shape) => {
          if (shape.id === zone.id) {
            // zone.points = shape.points
            zone.vertices = shape.vertices

            if (shape.arrow) {
              // zone.arrowLine = shape.arrowLine
              zone.arrow = shape.arrow
            }
          }
        })
      })
      return {
        ...state,
        controlDraw: {
          ...state.controlDraw,
          status: 2,
        },
        controlDrawDirect: {
          ...state.controlDrawDirect,
          status,
        },
      }
    case types.ADD_DIMENSION:
      // localStorage.setItem('dimension', JSON.stringify(action.payload))
      return {
        ...state,
        dimension: {
          width: action.payload.width,
          height: action.payload.height,
        },
      }
    case types.SHAPE_SELECTED:
      return {
        ...state,
        shapeSelected: action.id,
      }

    case types.SETUP_RATIO:
      return {
        ...state,
        ratio: action.payload,
      }

    case types.REMOVE_SHAPE:
      state.zoneOptions.map((zone) => {
        if (zone.id === action.id) {
          zone.vertices = []
          if (zone.arrow?.length) {
            zone.arrow = []
          }
        }
      })

      return {
        ...state,
        idShape: action.id,
        idDirect: null,
        shapeSelected: null,
        controlDraw: {
          status: null,
        },
        controlDrawDirect: {
          status: null,
        },
      }

    case types.REMOVE_DICRECT:
      state.zoneOptions.map((zone) => {
        if (zone.id === action.id) {
          return (zone.arrow = [])
        }
      })

      return {
        ...state,
        idDirect: action.id,
        controlDrawDirect: {
          status: null,
        },
      }

    case types.CANCEL_DRAWZONE:
      return {
        ...state,
        controlDraw: {
          status: null,
        },
      }

    case types.RESET_ZONES_DREW:
      initialState.zoneOptions.map((data) => {
        if (data.vertices.length) {
          data.vertices = []
          if (data.arrow?.length) {
            data.arrow = []
          }
        }
      })
      return initialState
    default:
      return state
  }
}

export default DrawZones
