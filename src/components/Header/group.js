import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import Select from 'react-select'

import { fetchFollowList } from 'actions/action_followList'
import { NoOptionsMessage, GroupControl } from '../Select/SelectControl'

const styles = theme => ({
  root: {
    width: 200,
    paddingRight: 10,
  },
  inputProps: {
    fontSize: '0.875rem',
    padding: '12px 14px',
  },
  inputLabel: {
    fontSize: '0.85rem',
    transform: 'translate(16px, 12px) scale(1)',
  },
  input: {
    display: 'flex',
    fontSize: '0.85rem',
    padding: '0 0 0 6px',
  },
})

class Group extends React.Component {
  handleSelectChange = value => {
    this.props.fetchFollowList({group: value.value})
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Select
          classes={classes}
          placeholder={false}
          components={{
            Control: GroupControl,
            NoOptionsMessage: NoOptionsMessage,
          }}
          options={this.props.groups}
          defaultValue={{ value: 'all', label: 'Tất cả' }}
          // defaultValue={_.isEmpty(this.props.groups) ? null : this.props.groups[0]}
          onChange={this.handleSelectChange}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  groups: state.followList.groups,
})

export default connect(mapStateToProps, { fetchFollowList })(withStyles(styles)(Group))
