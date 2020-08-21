import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Switch from '@material-ui/core/Switch'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import DeleteIcon from '@material-ui/icons/Delete'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import TooltipWrapper from '../../components/TooltipWrapper'
import {
  focusOnCam,
  configCam,
  getCamConnection,
  deleteCam,
  changeCamStatus,
} from '../../actions/action_camera'
import { showDeleteCamModal } from '../../actions/action_modal'
import { Dialog } from '@material-ui/core'

const styles = theme => ({
  card: {
    display: 'flex',
    marginTop: 5,
    // marginRight: 15,
    cursor: 'pointer',
  },
  focused: {
    backgroundColor: '#e0e0e0',
  },
  cardMediaWrapper: {
    width: 115,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,
  },
  details: {
    width: 'calc(100% - 115px)',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  cardMedia: {
    width: '100%',
    paddingTop: '56.25%',
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconButton: {
    padding: 6,
  },
  icon: {
    fontSize: 16,
  },
  name: {
    fontSize: 14,
    lineHeight: 1.3,
    fontWeight: 500,
  },
  address: {
    fontSize: 12,
    lineHeight: 1.3,
  },
  description: {
    lineHeight: '1.5em',
    fontSize: '0.825rem',
  },
  switchBase: {
    height: 20,
  },
  dialog: {
    pointerEvents: 'none',
  },
  process: {
    padding: '0 22px',
  },
})
class CameraItem extends Component {
  state = {
    open: false,
  }

  handleClick = e => {
    e.stopPropagation()
    const { lat, lng, id } = this.props.detail
    this.props.focusOnCam({
      center: { lat, lng },
      zoom: 15,
      id,
    })
  }

  _onMouseLeave = () => {}
  _onMouseLeave = () => {}
  _onSwitchChange = (id, status) => e => {
    e.stopPropagation()
    let nextStatus
    if (status === 'disabled') {
      nextStatus = 'enabled'
    } else {
      nextStatus = 'disabled'
    }

    this.props.changeCamStatus(id, {
      status: nextStatus,
    })
  }
  handleConfigsClick = e => {
    e.stopPropagation()
    const { id, lat, lng, name, ip } = this.props.detail
    this.props.configCam({
      center: { lat, lng },
      name,
      ip,
      zoom: 15,
      id,
    })
    // this.props.getCamConnection({
    //   center: { lat, lng },
    //   zoom: 15,
    //   id
    // })
  }

  handleDeleteClick = () => {
    this.props.showDeleteCamModal(this.props.detail)
  }

  render() {
    const { classes, detail, focusedCam, changingCamStatus } = this.props
    const isFocused = focusedCam === detail.id
    return (
      <div>
        <Card
          className={classNames(classes.card, {
            [classes.focused]: isFocused,
          })}
          onClick={this.handleClick}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
        >
          <div className={classes.cardMediaWrapper}>
            <CardMedia className={classes.cardMedia} image={`http://10.49.46.251${detail.thumnail}`} />
          </div>
          <div className={classes.details}>
            <CardContent className={classes.cardContent}>
              <Typography variant="inherit" noWrap className={classes.name}>
                {detail.name}
              </Typography>
              <Typography
                variant="inherit"
                noWrap
                // color="textSecondary"
                className={classes.address}
              >
                {detail.address}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <Fragment>
                <TooltipWrapper title="Cấu hình">
                  <IconButton
                    className={classes.iconButton}
                    onClick={this.handleConfigsClick}
                  >
                    <SettingsIcon className={classes.icon} />
                  </IconButton>
                </TooltipWrapper>
                <TooltipWrapper title="Xóa">
                  <IconButton
                    className={classes.iconButton}
                    onClick={this.handleDeleteClick}
                  >
                    <DeleteIcon className={classes.icon} />
                  </IconButton>
                </TooltipWrapper>
                {detail.id === changingCamStatus ? (
                  <div className={classes.process}>
                    <CircularProgress size={16} />
                  </div>
                ) : (
                  <Switch
                    color="primary"
                    classes={{
                      switchBase: classes.switchBase,
                    }}
                    checked={detail.status !== 'disabled'}
                    onChange={this._onSwitchChange(detail.id, detail.status)}
                  />
                )}
              </Fragment>
            </div>
          </div>
        </Card>
      </div>
      // </ListItem>
    )
  }
}

const mapStateToProps = ({ cameras }) => ({
  focusedCam: cameras.focusedCam,
  changingCamStatus: cameras.changingCamStatus,
})
export default connect(
  mapStateToProps,
  {
    focusOnCam: focusOnCam,
    showDeleteCamModal: showDeleteCamModal,
    // switchTab: switchTab,
    changeCamStatus,
    configCam: configCam,
    // getCamConnection: getCamConnection
  },
)(withStyles(styles)(CameraItem))
