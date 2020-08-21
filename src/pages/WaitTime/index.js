import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Loading from 'components/Loading'
import Filter from './Filter'
import WaitingPeriodChart from './WaitingPeriodChart'
import { filterWaitTimeChartData } from 'actions/action_wait_time'
import { Typography, IconButton } from '@material-ui/core'
import { KeyboardArrowLeft as LeftIcon, KeyboardArrowRight as RightIcon } from '@material-ui/icons'
import WaitTimeVehicleChart from './wait_time_vehicle_chart'
import WaitTimeTotalChart from './wait_time_total_chart'
import WaitTimeAvgChart from './wait_time_avg_chart'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  filter: {
    // flexGrow: 1,
    // flexShrink: 1
  },
  chart: {
    height: 'calc(100% - 50px)',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    height: '33%',
  },
  output: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '33.333%',
  },
  content: {
    display: 'flex',
    height: '100%',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
  center: {
    flexGrow: 1,
  },
  title: {
    height: 40,
  },
})

class WaitTime extends Component {
  componentDidMount() {
    this.props.filterWaitTimeChartData({
      time: new Date().toString(),
      filter: 'after',
    })
  }

  handleLeftClick = () => {
    const {wait } = this.props
    const length = wait.length
    if(length && wait[0].time !== undefined){
      this.props.filterWaitTimeChartData({
        time: new Date(wait[0].time).toString(),
        filter: 'before'
      })
    }
  }

  handleRightClick = () => {
    const {wait } = this.props
    const length = wait.length
    if(length && wait[0].time !== undefined){
      this.props.filterWaitTimeChartData({
        time: new Date(wait[0].time).toString(),
        filter: 'after'
      })
    }
  }

  render() {
    const { classes, isFetchingChartData } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.filter}>
          <Filter />
        </div>
        <div className={classes.chart}>
          <div className={classes.content}>
            <div className={classes.left}>
              <IconButton onClick={this.handleLeftClick}>
                <LeftIcon />
              </IconButton>
            </div>
            <div className={classes.center}>
              <div className={classes.output}>
                <WaitTimeVehicleChart />
                <Typography align="center">Biểu đồ tổng số xe (xe)</Typography>
              </div>
              <div className={classes.output}>
                <WaitTimeTotalChart />
                <Typography align="center">Biểu đồ tổng thời gian chờ (giây)</Typography>
              </div>
              <div className={classes.output}>
                <WaitTimeAvgChart />
                <Typography align="center">Biểu đồ thời gian chờ trung bình (giây)</Typography>
              </div>
            </div>
            <div className={classes.right}>
              <IconButton onClick={this.handleRightClick}>
                <RightIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ waitTime }) => {
  return {
    wait: waitTime.data.wait
  }
}
export default connect(mapStateToProps, { filterWaitTimeChartData })(withStyles(styles)(WaitTime))
