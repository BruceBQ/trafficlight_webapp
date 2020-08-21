import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({

})

class FilterChip extends Component {
  render(){
    const { classes } = this.props
    return (
      <div>

      </div>
    )
  }
}

export default connect()(withStyles(styles)(FilterChip))