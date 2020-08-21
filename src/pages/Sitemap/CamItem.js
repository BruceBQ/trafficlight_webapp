import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Info from '@material-ui/icons/Info'
import Typography from '@material-ui/core/Typography'

import TooltipWrapper from '../../components/TooltipWrapper'
import { showCamInfoModal } from 'actions/action_modal'
import { addCamToFollowList, removeCamFromFollowList } from 'actions/action_followList'
import { showInfoWindow } from 'actions/action_map'
import { closePrevStreaming } from 'actions/action_streaming'

const styles = theme => ({
  card: {
    display: 'flex',
    marginTop: 5,
    // marginRight: 15,
    cursor: 'pointer',
  },
  cardMediaWrapper: {
    width: 115,
  },
  focused: {
    backgroundColor: '#e0e0e0',
  },
  details: {
    width: 'calc(100% - 115px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardMedia: {
    width: '100%',
    paddingTop: '56.25%',
  },
  cardContent: {
    paddingTop: 5,
    paddingBottom: 0,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,
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
  icon: {
    fontSize: 14,
  },
  iconButton: {
    padding: 6,
  },
})

class CamItem extends Component {
  _onSubscribeClick = event => {
    event.stopPropagation()
    const { id } = this.props.detail
    this.props.addCamToFollowList(Array(id))
  }

  _onUnSubscribeClick = event => {
    event.stopPropagation()
    const { id } = this.props.detail
    this.props.removeCamFromFollowList(Array(id))
  }

  _onInfoClick = event => {
    event.stopPropagation()
    this.props.showCamInfoModal()
  }

  _onCardClick = () => {
    const { infoWindow } = this.props
    const { id, lat, lng } = this.props.detail
    if (infoWindow !== -1 && infoWindow !== id) {
      this.props.closePrevStreaming(infoWindow)
    }
    if (infoWindow !== id) {
      this.props.showInfoWindow({
        center: { lat, lng },
        id,
        // zoom: 15
      })
    }
  }

  render() {
    const { classes, detail = {}, infoWindow } = this.props
    const isShowInfoWindow = detail.id === infoWindow
    return (
      <Card
        className={classNames(classes.card, {
          [classes.focused]: isShowInfoWindow,
        })}
        onClick={this._onCardClick}
      >
        <div className={classes.cardMediaWrapper}>
          <CardMedia className={classes.cardMedia} image={`http://10.49.46.251${detail.thumnail}`} />
        </div>
        <div className={classes.details}>
          <CardContent className={classes.cardContent}>
            <Typography variant="inherit" noWrap className={classes.name}>
              {detail.name}
            </Typography>
            <Typography variant="inherit" noWrap className={classes.address}>
              {detail.address}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            {detail.is_in_followlist ? (
              <TooltipWrapper title="Bỏ theo dõi">
                <IconButton className={classes.iconButton} onClick={this._onUnSubscribeClick}>
                  <VisibilityOff className={classes.icon} />
                </IconButton>
              </TooltipWrapper>
            ) : (
              <TooltipWrapper title="Theo dõi">
                <IconButton className={classes.iconButton} onClick={this._onSubscribeClick}>
                  <Visibility className={classes.icon} />
                </IconButton>
              </TooltipWrapper>
            )}

            <TooltipWrapper title="Thông tin">
              <IconButton className={classes.iconButton} onClick={this._onInfoClick}>
                <Info className={classes.icon} />
              </IconButton>
            </TooltipWrapper>
          </div>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = ({ cameras, map }) => ({
  infoWindow: map.showInfoWindow,
})

export default connect(
  mapStateToProps,
  {
    showInfoWindow,
    closePrevStreaming,
    addCamToFollowList,
    removeCamFromFollowList,
    showCamInfoModal
  },
)(withStyles(styles)(CamItem))
