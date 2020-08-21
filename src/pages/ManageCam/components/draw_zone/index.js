import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import * as d3 from 'd3'
import { finishShape, addDimension, removeShape, shapeSelected, setupRatio, cancelDraw, resetZonesDrew } from 'actions/draw_zones/action_draw'
import _ from 'lodash'

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  rootCanvas: {
    width: '100%',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  button: {
    cursor: 'pointer',
    margin: 10,
  },
}


import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import * as d3 from 'd3'

import { finishShape, addDimension, removeShape, shapeSelected, setupRatio, cancelDraw, resetZonesDrew } from 'actions/draw_zones/action_draw'
import _ from 'lodash'

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  rootCanvas: {
    width: '100%',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  button: {
    cursor: 'pointer',
    margin: 10,
  },
}

class ShapeD3 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      svgCanvas: null,
      shapePoints: [],
      dataShapePoints: [],
      isDrawing: false,
      isDragging: false,
      startPoint: null,
      gShape: null,
      shapeSelected: null,
      dragCircle: null,
      // dragCircleLoad: null,
      isDrawPolygon: false,
      isArrowLine: false,
      ratio: null,
      controlRectangle: {
        DragC1: null,
        DragC2: null,
        DragC3: null,
        DragC4: null,
        DragRect: null,
        isRectangle: false,
      },
      enterFinish: false
    }
  }

  componentDidMount = () => {
    this.init()
  }

  componentDidUpdate = () => {
    this.onChangeDraw()
    this.deleteShapeOnchange()
  }

  deleteShapeOnchange = () => {
    let { idDirect, idShape } = this.props
    let { dataShapePoints } = this.state

    if (idShape) {
      d3.select(`#__${idShape}`).remove()
      if (dataShapePoints.length) {
        let dataArrow = dataShapePoints.filter((data) => data.id === idShape)
        if(dataArrow.length) {
          if(dataArrow[0].arrow?.length) {
            d3.select(`#_${idShape}`).remove()
          }
        }
        let dataShapePointsFilter = dataShapePoints.filter((data) => data.id !== idShape)
        if (dataShapePointsFilter.length !== dataShapePoints.length) {
          this.setState({
            ...this.state,
            dataShapePoints: dataShapePointsFilter,
          })
        }
      }
    }
    if (idDirect) {
      d3.select(`#_${idDirect}`).remove()
      dataShapePoints.map((data) => {
        if (data.id === idDirect) {
          data.arrowLine = []
          data.arrow = []
        }
      })
    }
  }

  onChangeDraw = () => {
    let { controlDraw, controlDrawDirect } = this.props
    let { isDrawPolygon, isArrowLine, controlRectangle } = this.state
    let { isRectangle } = controlRectangle
    if (controlDraw.status === 1 && controlDraw.shape === 'polygon') {
      if (!isDrawPolygon) {
        console.log('draw polygon')
        this.handleIsDrawPolygon()
      }
    }
    if (controlDrawDirect.status === 1 && controlDrawDirect.direct === 'yes') {
      if (!isArrowLine) {
        console.log('draw arrow')
        this.handleIsDrawArrow()
      }
    }
    if (controlDraw.status === 1 && controlDraw.shape === 'rectangle') {
      if (!isRectangle) {
        console.log('draw rectangle')
        this.handleIsDrawRectangle()
      }
    }
  }

  init = () => {
    let svgCanvas = d3
      .select('#rootCanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', 'svgContainer')
      .attr('id', 'svgContent')
      .style('border', '1px solid black')

    if (svgCanvas) {
      d3.select('#svgContent')
        .append('marker')
        .attr('id', 'arrow')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerHeight', '12')
        .attr('markerWidth', '12')
        .attr('viewBox', '0 0 12 12')
        .attr('refX', '6')
        .attr('refY', '6')
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M2, 2 L10, 6 L2, 10 L6, 6 L2, 2')
        .style('fill', '#f00')
    }

    this.setState({
      svgCanvas,
    })

    this.handleBoundsImage(svgCanvas)
  }

  imageLoadFirst = (image, heightRoot, widthRoot, svgCanvas, elm) => {
    image.onload = () => {
      let dimension = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      }

      // xử lý scale ảnh ban đầu
      let widthImg = (heightRoot * dimension.width) / dimension.height
      let heightImg = (widthRoot * dimension.height) / dimension.width

      if (widthImg >= widthRoot) {
        widthImg = widthRoot
      }
      if (heightImg >= heightRoot) {
        heightImg = heightRoot
      }

      elm.style.width = `${widthImg}px`
      elm.style.height = `${heightImg}px`

      let newDimension = {
        width: widthImg,
        height: heightImg,
      }

      let ratioImageX = dimension.width / newDimension.width
      let ratioImageY = dimension.height / newDimension.height

      let ratio = {
        x: ratioImageX,
        y: ratioImageY,
      }

      this.setState({
        ...this.state,
        ratio,
      })

      // console.log('newDimension', this.state)
      this.props.setupRatio(ratio)
      this.props.addDimension(newDimension)
      // myDiagram.fixedBounds = new go.Rect(0, 0, widthImg, heightImg)
    }
  }

  handleBoundsImage = (svgCanvas) => {
    const dimensionInitial = this.props.zonesDrew.dimension
    let elm = document.getElementById('rootCanvas')
    let widthRoot = elm.offsetWidth,
      heightRoot = elm.offsetHeight

    // let dimensionInitial = JSON.parse(localStorage.getItem('dimension'))


    let imgSrc = document
      .getElementById('rootCanvas')
      .style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2')
      .split(',')[0]

    let image = new Image()
    image.src = imgSrc

    if (_.isEmpty(dimensionInitial)) {
      console.log('load lan dau')
      this.imageLoadFirst(image, heightRoot, widthRoot, svgCanvas, elm)
    } else {
      const { tabValue, switchTab } = this.props
      console.log('load lan n.........')

      image.onload = () => {
        let dimension = {
          width: image.naturalWidth,
          height: image.naturalHeight,
        }

        let widthImg = (heightRoot * dimension.width) / dimension.height
        let heightImg = (widthRoot * dimension.height) / dimension.width

        if (widthImg >= widthRoot) {
          widthImg = widthRoot
        }
        if (heightImg >= heightRoot) {
          heightImg = heightRoot
        }

        elm.style.width = `${widthImg}px`
        elm.style.height = `${heightImg}px`

        let newDimension = {
          width: widthImg,
          height: heightImg,
        }

        this.props.addDimension(newDimension)

        let ratioImageX = dimension.width / newDimension.width
        let ratioImageY = dimension.height / newDimension.height

        let ratio = {
          x: ratioImageX,
          y: ratioImageY,
        }

        this.setState({
          ...this.state,
          ratio,
        })

        this.props.setupRatio(ratio)

        if(tabValue === 2 && switchTab === 1) {
            this.loadData(svgCanvas)
        }
      }
    }
  }

  loadData = (svgCanvas) => {
    console.log('load data')
    let { dragCircle, controlRectangle } = this.state
    let { DragC1, DragC2, DragC3, DragC4 } = controlRectangle
    const { zoneOptions, zonesDrew } = this.props

    const zoneDrew = zonesDrew.zones || []
    let newZoneDrew = []

    if (zoneDrew?.length) {
      let newZone = {}
      zoneDrew.map((zone) =>
        zoneOptions.map((zoneOp) => {
          if (zoneOp.id === zone.id) {
            let vertices = this.formatPointsDrew(zone.vertices)
            newZone = {
              ...zone,
              title: zoneOp.title,
              color: zoneOp.color,
              shape: zoneOp.shape,
              points: vertices,
            }

            if (zone.arrow?.length) {
              let arrow = this.formatPointsDrew(zone.arrow)
              newZone = {
                ...zone,
                title: zoneOp.title,
                color: zoneOp.color,
                shape: zoneOp.shape,
                points: vertices,
                arrowLine: arrow,
              }
            }
            newZoneDrew.push(newZone)
          }
        }),
      )
      this.setState({
        ...this.state,
        dataShapePoints: newZoneDrew,
      })

      console.log('zoneDrew', zoneDrew)
      this.props.finishShape(zoneDrew)
    }else {
      this.props.resetZonesDrew()
    }

    let _this = this

    dragCircle = d3.drag().on('drag', function () {
      _this.handleDragCircle(this)
    })

    DragC1 = d3.drag().on('drag', function () {
      _this.dragPoint1(this)
    })

    DragC2 = d3.drag().on('drag', function () {
      _this.dragPoint2(this)
    })

    DragC3 = d3.drag().on('drag', function () {
      _this.dragPoint3(this)
    })

    DragC4 = d3.drag().on('drag', function () {
      _this.dragPoint4(this)
    })

    if (newZoneDrew.length) {
      // console.log('newZoneDrew', newZoneDrew)
      d3.selectAll('g').remove()
      newZoneDrew.map((polygon) => {
        if (polygon.shape === 'polygon') {
          let g = svgCanvas.append('g').attr('class', 'polygon').attr('id', `__${polygon.id}`)
          g.append('polygon')
            .attr(
              'points',
              polygon.points.map((point) => [point.x, point.y]),
            )
            .attr('id', `p${polygon.id}`)
            .attr('stroke', polygon.color)
            .attr('stroke-width', 3)
            .attr('fill', 'transparent')

          polygon.points.map((point) => {
            g.append('circle')
              .attr('cx', point.x)
              .attr('cy', point.y)
              .attr('r', 4)
              .attr('fill', '#000')
              .attr('stroke', polygon.color)
              .attr('stroke-width', 3)
              .attr('cursor', 'pointer')
              .style('display', 'none')
              .call(dragCircle)
          })

          if (polygon.arrowLine?.length) {
            let gShape = svgCanvas.append('g').classed('line_arrow', true).attr('id', `_${polygon.id}`)
            gShape
              .append('line')
              .attr('x1', polygon.arrowLine[0].x)
              .attr('y1', polygon.arrowLine[0].y)
              .attr('x2', polygon.arrowLine[1].x)
              .attr('y2', polygon.arrowLine[1].y)
              .attr('id', `l${polygon.id}`)
              .attr('stroke', polygon.color)
              .attr('stroke-width', 3)
              .attr('marker-end', 'url(#arrow)')

            for (var i = 0; i < polygon.arrow.length; i++) {
              gShape
                .append('circle')
                .attr('cx', polygon.arrowLine[i].x)
                .attr('cy', polygon.arrowLine[i].y)
                .attr('r', 4)
                .attr('fill', '#000')
                .attr('stroke', polygon.color)
                .attr('stroke-width', 3)
                .attr('cursor', 'pointer')
                .style('display', 'none')
                .call(dragCircle)
            }
            gShape.call(
              d3
                .drag()
                .on('drag', function () {
                  _this.handleShapeDrag(this)
                })
                .on('end', function () {
                  _this.endHandleShapeDrag(this)
                }),
            )
          }
          g.call(
            d3
              .drag()
              .on('drag', function () {
                _this.handleShapeDrag(this)
              })
              .on('end', function () {
                _this.endHandleShapeDrag(this)
              }),
          )
        }
        if (polygon.shape === 'rectangle') {
          let g = svgCanvas.append('g').attr('class', 'rectanged').attr('id', `__${polygon.id}`)
          g.append('rect')
            .attr('x', polygon.points[2].x - polygon.points[0].x > 0 ? polygon.points[0].x : polygon.points[2].x)
            .attr('y', polygon.points[2].y - polygon.points[0].y > 0 ? polygon.points[0].y : polygon.points[2].y)
            .attr('width', Math.abs(polygon.points[2].x - polygon.points[0].x))
            .attr('height', Math.abs(polygon.points[2].y - polygon.points[0].y))
            .attr('stroke', polygon.color)
            .attr('stroke-width', 3)
            .attr('fill', 'transparent')
            .attr('id', `r${polygon.id}`)

          g.append('circle')
            .attr('cx', polygon.points[0].x)
            .attr('cy', polygon.points[0].y)
            .attr('fill', '#000')
            .attr('stroke', polygon.color)
            .attr('stroke-width', 3)
            .attr('r', 4)
            .attr('cursor', 'pointer')
            .attr('display', 'none')
            .call(DragC1)

          g.append('circle')
            .attr('cx', polygon.points[1].x)
            .attr('cy', polygon.points[1].y)
            .attr('fill', '#000')
            .attr('stroke', polygon.color)
            .attr('stroke-width', 3)
            .attr('r', 4)
            .attr('cursor', 'pointer')
            .attr('display', 'none')
            .call(DragC2)
          g.append('circle')
            .attr('cx', polygon.points[2].x)
            .attr('cy', polygon.points[2].y)
            .attr('fill', '#000')
            .attr('stroke', polygon.color)
            .attr('stroke-width', 3)
            .attr('r', 4)
            .attr('cursor', 'pointer')
            .attr('display', 'none')
            .call(DragC3)
          g.append('circle')
            .attr('cx', polygon.points[3].x)
            .attr('cy', polygon.points[3].y)
            .attr('fill', '#000')
            .attr('stroke', polygon.color)
            .attr('stroke-width', 3)
            .attr('r', 4)
            .attr('cursor', 'pointer')
            .attr('display', 'none')
            .call(DragC4)
            
          g.call(
            d3.drag().on('drag', function () {
              _this.handleShapeDrag(this)
            }),
          )
        }
      })
    }

    d3.selectAll('polygon').on('dblclick', function () {
      _this.handleDblClick(this)
    })

    d3.selectAll('line').on('dblclick', function () {
      _this.handleDblClick(this)
    })

    d3.selectAll('rect').on('dblclick', function () {
      _this.handleDblClick(this)
    })

    d3.select('body').on('keyup', function () {
      _this.handleKeyupShape()
    })
  }

  formatPointsDrew = (points) => {
    const { ratio } = this.props

    return points.map((point) => {
      return {
        x: Math.round(point.x / ratio.x),
        y: Math.round(point.y / ratio.y),
      }
    })
  }

  handleIsDrawArrow = () => {
    this.setState(
      {
        ...this.state,
        isDrawPolygon: false,
        isArrowLine: true,
        controlRectangle: {
          ...this.state.controlRectangle,
          isRectangle: false
        }
      },
      () => this.createShape(),
    )
  }

  handleIsDrawPolygon = () => {
    this.setState(
      {
        ...this.state,
        isDrawPolygon: true,
        isArrowLine: false,
        controlRectangle: {
          ...this.state.controlRectangle,
          isRectangle: false
        }
      },
      () => this.createShape(),
    )
  }

  handleIsDrawRectangle = () => {
    this.setState(
      {
        ...this.state,
        isDrawPolygon: false,
        isArrowLine: false,
        controlRectangle: {
          ...this.state.controlRectangle,
          isRectangle: true,
        },
      },
      () => this.createShape(),
    )
  }

  createShape = () => {
    let { svgCanvas, controlRectangle, dragCircle } = this.state
    let { DragC1, DragC2, DragC3, DragC4, DragRect, isRectangle } = controlRectangle
    let gContainer = svgCanvas.append('g').classed('drawPoly', true)
    let _this = this

    svgCanvas.on('mousedown', this.handleMouseDown).on('mousemove', this.handleMouseMove).on('mouseup', this.handleMouseUp).on('click', this.handleMouseDown)

    if (isRectangle) {
      svgCanvas.on('click', null)
    }

    d3.select('body').on('keyup', function () {
      _this.handleKeyupShape()
    })

    dragCircle = d3.drag().on('drag', function () {
      _this.handleDragCircle(this)
    })

    DragC1 = d3.drag().on('drag', function () {
      _this.dragPoint1(this)
    })

    DragC2 = d3.drag().on('drag', function () {
      _this.dragPoint2(this)
    })

    DragC3 = d3.drag().on('drag', function () {
      _this.dragPoint3(this)
    })

    DragC4 = d3.drag().on('drag', function () {
      _this.dragPoint4(this)
    })

    DragRect = d3.drag().on('drag', function () {
      _this.dragShapeRect(this)
    })

    this.setState({
      ...this.state,
      gContainer,
      svgCanvas,
      dragCircle,
      controlRectangle: {
        ...this.state.controlRectangle,
        DragC1,
        DragC2,
        DragC3,
        DragC4,
        DragRect,
      },
    })
  }

  handleMouseDown = () => {
    let { svgCanvas, shapePoints, gContainer, isDragging, startPoint, isDrawPolygon, isArrowLine, controlRectangle } = this.state
    let { isRectangle } = controlRectangle
    let { controlDraw } = this.props

    if (isDragging) return
    if (!isDrawPolygon && !isArrowLine && !isRectangle) return

    let innerHtmlCanvas = svgCanvas.nodes()[0]
    let plod = d3.mouse(innerHtmlCanvas)

    startPoint = {
      x: plod[0],
      y: plod[1],
    }

    shapePoints.push(plod)

    this.setState({
      ...this.state,
      isDrawing: true,
      startPoint,
      shapePoints,
    })

    if (isArrowLine) {
      gContainer
        .append('circle')
        .attr('cx', startPoint.x)
        .attr('cy', startPoint.y)
        .attr('r', 4)
        .attr('fill', 'seagreen')
        .attr('stroke', 'tomato')
        .attr('stroke-width', 3)
        .attr('start-point', true)
      // .classed("handle", true);

      if (shapePoints.length === 2) {
        this.handleCompleteShape()
      }
    }

    if (isDrawPolygon) {
      gContainer
        .append('circle')
        .attr('cx', startPoint.x)
        .attr('cy', startPoint.y)
        .attr('r', 4)
        .attr('fill', 'transparent')
        .attr('stroke', controlDraw.color)
        .attr('stroke-width', 3)
        .attr('start-point', true)
        .classed('handle', true)

      if (d3.event.target.hasAttribute('handle')) {
        this.handleCompleteShape()
      }
    }

    if (isRectangle) {
      // console.log('startPoint', shapePoints)
      gContainer
        .append('circle')
        .attr('cx', startPoint.x)
        .attr('cy', startPoint.y)
        .attr('r', 4)
        .attr('fill', 'seagreen')
        .attr('stroke', 'tomato')
        .attr('stroke-width', 3)
        .attr('start-point', true)

      if (shapePoints.length === 2) {
        this.handleCompleteShape()
      }
    }
  }

  handleMouseMove = () => {
    let { svgCanvas, gContainer, controlRectangle, isDrawing, startPoint, isDrawPolygon, isArrowLine } = this.state
    let { isRectangle } = controlRectangle
    let { controlDraw, controlDrawDirect } = this.props

    if (isDrawing) {
      let innerHtmlCanvas = svgCanvas.nodes()[0]
      let endPoint = d3.mouse(innerHtmlCanvas)
      if (isDrawPolygon || isArrowLine) {
        gContainer.select('line').remove()
        gContainer
          .append('line')
          .attr('x1', startPoint.x)
          .attr('y1', startPoint.y)
          .attr('x2', endPoint[0] + 2)
          .attr('y2', endPoint[1])
          .attr('stroke', controlDraw.color || controlDrawDirect.color)
          .attr('stroke-width', 3)
      }
      if (isRectangle) {
        gContainer.select('rect').remove()
        gContainer.selectAll('circle').remove()
        gContainer
          .append('rect')
          .attr('x', endPoint[0] - startPoint.x > 0 ? startPoint.x : endPoint[0])
          .attr('y', endPoint[1] - startPoint.y > 0 ? startPoint.y : endPoint[1])
          .attr('id', `r${controlDraw.id}`)
          .attr('width', Math.abs(endPoint[0] - startPoint.x))
          .attr('height', Math.abs(endPoint[1] - startPoint.y))
          .attr('stroke', controlDraw.color)
          .attr('stroke-width', 3)
          .attr('fill', 'transparent')
        // this.updateRectDraw(gContainer, shapePoints)
      }
    }
  }

  handleMouseUp = () => {
    let { shapePoints, gContainer, isDrawPolygon, isArrowLine } = this.state
    let { controlDraw } = this.props

    if (isDrawPolygon) {
      gContainer.select('line').remove()
      gContainer.select('polyline').remove()
      gContainer.append('polyline').attr('points', shapePoints).style('fill', 'transparent').attr('stroke', controlDraw.color).attr('stroke-width', 3)
      gContainer.selectAll('circle').remove()

      for (let i = 0; i < shapePoints.length; i++) {
        gContainer
          .append('circle')
          .attr('cx', shapePoints[i][0])
          .attr('cy', shapePoints[i][1])
          .attr('r', 4)
          .attr('stroke', controlDraw.color)
          .attr('fill', '#000')
          .attr('stroke-width', 3)
          .attr('handle', true)
          .classed('handle', true)
          .attr('cursor', 'pointer')
      }
    }

    if (isArrowLine) {
      gContainer.select('line').remove()
      gContainer.selectAll('circle').remove()

      for (let i = 0; i < shapePoints.length; i++) {
        gContainer
          .append('circle')
          .attr('cx', shapePoints[i][0])
          .attr('cy', shapePoints[i][1])
          .attr('r', 4)
          .attr('stroke', controlDraw.color)
          .attr('fill', '#000')
          .attr('stroke-width', 3)
          .attr('handle', true)
          .classed('handle', true)
          .attr('cursor', 'pointer')
      }
    }

    this.setState({
      ...this.state,
      shapePoints,
      gContainer,
    })
  }

  handleCompleteShape = () => {
    console.log('handleCompleteShape')
    let { svgCanvas, shapePoints, enterFinish, gShape, controlRectangle, dataShapePoints, dragCircle, isDrawPolygon, isArrowLine } = this.state
    let { DragC1, DragC2, DragC3, DragC4, isRectangle } = controlRectangle
    let { controlDraw, controlDrawDirect } = this.props
    let _this = this

    d3.select('g.drawPoly').remove()

    if (isDrawPolygon) {
      gShape = svgCanvas.append('g').classed('polygon', true).attr('id', `__${controlDraw.id}`)

      // if(d3.event.keyCode === 13) {
      //   console.log('asdasdasd', shapePoints)
      // }
      if(!enterFinish) {
        shapePoints.splice(shapePoints.length - 1)
      }

      //

      // console.log('shapePoints finish', shapePoints)
      
      gShape
        .append('polygon')
        .attr('points', shapePoints)
        .attr('fill', 'transparent')
        .attr('stroke', controlDraw.color)
        .attr('stroke-width', 3)
        .attr('id', `p${controlDraw.id}`)

      for (let i = 0; i < shapePoints.length; i++) {
        gShape
          .append('circle')
          .attr('cx', shapePoints[i][0])
          .attr('cy', shapePoints[i][1])
          .attr('r', 4)
          .attr('fill', "#000")
          .attr('stroke', controlDraw.color)
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('display', 'none')
          .call(dragCircle)
      }

      gShape.call(
        d3.drag().on('drag', function () {
          _this.handleShapeDrag(this)
        }).on('end', function () {
          _this.endHandleShapeDrag(this)
        })
      )
    }

    if (isArrowLine) {
      gShape = svgCanvas.append('g').classed('line_arrow', true).attr('id', `_${controlDrawDirect.id}`)
      gShape
        .append('line')
        .attr('x1', shapePoints[0][0])
        .attr('y1', shapePoints[0][1])
        .attr('x2', shapePoints[1][0])
        .attr('y2', shapePoints[1][1])
        .attr('stroke', controlDrawDirect.color)
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrow)')
        .attr('id', `l${controlDrawDirect.id}`)

      for (let i = 0; i < shapePoints.length; i++) {
        gShape
          .append('circle')
          .attr('cx', shapePoints[i][0])
          .attr('cy', shapePoints[i][1])
          .attr('r', 4)
          .attr('fill', '#000')
          .attr('stroke', controlDrawDirect.color)
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .attr('display', 'none')
          .call(dragCircle)
      }

      gShape.call(
        d3.drag().on('drag', function () {
          _this.handleShapeDrag(this)
        }).on('end', function () {
          _this.endHandleShapeDrag(this)
        })
      )
    }

    if (isRectangle) {
      // console.log('shapePoints finish', shapePoints)
      let rectShape = svgCanvas.append('g').classed('rectangled', true).attr('id', `__${controlDraw.id}`)

      rectShape
        .append('rect')
        .attr('x', shapePoints[1][0] - shapePoints[0][0] > 0 ? shapePoints[0][0] : shapePoints[1][0])
        .attr('y', shapePoints[1][1] - shapePoints[0][1] > 0 ? shapePoints[0][1] : shapePoints[1][1])
        .attr('id', `r${controlDraw.id}`)
        .attr('width', Math.abs(shapePoints[1][0] - shapePoints[0][0]))
        .attr('height', Math.abs(shapePoints[1][1] - shapePoints[0][1]))
        .attr('stroke', controlDraw.color)
        .attr('stroke-width', 3)
        .attr('fill', 'transparent')
      rectShape
        .append('circle')
        .attr('cx', shapePoints[0][0])
        .attr('cy', shapePoints[0][1])
        .attr('r', 4)
        .attr('stroke', controlDraw.color)
        .attr('fill', '#000')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr('display', 'none')
        .call(DragC1)
      rectShape
        .append('circle')
        .attr('cx', shapePoints[1][0])
        .attr('cy', shapePoints[0][1])
        .attr('r', 4)
        .attr('stroke', controlDraw.color)
        .attr('fill', '#000')
        .attr('stroke-width', 3)
        .attr('display', 'none')
        .attr('cursor', 'pointer')
        .call(DragC2)
      rectShape
        .append('circle')
        .attr('cx', shapePoints[1][0])
        .attr('cy', shapePoints[1][1])
        .attr('r', 4)
        .attr('stroke', controlDraw.color)
        .attr('fill', '#000')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr('display', 'none')
        .call(DragC3)
      rectShape
        .append('circle')
        .attr('cx', shapePoints[0][0])
        .attr('cy', shapePoints[1][1])
        .attr('r', 4)
        .attr('stroke', controlDraw.color)
        .attr('fill', '#000')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr('display', 'none')
        .call(DragC4)

        rectShape.call(
          d3.drag().on("drag", function () {
            _this.handleShapeDrag(this)
          }) )
    }

    d3.selectAll('polygon').on('dblclick', function () {
      _this.handleDblClick(this)
    })

    d3.selectAll('line').on('dblclick', function () {
      _this.handleDblClick(this)
    })

    d3.selectAll('rect').on('dblclick', function () {
      _this.handleDblClick(this)
    })

    let result = this.formatPoints(shapePoints)
    let resultExact = this.verticesExact(shapePoints)

    let nodeShape
    // let dataLocalStorage = JSON.parse(localStorage.getItem('dataShape')) || []
    let objArrow
    if ((shapePoints.length === 2 && controlDraw.shape === 'polygon' && controlDrawDirect.direct === 'yes') || (shapePoints.length === 2 && controlDrawDirect.shape === 'polygon' && controlDrawDirect.direct === 'yes') ) {
      let id = controlDrawDirect.id
      objArrow = {
        arrowLine: result,
        arrow: resultExact,
        id,
      }

    }

    if (shapePoints.length === 2 && controlDraw.shape === 'rectangle') {
      let newShapePoints = [
        [shapePoints[0][0], shapePoints[0][1]],
        [shapePoints[1][0], shapePoints[0][1]],
        [shapePoints[1][0], shapePoints[1][1]],
        [shapePoints[0][0], shapePoints[1][1]],
      ]
      let vertices = this.verticesExact(newShapePoints)
      nodeShape = {
        vertices: vertices,
        id: controlDraw.id,
        type: controlDraw.type,
        title: controlDraw.title,
        color: controlDraw.color,
      }
    }

    if (shapePoints.length > 2 && controlDraw.shape === 'polygon') {
      nodeShape = {
        points: result,
        vertices: resultExact,
        id: controlDraw.id,
        type: controlDraw.type,
        title: controlDraw.title,
        color: controlDraw.color,
      }
    }

    if (objArrow) {
      console.log('objArrow', objArrow)
      console.log('finishShape', dataShapePoints)

      dataShapePoints.map((data) => {
        if (data.id === objArrow.id) {
          data.arrowLine = objArrow.arrowLine
          data.arrow = objArrow.arrow
        }
      })
    }

    if (nodeShape) {
      dataShapePoints.push(nodeShape)
    }

    // console.log('finishShape', dataShapePoints)
    this.props.finishShape(dataShapePoints)

    this.setState({
      ...this.state,
      gShape,
      dataShapePoints,
      shapePoints: [],
      //   isDragging: true,
      isDrawing: false,
      isDrawPolygon: false,
      isArrowLine: false,
      controlRectangle: {
        ...this.state.controlRectangle,
        isRectangle: false,
      },
    })
  }

  updateRectDraw = (gContainer, shapePoints) => {
    let { controlDraw } = this.props
    gContainer.select('rect').remove()
    gContainer.selectAll('circle').remove()
    gContainer
      .append('rect')
      .attr('x', shapePoints[1][0] - shapePoints[0][0] > 0 ? shapePoints[0][0] : shapePoints[1][0])
      .attr('y', shapePoints[1][1] - shapePoints[0][1] > 0 ? shapePoints[0][1] : shapePoints[1][1])
      .attr('id', `r${controlDraw.id}`)
      .attr('width', Math.abs(shapePoints[1][0] - shapePoints[0][0]))
      .attr('height', Math.abs(shapePoints[1][1] - shapePoints[0][1]))
      .attr('stroke', 'red')
      .attr('stroke-width', 3)
  }

  formatPoints = (shapePoints) => {
    let result = shapePoints.map((point) => {
      return {
        x: Number(point[0]),
        y: Number(point[1]),
      }
    })

    return result
  }

  verticesExact = (shapePoints) => {
    let { x, y } = this.state.ratio
    let result = shapePoints.map((point) => {
      return {
        x: Math.round(Number(point[0]) * x),
        y: Math.round(Number(point[1]) * y),
      }
    })

    return result
  }

  handleDblClick = (_this) => {
    let { shapeSelected, isDrawing } = this.state

    shapeSelected = d3.select(_this.parentNode)
    this.setState({
      ...this.state,
      shapeSelected,
    })

    this.handleShapeSelected(d3.select(_this), shapeSelected)

  }

  handleShapeDrag = (_this) => {
    let { shapeSelected, dataShapePoints } = this.state
    // let { controlDraw } = this.props
    shapeSelected = d3.select(_this)
    let id = d3.select(shapeSelected.nodes()[0]).attr('id')
    id = id.replace(/__|_/gi, '')
    let circles = shapeSelected.selectAll('circle')

    let shape
    if (d3.select(_this).select('polygon').nodes().length) {
      shape = d3.select(_this).select('polygon')

      dataShapePoints.map((data) => {
        if (data.id === Number(id)) {
          let pointsUpdate = this.updatePoints(data.points, d3.event)
          shape.attr('points', pointsUpdate)
          for (let i = 0; i < pointsUpdate.length; i++) {
            d3.select(circles._groups[0][i]).attr('cx', pointsUpdate[i][0]).attr('cy', pointsUpdate[i][1])
          }
        }
      })
    }

    if (d3.select(_this).select('line').nodes().length) {
      shape = d3.select(_this).select('line')
      dataShapePoints.map((data) => {
        if (data.id === Number(id)) {
          let arrowPoint = this.updatePoints(data.arrowLine, d3.event)
          shape.attr('x1', arrowPoint[0][0]).attr('y1', arrowPoint[0][1]).attr('x2', arrowPoint[1][0]).attr('y2', arrowPoint[1][1])
          for (let i = 0; i < arrowPoint.length; i++) {
            d3.select(circles._groups[0][i]).attr('cx', arrowPoint[i][0]).attr('cy', arrowPoint[i][1])
          }
        }
      })
    }

    if (d3.select(_this).select('rect').nodes().length) {
      shape = d3.select(_this).select('rect')
      let circles = d3.select(_this).selectAll('circle')

      if (shape.nodes().length) {
        let pointCX = d3.event.dx
        let pointCY = d3.event.dy
        let startPoint = {
          x: Number(d3.select(shape.nodes()[0]).attr('x')),
          y: Number(d3.select(shape.nodes()[0]).attr('y')),
        }
        let endPoint = {
          x: Number(d3.select(circles._groups[0][2]).attr('cx')),
          y: Number(d3.select(circles._groups[0][3]).attr('cy')),
        }
        let points = [startPoint, endPoint]

        for (var i = 0; i < points.length; i++) {
          shape.attr('x', (points[i].x += pointCX)).attr('y', (points[i].y += pointCY))
        }
        this.updateRectDrag(shape, points, circles)
      }
    }

    this.setState({
      ...this.state,
      shapeSelected,
    })

    this.handleShapeSelected(shape, shapeSelected)
  }

  endHandleShapeDrag = (_this) => {
    let { dataShapePoints } = this.state

    let line = d3.select(_this).select('line')
    let polygon = d3.select(_this).select('polygon')

    if (polygon.nodes().length) {
      let shape = polygon.nodes()[0]
      let newArr = d3.select(shape).attr('points').split(',')
      newArr = newArr.map((item) => Number(item))
      let pointsShapeSelected = this.handleChunkArray(newArr, 2)
      let resultVertices = this.verticesExact(pointsShapeSelected)

      let id = polygon.attr('id')
      id = id.replace(/p|_/gi, '')

      dataShapePoints.map((data) => {
        if (data.id === Number(id)) {
          data.vertices = resultVertices
        }
      })

      this.props.finishShape(dataShapePoints)
    }


    if (line.nodes().length) {
      let x1 = line.attr('x1')
      let y1 = line.attr('y1')
      let x2 = line.attr('x2')
      let y2 = line.attr('y2')
      let points = [
        [Number(x1), Number(y1)],
        [Number(x2), Number(y2)],
      ]

      console.log('line drag', points)
      let resultVertices = this.verticesExact(points)
      let idArrow = line.attr('id')
      idArrow = idArrow.replace(/l|_/gi, '')

      dataShapePoints.map((data) => {
        if (data.id === Number(idArrow)) {
          data.arrow = resultVertices
        }
      })

      this.props.finishShape(dataShapePoints)
    }
  }

  verticesExactLoad = (dataPoints) => {
    let { x, y } = this.state.ratio
    let result = dataPoints.map((data) => {
      return {
        x: Math.round(Number(data.x) * x),
        y: Math.round(Number(data.y) * y),
      }
    })
    return result
  }

  updatePoints = (points, e) => {
    return points.map((data) => [(data.x += e.dx), (data.y += e.dy)])
  }

  handleShapeSelected = (shape, shapeOrder) => {
    // let { dataShapePoints } = this.state
    let { controlDraw, controlDrawDirect } = this.props
    if (controlDraw.status === 1 || (controlDrawDirect.status && controlDrawDirect.status === 1)) return
    d3.selectAll('polygon').style('stroke-width', 3)
    d3.selectAll('line').style('stroke-width', 3)
    d3.selectAll('rect').style('stroke-width', 3)
    d3.selectAll('circle').style('display', 'none')

    if (shape) {
      shape.style('cursor', 'pointer').style('stroke-width', 5)
      shapeOrder.selectAll('circle').style('display', 'block')
      shapeOrder.raise()
    }
    
    if (shapeOrder) {
      let g = shapeOrder.nodes()[0]
      let id = d3.select(g).attr('id')
      this.props.shapeSelected(id)
    }
  }

  handleDragCircle = (_this) => {
    let { isDrawing, isDrawPolygon, dataShapePoints } = this.state

    if (isDrawing || isDrawPolygon) return

    let alteredPoints = []
    let selectedP = d3.select(_this)

    let circles = d3.select(_this.parentNode).selectAll('circle')
    let polygon = d3.select(_this.parentNode).select('polygon')
    let lineArrow = d3.select(_this.parentNode).select('line')
    if (polygon.nodes().length) {
      // chunk point string => []
      let shape = polygon.nodes()[0]
      let newArr = d3.select(shape).attr('points').split(',')
      newArr = newArr.map((item) => Number(item))
      let pointsShapeSelected = this.handleChunkArray(newArr, 2)

      let pointCX = d3.event.x
      let pointCY = d3.event.y

      selectedP.attr('cx', pointCX).attr('cy', pointCY)

      for (let i = 0; i < pointsShapeSelected.length; i++) {
        let circleCoord = d3.select(circles._groups[0][i])
        let pointCoord = [circleCoord.attr('cx'), circleCoord.attr('cy')]
        alteredPoints[i] = pointCoord
      }

      polygon.attr('points', alteredPoints)
      let idPolygon = d3.select(shape).attr('id')
      idPolygon = idPolygon.replace(/p|_/gi, '')

      let result = this.formatPoints(alteredPoints)
      let resultVertices = this.verticesExact(alteredPoints)

      dataShapePoints.map((data) => {
        if (data.id === Number(idPolygon)) {
          data.points = result
          data.vertices = resultVertices
        }
      })

      this.props.finishShape(dataShapePoints)
    }

    if (lineArrow.nodes().length) {
      let line = lineArrow.nodes()[0]

      let arrayLine = [d3.select(line).attr('x1'), d3.select(line).attr('y1'), d3.select(line).attr('x2'), d3.select(line).attr('y2')]
      arrayLine = arrayLine.map((item) => Number(item))

      let pointsShapeSelected = this.handleChunkArray(arrayLine, 2)
      let pointCX = d3.event.x
      let pointCY = d3.event.y
      selectedP.attr('cx', pointCX).attr('cy', pointCY)

      for (let i = 0; i < pointsShapeSelected.length; i++) {
        let circleCoord = d3.select(circles._groups[0][i])
        let pointCoord = [circleCoord.attr('cx'), circleCoord.attr('cy')]
        alteredPoints[i] = pointCoord
      }
      lineArrow.attr('x1', alteredPoints[0][0]).attr('y1', alteredPoints[0][1]).attr('x2', alteredPoints[1][0]).attr('y2', alteredPoints[1][1])

      let idArrow = d3.select(line).attr('id')
      idArrow = idArrow.replace(/l|_/gi, '')
      let result = this.formatPoints(alteredPoints)
      let resultArrow = this.verticesExact(alteredPoints)

      dataShapePoints.map((data) => {
        if (data.id === Number(idArrow)) {
          data.arrowLine = result
          data.arrow = resultArrow
        }
      })

      this.props.finishShape(dataShapePoints)
    }
  }

  handleKeyupShape = () => {
    let { shapeSelected, dataShapePoints } = this.state

    // if (d3.event.keyCode === 46 || d3.event.keyCode === 8) {
    //   if (shapeSelected) {
    //     let id = d3.select(shapeSelected.nodes()[0]).attr('id')
    //     id = id.replace(/__|_/gi, '')
    //     let dataShapePointsFilter = dataShapePoints.filter((data) => data.id !== Number(id))
    //     this.setState({
    //       ...this.state,
    //       dataShapePoints: dataShapePointsFilter,
    //     })

    //     this.props.removeShape(Number(id))
    //     shapeSelected.remove()
    //   }
    // }

    if (d3.event.keyCode === 27) {
      let { controlDraw } = this.props
      let { shapePoints, isDrawing } = this.state
      if(controlDraw.status === 1) {
        if(isDrawing) {
        
          this.setState({
            ...this.state,
            shapePoints: [],
            isArrowLine: false,
            isDragging: false,
            isDrawPolygon: false,
            isDrawing: false,
            controlRectangle: {
              ...this.state.controlRectangle,
              isRectangle: false
            }
          }, function() { d3.select('g.drawPoly').remove() });
          this.props.cancelDraw()
        }
       
      }
      if (shapeSelected) {
        this.handleShapeSelected(null, null)
        this.setState({
          ...this.state,
          shapeSelected: null,
        })

        this.props.shapeSelected(null)
      }
    }

    if(d3.event.keyCode === 13) {
      let { shapePoints } = this.state
      if(shapePoints.length > 3) {

        this.setState({
          ...this.state,
          enterFinish: true
        });
        this.handleCompleteShape()
      }
    }
  }

  handleChunkArray = (arr, size) => {
    let result = []

    Array.from({ length: Math.round(arr.length / size) }, (v, i) => {
      result.push(arr.slice(i * size, i * size + size))
    })
    return result
  }

  dragPoint = (_this, numberX, numberY) => {
    let selectedP = d3.select(_this)
    let rect = d3.select(_this.parentNode).select('rect')
    let circles = d3.select(_this.parentNode).selectAll('circle')

    if (rect.nodes().length) {
      let pointCX = d3.event.dx
      let pointCY = d3.event.dy
      let startPoint = {
        x: Number(d3.select(rect.nodes()[0]).attr('x')),
        y: Number(d3.select(rect.nodes()[0]).attr('y')),
      }
      let endPoint = {
        x: Number(d3.select(circles._groups[0][2]).attr('cx')),
        y: Number(d3.select(circles._groups[0][3]).attr('cy')),
      }
      let points = [startPoint, endPoint]

      selectedP.attr('cx', (points[numberX].x += pointCX)).attr('cy', (points[numberY].y += pointCY))
      this.updateRectDrag(rect, points, circles)
    }
  }

  dragPoint1 = (_this) => {
    this.dragPoint(_this, 0, 0)
  }

  dragPoint2 = (_this) => {
    this.dragPoint(_this, 1, 0)
  }

  dragPoint3 = (_this) => {
    this.dragPoint(_this, 1, 1)
  }

  dragPoint4 = (_this) => {
    this.dragPoint(_this, 0, 1)
  }

  updateRectDrag = (rect, points, circles) => {
    let { dataShapePoints } = this.state
    rect
      .attr('x', points[1].x - points[0].x > 0 ? points[0].x : points[1].x)
      .attr('y', points[1].y - points[0].y > 0 ? points[0].y : points[1].y)
      .attr('width', Math.abs(points[1].x - points[0].x))
      .attr('height', Math.abs(points[1].y - points[0].y))

    let point1 = d3.select(circles._groups[0][0])
    let point2 = d3.select(circles._groups[0][1])
    let point3 = d3.select(circles._groups[0][2])
    let point4 = d3.select(circles._groups[0][3])

    point1.attr('r', 5).attr('cx', points[0].x).attr('cy', points[0].y)
    point2.attr('r', 5).attr('cx', points[1].x).attr('cy', points[0].y)
    point3.attr('r', 5).attr('cx', points[1].x).attr('cy', points[1].y)
    point4.attr('r', 5).attr('cx', points[0].x).attr('cy', points[1].y)

    let id = rect.attr('id')
    id = id.replace(/r|_/gi, '')

    let newShapePoints = [
      [points[0].x, points[0].y],
      [points[1].x, points[0].y],
      [points[1].x, points[1].y],
      [points[0].x, points[1].y],
    ]
    let resultExact = this.verticesExact(newShapePoints)

    dataShapePoints.map((data) => {
      if (data.id === Number(id)) {
        data.vertices = resultExact
      }
    })

    this.props.finishShape(dataShapePoints)
  }

  render() {
    const { classes, snapshot_image_url, snapshot_image_url_edit } = this.props

    return (
      <div className={classes.root}>
        <div id="rootCanvas" className={classes.rootCanvas} style={{ backgroundImage: `url(http://103.101.76.162${snapshot_image_url ? snapshot_image_url : snapshot_image_url_edit})` }}></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    controlDraw: state.drawZones.controlDraw,
    typeDraw: state.drawZones.typeDraw,
    controlDrawDirect: state.drawZones.controlDrawDirect,
    idDirect: state.drawZones.idDirect,
    idShape: state.drawZones.idShape,
    zoneOptions: state.drawZones.zoneOptions,
    ratio: state.drawZones.ratio,
    zonesDrew: state.cameras.editCam.functions,
    tabValue: state.cameras.currentCam.tabValue,
    switchTab: state.manageCam.tabValue,
    snapshot_image_url: state.cameras.addCamera.snapshot_image_url,
    snapshot_image_url_edit: state.cameras.editCam.functions.snapshot_image_url,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    finishShape: (dataShape) => {
      dispatch(finishShape(dataShape))
    },
    addDimension: (dimension) => {
      dispatch(addDimension(dimension))
    },
    removeShape: (id) => {
      dispatch(removeShape(id))
    },
    shapeSelected: (id) => {
      dispatch(shapeSelected(id))
    },
    setupRatio: (ratio) => {
      dispatch(setupRatio(ratio))
    },
    cancelDraw: () => {
      dispatch(cancelDraw())
    },
    resetZonesDrew: () => {
      dispatch(resetZonesDrew())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShapeD3))
