import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import ModeForm from './ModeForm'
import { fetchConfigTrafficLight, editConfigTrafficLight } from 'actions/action_trafficControl'
import Loading from 'components/Loading'

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  radioGroup: {
    flexDirection: 'row',
  },
})

class TrafficLight extends Component {
  state = {
    tabValue: 1,
  }

  componentDidMount() {
    this.props.fetchConfigTrafficLight()
  }

  handleClick = () => {}

  handleTabChange = (event, value) => {
    this.setState({
      tabValue: value,
    })
  }

  handleSubmit = values => {
    values.yellow_blink.flow_threshold = parseInt(values.yellow_blink.flow_threshold)
    values.yellow_blink.time_threshold = parseInt(values.yellow_blink.time_threshold)
    this.props.editConfigTrafficLight(values)
  }

  render() {
    const { classes, isFetchingConfig, config } = this.props
    const { tabValue } = this.state
    if (isFetchingConfig) {
      return <Loading />
    }
    return (
      <div className={classes.root}>
        <Formik
          enableReinitialize
          initialValues={{
            ...config
          }}
          onSubmit={values => this.handleSubmit(values)}
          render={props => <ModeForm {...props} />}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ trafficControl }) => {
  return {
    isFetchingConfig: trafficControl.api.isFetchingConfig,
    config: trafficControl.trafficLight,
  }
}

export default connect(mapStateToProps, {
  fetchConfigTrafficLight,
  editConfigTrafficLight
})(withStyles(styles)(TrafficLight))
