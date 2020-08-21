import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import WithSize from './WithSize'
import Axis from './Axis'

const MARGINS = { top: 10, right: 10, bottom: 20, left: 50 }

const styles = (theme) => ({})

class WaitTimeTotalChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleX0: d3.scaleBand(),
      scaleX1: d3.scaleBand(),
      scaleY: d3.scaleBand(),
      color: d3.scaleOrdinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']),
    }
  }

  componentDidMount() {
    this.createAxis()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height ||
      JSON.stringify(prevProps.waitTotal) !== JSON.stringify(this.props.waitTotal)
    ) {
      this.createAxis()
    }
  }

  createAxis = () => {
    const scaleX0 = this.createScaleX0()
    const scaleX1 = this.createScaleX1(scaleX0)
    const scaleY = this.createScaleY()
    this.setState({ scaleX0, scaleX1, scaleY })
  }

  createScaleX0 = () => {
    const width = this.props.width - MARGINS.left - MARGINS.right
    const { waitTotal } = this.props
    return d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1)
      .domain(
        waitTotal.map((data) => {
          return new Date(data.time)
        }),
      )
  }

  createScaleX1 = (scaleX0) => {
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    return d3.scaleBand().padding(0.05).domain(keys).rangeRound([0, scaleX0.bandwidth()])
  }

  createScaleY = () => {
    const height = this.props.height - MARGINS.top - MARGINS.bottom
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    const { waitTotal } = this.props
    return d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(waitTotal, (d) => {
          return d3.max(keys, (key) => {
            return d[key]
          })
        }),
      ])
  }

  renderGroups = () => {
    const height = this.props.height - MARGINS.top - MARGINS.bottom
    const { waitTotal } = this.props
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    const { scaleX0, scaleX1, scaleY, color } = this.state

    return waitTotal.map((total, index1) => {
      const rectangles = keys.map((key) => ({ key, value: total[key] }))
      return (
        <g key={index1} className="bar" transform={`translate(${scaleX0(new Date(total.time)) || 0},0)`}>
          {rectangles.map((rectangle, index2) => {
            return (
              <rect
                key={index2}
                x={scaleX1(rectangle.key) || 0}
                y={scaleY(rectangle.value) || 0}
                width={scaleX1.bandwidth() || 0}
                height={height - scaleY(rectangle.value) > 0 ? height - scaleY(rectangle.value) : 0}
                fill={color(rectangle.key)}
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

    return (
      <div className={classes.root}>
        <svg width={this.props.width} height={this.props.height}>
          <g className="focus" transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
            <Axis scaleX0={scaleX0} scaleX1={scaleX1} scaleY={scaleY} width={width} height={height} />
            <g>{this.renderGroups()}</g>
          </g>
        </svg>
      </div>
    )
  }
}

const mapStateToProps = ({ waitTime }) => {
  return {
    waitTotal: waitTime.data.waittime,
  }
}

export default connect(mapStateToProps)(WithSize(withStyles(styles)(WaitTimeTotalChart)))
