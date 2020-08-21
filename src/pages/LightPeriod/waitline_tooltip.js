import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const styles = (theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'white',
    zIndex: 5000,
    boxShadow: theme.shadows[2],
    borderRadius: 4,
  },
  image: {
    width: 350,
  },
  text: {
    marginTop: 8,
  },
})

const MARGINS = { top: 10, right: 30, bottom: 20, left: 70 }
class WaitlineTooltip extends React.Component {
  render() {
    const { classes, scaleX0, scaleX1, scaleY, data, height, width } = this.props
    const left = scaleX0(new Date(data.time)) + 350 > width ? width - 350 : scaleX0(new Date(data.time))
    const rootStyles = {
      bottom: height + MARGINS.bottom + 5,
      left: left,
    }

    return (
      <div className={classes.root} style={rootStyles}>
        <img src={`http://10.49.46.251${data.image}`} className={classes.image} />
        <div className={classes.text}>
          <Typography align="center">{`${data.name}: ${data.value}m`}</Typography>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(WaitlineTooltip)
