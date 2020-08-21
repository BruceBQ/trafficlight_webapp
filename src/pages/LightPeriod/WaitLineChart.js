import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import * as d3 from 'd3'
import './chart.scss'
import WithSize from './WithSize'
import Axis from './Axis'
import WaitlineTooltip from './waitline_tooltip'

function getOffset(el) {
  const html = el.current
  let box = { top: 0, left: 0 }
  if (typeof html.getBoundingClientRect !== 'undefined') {
    box = html.getBoundingClientRect()
  }

  return {
    top: box.top + window.pageYOffset - html.clientTop,
    left: box.left + window.pageXOffset - html.clientLeft,
  }
}

function calculateChartCoordinate(event, offset) {
  return {
    chartX: Math.round(event.pageX - offset.left),
    chartY: Math.round(event.pageY - offset.top),
  }
}
const styles = (theme) => ({
  root: {
    position: 'relative',
  },
})

const MARGINS = { top: 10, right: 30, bottom: 20, left: 30 }

class WaitLineChart extends Component {
  constructor(props) {
    super(props)
    this.focus = React.createRef()
    this.svg = React.createRef()
    this.container = React.createRef()
    this.state = {
      scaleX0: d3.scaleBand(),
      scaleX1: d3.scaleBand(),
      scaleY: d3.scaleLinear(),
      color: d3.scaleOrdinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']),
      isTooltipActive: false,
      xBandSize: 0,
      tooltipTicks: [],
      tooltipData: {},
    }
  }

  componentDidMount() {
    const scaleX0 = this.createScaleX0()
    const scaleX1 = this.createScaleX1(scaleX0)
    const scaleY = this.createScaleY()
    this.setState(
      {
        // the scale spacing the groups
        scaleX0,
        // the scale for spacing each group's bar
        scaleX1,
        scaleY,
      },
      () => this.tooltipTicksGenerator(),
    )
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height ||
      JSON.stringify(prevProps.waitlines) !== JSON.stringify(this.props.waitlines)
    ) {
      const scaleX0 = this.createScaleX0()
      const scaleX1 = this.createScaleX1(scaleX0)
      const scaleY = this.createScaleY()
      this.setState(
        {
          scaleX0,
          scaleX1,
          scaleY,
        },
        () => this.tooltipTicksGenerator(),
      )
    }
  }

  createScaleX0() {
    // create scale X
    const width = this.props.width - MARGINS.left - MARGINS.right
    const data = this.props.waitlines
    return d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1)
      .domain(
        data.map(function (d) {
          // console.log(moment(new Date(d.time)).format('DD-MM-YYYY HH:mm'))
          return new Date(d.time)
        }),
      )
  }

  createScaleX1(scaleX0) {
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    return d3.scaleBand().padding(0.05).domain(keys).rangeRound([0, scaleX0.bandwidth()])
  }

  createScaleY() {
    const height = this.props.height - MARGINS.top - MARGINS.bottom
    const data = this.props.waitlines
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    return d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(data, (d) => {
          return d3.max(keys, (key) => {
            return d[key]['value']
          })
        }),
      ])
  }

  parseEventsOfWrapper = () => {
    let tooltipEvents = {
      onMouseEnter: this.handleMouseEnter,
      onMouseMove: this.handleMouseMove,
      onMouseLeave: this.handleMouseLeave,
      onClick: this.handleClick,
    }

    return tooltipEvents
  }

  getMouseInfo = (e) => {}

  tooltipTicksGenerator = () => {
    const { scaleX0, scaleX1, scaleY } = this.state
    this.setState({ xBandSize: scaleX1.bandwidth() })
    const { waitlines } = this.props
    let tooltipTicks = []
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    waitlines.map((waitline) => {
      keys.map((key) => {
        tooltipTicks.push({
          name: key,
          image: waitline[key]['image'],
          value: waitline[key]['value'],
          time: waitline.time,
          coordinate: scaleX0(new Date(waitline.time)) + MARGINS.left + scaleX1(key),
        })
      })
    })

    this.setState({ tooltipTicks })
  }

  handleClick = (e) => {
    e.persist()
    // console.log(e)
  }

  handleMouseEnter = (e) => {
    e.persist()
  }

  handleMouseLeave = () => {
    const nextState = { isTooltipActive: false }
    this.setState(nextState)
  }

  handleMouseOver = (event, data) => {
    this.setState({
      hoveredBar: data,
    })
  }

  handleMouseMove = (e) => {
    e.persist()
    const containerOffset = getOffset(this.container)
    const event = calculateChartCoordinate(e, containerOffset)
    const { tooltipTicks, xBandSize } = this.state
    const result = _.find(tooltipTicks, (item) => {
      return event.chartX >= item.coordinate && event.chartX <= item.coordinate + xBandSize
    })
    if (result === undefined) {
      this.setState({ isTooltipActive: false, tooltipData: {} })
    } else {
      this.setState({ isTooltipActive: true, tooltipData: result })
    }
  }

  handleMouseOut = (event) => {
    this.setState({
      hoveredBar: null,
    })
  }

  renderGroups() {
    const height = this.props.height - MARGINS.top - MARGINS.bottom
    const { waitlines } = this.props
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    const { scaleX0, scaleX1, scaleY, color } = this.state
    return waitlines.map((waitline, index1) => {
      const rectangles = keys.map((key) => ({
        key,
        value: waitline[key]['value'],
        image: waitline[key]['image'],
        time: waitline.time,
      }))

      return (
        <g key={index1} className="bar" transform={`translate(${scaleX0(new Date(waitline.time)) || 0}, 0)`}>
          {rectangles.map((rectangle, index2) => {
            // console.log(rectangle.value, scaleY(rectangle.value), height)
            return (
              <rect
                key={index2}
                x={scaleX1(rectangle.key) || 0}
                y={scaleY(rectangle.value) || 0}
                width={scaleX1.bandwidth() || 0}
                height={height - scaleY(rectangle.value) > 0 ? height - scaleY(rectangle.value) : 0}
                fill={color(rectangle.key)}
                // onMouseOver={(event) => this.handleMouseOver(event, rectangle)}
                // onMouseMove={(event) => this.handleMouseMove(event, rectangle)}
                // onMouseOut={(event) => this.handleMouseOut(event, rectangle)}
              />
            )
          })}
        </g>
      )
    })
  }

  render() {
    const { classes } = this.props
    const { scaleX0, scaleX1, scaleY } = this.state
    const width = this.props.width - MARGINS.left - MARGINS.right
    const height = this.props.height - MARGINS.top - MARGINS.bottom

    const openTooltip = Boolean(this.state.isTooltipActive)

    const events = this.parseEventsOfWrapper()
    return (
      <div className={classes.root} {...events} ref={this.container}>
        <svg ref={this.svg} width={this.props.width} height={this.props.height}>
          <g ref={this.focus} className="focus" transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
            <Axis scaleX0={scaleX0} scaleX1={scaleX1} scaleY={scaleY} width={width} height={height} />
            <g>{this.renderGroups()}</g>
          </g>
        </svg>
        {openTooltip && <WaitlineTooltip data={this.state.tooltipData} scaleX0={scaleX0} scaleX1={scaleX1} scaleY={scaleY} height={height} width={width} />}
      </div>
    )
  }
}
const mapStateToProps = ({ lightPeriod }) => {
  return {
    waitlines: lightPeriod.data.waitlines,
  }
}

export default connect(mapStateToProps)(WithSize(withStyles(styles)(WaitLineChart)))
