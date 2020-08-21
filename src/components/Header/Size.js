import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Select from 'react-select'
import { ListSizeControl, NoOptionsMessage } from '../Select/SelectControl'
import { changeBoundsMap } from '../../actions/action_map'
import { changeListSize } from '../../actions/action_followList'

const styles = theme => ({
  root: {
    width: 100,
  },
  formControl: {
    width: 100,
  },
  inputProps: {
    fontSize: '0.875rem',
    padding: '12px 14px',
  },
  inputLabel: {
    fontSize: '0.875rem',
    transform: 'translate(16px, 12px) scale(1)',
  },
  input: {
    display: 'flex',
    fontSize: '0.875rem',
    padding: '0 0 0 6px',
  },
})

class Size extends Component {
  onChange = value => {
    this.props.changeListSize(value.value)
  }
  render() {
    const { classes, listSize } = this.props
    const sizeOptions = [
      { value: 4, label: '2x2' },
      { value: 9, label: '3x3' },
      { value: 16, label: '4x4' },
    ]
    let value = null

    switch (listSize) {
      case 4:
        value = { value: 4, label: '2x2' }
        break
      case 9:
        value = { value: 9, label: '3x3' }
        break
      case 16:
        value = { value: 16, label: '4x4' }
        break
    }
    return (
      <div className={classes.root}>
        <Select
          classes={classes}
          components={{
            Control: ListSizeControl,
            NoOptionsMessage: NoOptionsMessage,
          }}
          placeholder={false}
          options={sizeOptions}
          value={value}
          onChange={this.onChange}
        />
      </div>
    )
  }
}
const mapStateToProps = ({ followList }) => ({
  listSize: followList.listSize,
})
export default connect(
  mapStateToProps,
  {
    changeListSize: changeListSize,
  },
)(withStyles(styles)(Size))
