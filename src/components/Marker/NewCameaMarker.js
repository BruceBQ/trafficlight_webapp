import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import newCameIcon from '../../assets/icon/spotlight_pin_v2_accent-1-small.png'


const styles = theme => ({
    root: {
        position: 'absolute',
        padding: 0,
        margin: 0,
        width: '25px',
        height: '44px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transform: 'translate(-50%, -100%)',
        // transformOrigin: '50% 50%',
        backgroundImage: `url(${newCameIcon})`,
    }
})
class NewCameraMarker extends Component{
    render(){
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <div></div>
            </div>
        )
    }
}

export default withStyles(styles)(NewCameraMarker)