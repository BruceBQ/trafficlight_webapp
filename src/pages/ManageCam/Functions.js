import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Scrollbars } from 'react-custom-scrollbars'
import { configCamFunctions, backStep } from 'actions/action_camera'
import { resetZonesDrew } from 'actions/draw_zones/action_draw'
import Record from './Record'
import Surveillance from './Surveillance'
import Stream from './Stream'
import ALPR from './ALPR'
import omit from 'lodash/omit'
import _ from 'lodash'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formContent: {
    flexGrow: 1,
  },
  formGroup: {
    marginTop: 10,
    marginRight: 10,
  },
  actionButton: {
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 5,
  },
  panelSummary: {
    paddingLeft: 0,
  },
  button: {
    marginRight: 10,
  },
})

class Function extends Component {
  changeSwitch = name => event => {
    event.stopPropagation()
  }

  handleSubmit = event => {
    let { addCamera, zoneOptions, dimension } = this.props
    let zoneDrew = []
    zoneOptions.map(data => {
      let zone = {}
      if(data.vertices.length) {
           zone = {
            vertices: data.vertices,
            id: data.id,
            type: data.type
          }

          if(data.arrow) {
            if(data.arrow.length) {
              zone.arrow = data.arrow
            }else {
              zone.arrow = []
            }
          }

          zoneDrew.push(zone)

      }
    })

    addCamera.zones = zoneDrew
    addCamera.dimension = dimension

    // localStorage.setItem("zoneDrew", JSON.stringify(zoneDrew))
    console.log('zoneDrew', addCamera)

    this.props.resetZonesDrew()
    this.props.configCamFunctions(omit(addCamera, ['activeStep']))
  }

  handleBackStep = event => {
    this.props.backStep()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.formContent}>
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            <div className={classes.formGroup}>
              {/* <Enabled /> */}
              <Record />
              <Surveillance />
              <Stream />
              <ALPR />
            </div>
          </Scrollbars>
        </div>
        <div className={classes.actionButton}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={this.handleBackStep}
          >
            Quay lại
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleSubmit}
          >
            Hoàn thành
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  addCamera: state.cameras.addCamera,
  zoneOptions: state.drawZones.zoneOptions,
  dimension: state.drawZones.dimension
})

export default connect(mapStateToProps, {
  backStep,
  configCamFunctions,
  resetZonesDrew,
})(withStyles(styles)(Function))
