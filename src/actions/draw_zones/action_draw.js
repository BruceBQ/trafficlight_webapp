import * as types from './action_types'

export const isDrawZones = (payload) => {
    return {
      type: types.IS_DRAW_ZONES,
      payload
    }
  }

  export const isDrawArrow = (payload) => {
    return {
      type: types.IS_DRAW_ARROW,
      payload
    }
  }
  
export const onChangeTypeDraw = (name) => {
    return {
      type: types.TYPE_DRAW,
      name,
    }
  }

  export const finishShape = (payload) => {
    return {
      type: types.FINISH_SHAPE,
      payload
    }
  } 

  export const addDimension = (payload) => {
    return {
      type: types.ADD_DIMENSION,
      payload
    }
  } 

  export const removeShape = (id) => {
    return {
      type: types.REMOVE_SHAPE,
      id
    }
  } 

  export const removeDirect = (id) => {
    return {
      type: types.REMOVE_DICRECT,
      id
    }
  } 

  export const shapeSelected = (id) => {
    return {
      type: types.SHAPE_SELECTED,
      id
    }
  }

  export const setupRatio = (payload) => {
    return {
      type: types.SETUP_RATIO,
      payload
    }
  }

  export const cancelDraw = () => {
    return {
      type: types.CANCEL_DRAWZONE
    }
  }

  export const resetZonesDrew = () => {
    return {
      type: types.RESET_ZONES_DREW
    }
  }