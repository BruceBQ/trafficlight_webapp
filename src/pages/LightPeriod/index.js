import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography, IconButton } from '@material-ui/core'
import { KeyboardArrowLeft as LeftIcon, KeyboardArrowRight as RightIcon } from '@material-ui/icons'
import Loading from 'components/Loading'
import Filter from './Filter'
import FlowChart from './FlowChart'
import WaitLineChart from './WaitLineChart'
import LightPeriodChart from './LightPeriodChart'
import { filterLightPeriodChartData } from 'actions/action_lightPeriodChart'

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
    height: 'calc(100% - 60px)',
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
})

class LightPeriod extends Component {
  componentDidMount() {
    this.props.filterLightPeriodChartData({
      time: new Date().toString(),
      filter: 'after',
    })
  }

  handleLeftClick = () => {
    const { flows = [] } = this.props
    const length = flows.length
    if (length && flows[0].time !== undefined) {
      this.props.filterLightPeriodChartData({
        time: new Date(flows[0].time).toString(),
        filter: 'before',
      })
    }
  }

  handleRightClick = () => {
    const { flows = [] } = this.props
    const length = flows.length
    if (length && flows[length - 1].time !== undefined) {
      this.props.filterLightPeriodChartData({
        time: new Date(flows[length - 1].time).toString(),
        filter: 'after',
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
          <Fragment>
            <div className={classes.content}>
              <div className={classes.left}>
                <IconButton onClick={this.handleLeftClick}>
                  <LeftIcon />
                </IconButton>
              </div>
              <div className={classes.center}>
               
                  <Fragment>
                    <div className={classes.output}>
                      <FlowChart />
                      <Typography align="center">Biểu đồ lưu lượng (xe)</Typography>
                    </div>
                    <div className={classes.output}>
                      <WaitLineChart />
                      <Typography align="center">Biểu đồ dòng chờ (m)</Typography>
                    </div>
                    <div className={classes.output}>
                      <LightPeriodChart />
                      <Typography align="center">Biểu đồ chu kỳ đèn (s)</Typography>
                    </div>
                  </Fragment>
               
              </div>

              <div className={classes.right}>
                <IconButton onClick={this.handleRightClick}>
                  <RightIcon />
                </IconButton>
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ lightPeriod }) => {
  return {
    isFetchingChartData: lightPeriod.api.isFetchingChartData,
    filterTime: lightPeriod.filter.time,
    flows: lightPeriod.data.flows,
  }
}
export default connect(mapStateToProps, { filterLightPeriodChartData })(withStyles(styles)(LightPeriod))
