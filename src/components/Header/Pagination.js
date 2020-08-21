import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Select from 'react-select'
import { changeFollowListPage } from '../../actions/action_followList'
import { PaginationControl, NoOptionsMessage } from '../Select/SelectControl'

const styles = theme => ({
  root: {
    width: 110,
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

class Pagination extends Component {
  onChange = value => {
    this.props.changeFollowListPage(value.value)
  }
  render() {
    const { classes, currentPage, totalPage } = this.props
    let pageOptions = []
    for (let i = 1; i <= totalPage; i++) {
      pageOptions.push({ value: i, label: i })
    }
    const value = { value: currentPage, label: currentPage }
    return (
      <div className={classes.root}>
        <Select
          classes={classes}
          placeholder={false}
          components={{
            Control: PaginationControl,
            NoOptionsMessage: NoOptionsMessage,
          }}
          options={pageOptions}
          value={value}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ followList }) => ({
  currentPage: followList.currentPage,
  totalPage: followList.totalPage,
})

export default connect(
  mapStateToProps,
  {
    changeFollowListPage: changeFollowListPage,
  },
)(withStyles(styles)(Pagination))
