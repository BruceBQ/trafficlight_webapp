import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import TooltipWrapper from '../../../TooltipWrapper'

class PlayToggle extends Component {
  _onClick = () => {
    // console.log(this.props)
    const { player, actions, video } = this.props
    
    if (player.paused) {
      console.log('playing')
      // video.get(0).play()
    } else {
      console.log('playing')
      // video.get(0).pause()
    }
  }
  render() {
    const { player } = this.props
    const titleText = player.paused ? 'Phát' : 'Dừng'
    return (
      <button
        className="control-button control-button__play"
        type="button"
        onClick={this._onClick}
      >
        {player.paused ? (
          <PlayArrow className="control-button__icon" />
        ) : (
          <Pause className="control-button__icon" />
        )}
        <div className="title-tip">{titleText}</div>
      </button>
    )
  }
}


export default PlayToggle
