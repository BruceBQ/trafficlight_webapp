import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { red, green, yellow, indigo } from '@material-ui/core/colors'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import WithSize from './WithSize'
import Axis from './Axis'
import Tooltip from './wait_time_vehicle_chart_tooltip'

const MARGINS = { top: 10, right: 10, bottom: 20, left: 50 }

const styles = (theme) => ({
  root: {
    position: 'relative',
  },
})

class WaitTimeVehicleChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredBar: null,
      scaleX0: d3.scaleBand(),
      scaleX1: d3.scaleBand(),
      scaleY: d3.scaleBand(),
      color: d3.scaleOrdinal().range([indigo[700], indigo[200]]).domain(['red', 'yellow']),
    }
  }

  componentDidMount() {
    const scaleX0 = this.createScaleX0()
    const scaleX1 = this.createScaleX1(scaleX0)
    const scaleY = this.createScaleY()
    this.setState({
      scaleX0,
      scaleX1,
      scaleY,
    })
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height ||
      JSON.stringify(prevProps.vehicles) !== JSON.stringify(this.props.vehicles)
    ) {
      const scaleX0 = this.createScaleX0()
      const scaleX1 = this.createScaleX1(scaleX0)
      const scaleY = this.createScaleY()
      this.setState({
        scaleX0,
        scaleX1,
        scaleY,
      })
    }
  }

  createScaleX0 = () => {
    const width = this.props.width - MARGINS.left - MARGINS.right
    const { vehicles } = this.props
    return d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner([0.1])
      .domain(
        vehicles.map((d) => {
          return new Date(d.time)
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
    const { vehicles } = this.props

    return d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(vehicles, (d) => {
          return d3.max(keys, (key) => {
            return d[key]['total']
          })
        }),
      ])
  }

  handleMouseOver = (event, data) => {
    this.setState({
      hoveredBar: data,
    })
  }

  handleMouseOut = (event, data) => {
    this.setState({
      hoveredBar: null,
    })
  }

  renderBarStatck = () => {
    const height = this.props.height - MARGINS.top - MARGINS.bottom
    const { scaleX0, scaleX1, scaleY, color } = this.state
    const keys = ['Hà Huy Tập', 'Huỳnh Ngọc Huệ']
    const { vehicles } = this.props
    let groupData = []
    vehicles.map((vehicle) => {
      let rollup = {}
      keys.map((key) => {
        rollup = { time: vehicle.time }
        rollup.phase = key
        rollup.wait = vehicle[key]['wait']
        rollup.remain = vehicle[key]['total'] - vehicle[key]['wait']
        groupData.push(rollup)
      })
    })

    const stackData = d3.stack().keys(['remain', 'wait'])(groupData)
    return stackData.map((stack, index1) => {
      return (
        <g key={index1} className="serie" fill={color(stack.key)}>
          {stack.map((d, index2) => {
            return (
              <rect
                key={index2}
                transform={`translate(${scaleX0(new Date(d.data.time)) || 0}, 0)`}
                x={scaleX1(d.data.phase)}
                y={scaleY(d[1]) > 0 ? scaleY(d[1]) : 0}
                width={scaleX1.bandwidth()}
                height={scaleY(d[0]) - scaleY(d[1]) > 0 ? scaleY(d[0]) - scaleY(d[1]) : 0}
                onMouseOver={(event) => this.handleMouseOver(event, d.data)}
                onMouseOut={(event) => this.handleMouseOut(event, d.data)}
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

    const open = Boolean(this.state.hoveredBar)

    return (
      <div className={classes.root}>
        <svg width={this.props.width} height={this.props.height}>
          <g className="focus" transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
            <Axis scaleX0={scaleX0} scaleX1={scaleX1} scaleY={scaleY} width={width} height={height} />
            {this.renderBarStatck()}
          </g>
        </svg>
        {open && <Tooltip data={this.state.hoveredBar} scaleX0={scaleX0} scaleX1={scaleX1} scaleY={scaleY} height={height} width={width} />}
      </div>
    )
  }
}

const mapStateToProps = ({ waitTime }) => {
  return {
    vehicles: waitTime.data.wait,
  }
}

export default connect(mapStateToProps)(WithSize(withStyles(styles)(WaitTimeVehicleChart)))
