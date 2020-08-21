import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { red, green, yellow } from '@material-ui/core/colors'

const styles = (theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    fontSize: 12,
    background: `rgba(33,33,33,1)`,
    color: 'white',
    borderRadius: 4,
    pointerEvents: 'none',
    transform: 'translate(50%, 0)',
    zIndex: 999
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  rect: { borderRadius: 4, marginRight: 4, width: 15, height: 15 },
  redLight: {
    background: red[900],
  },
  yellowLight: {
    background: yellow[900],
  },
  greenLight: {
    background: green[900],
  },
})

const MARGINS = { top: 10, right: 10, bottom: 20, left: 50 }

class Tooltip extends React.Component {
  render() {
    const { classes, data, scaleX0, scaleX1, scaleY, height } = this.props

    const rootStyles = {
      bottom: height + MARGINS.bottom,
      left: scaleX0(new Date(data.time)) - 90,
    }

    return (
      <div className={classes.root} style={rootStyles}>
        <div className={classes.row}>
          <Typography className={classes.text}>{data.phase}</Typography>
        </div>
        <div className={classes.row}>
          <div className={classNames(classes.rect, classes.redLight)}></div>
          <Typography className={classes.text}>Tổng xe chờ: {data.wait}</Typography>
        </div>
        <div className={classes.row}>
          <div className={classNames(classes.rect, classes.yellowLight)}></div>
          <Typography className={classes.text}>Tổng xe không chờ: {data.remain}</Typography>
        </div>
        <div className={classes.row}>
          {/* <div className={classNames(classes.rect, classes.yellowLight)}></div> */}
          <Typography className={classes.text}>Tổng số qua nút: {data.wait + data.remain}</Typography>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Tooltip)
