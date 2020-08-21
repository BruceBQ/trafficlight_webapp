import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Scrollbars } from 'react-custom-scrollbars'
import { Toolbar, IconButton, Divider } from '@material-ui/core'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import { enqueueSnackbar } from 'actions/action_snackbar'

import ArrowTooltip from 'components/TooltipWrapper'

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    height: '100%',
  },
  actions: {
    marginLeft: 'auto',
  },
  videoWrapper: {
    // width: '100%',
    // paddingTop: '56.25%',
    // height: 0,
    // position: 'relative',
    // marginLeft: 8,
    // marginRight: 8,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
  },
})

class VideoView extends Component {
  constructor() {
    super()
    this.video = React.createRef()
  }

  handleTakeSnapshot = () => {
    const video = this.video.current
    const w = video.videoWidth
    const h = video.videoHeight

    if (w === 0 || h === 0) {
      this.props.enqueueSnackbar({
        message: 'Xảy ra lỗi!',
      })
    }
    const canvas = document.createElement('canvas')
    // const context = canvas.getContext('2d')
    const context = canvas.getContext('2d')

    canvas.width = w
    canvas.height = h

    context.fillRect(0, 0, w, h)
    context.drawImage(video, 0, 0, w, h)

    const link = document.createElement('a')
    console.log(canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
    link.setAttribute('crossorigin', 'anonymous')

    link.setAttribute('download', `snapshot_${new Date().getTime()}.png`)
    link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
    link.click()
  }

  render() {
    const { classes, currentVideo } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.toolbarWrapper}>
          <Toolbar>
            <div className={classes.titleWrapper}></div>
            <div className={classes.actions}>
              <ArrowTooltip title="Chụp ảnh">
                <IconButton className={classes.iconButton} onClick={this.handleTakeSnapshot}>
                  <CameraAltIcon className={classes.icon} />
                </IconButton>
              </ArrowTooltip>
            </div>
          </Toolbar>
        </div>
        <Divider />
        <div className={classes.videoWrapper}>
          {currentVideo.map(video => {
            return (
              <video key={video.id} ref={this.video} className={classes.video} controls autoPlay crossOrigin="anonymous">
                <source src={`${video.link}`} />
              </video>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ recordVideos }) => {
  const { videos, currentVideoId } = recordVideos
  const currentVideo = videos.filter(video => video.id === currentVideoId)
  return {
    currentVideo: currentVideo,
  }
}

export default connect(mapStateToProps, { enqueueSnackbar })(withStyles(styles)(VideoView))
