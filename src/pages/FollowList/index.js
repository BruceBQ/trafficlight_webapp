import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import _ from 'lodash'

import TooltipWrapper from 'components/TooltipWrapper'
import { fetchFollowList } from 'actions/action_followList'
import { fetchCamGroup} from 'actions/action_camera'
import { modal_showAddCam } from 'actions/action_modal'
import Loading from 'components/Loading'
import RowCamera from './RowCamera'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    // background: 'green',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
})

class FollowList extends Component {
  // state = {
  //   height: 0,
  //   width: 0,
  // }

  componentDidMount() {
    // this.handleResize()
    this.props.fetchFollowList({group: 'all'})
    this.props.fetchCamGroup()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillMount() {
    clearImmediate(this.immediate)
    window.removeEventListener('resize', this.handleResize)
  }

  _onAddCamClick = () => {
    this.props.modal_showAddCam()
  }

  handleResize = async () => {
    const height = window.innerHeight - 60,
      width = window.innerWidth - 50
    clearImmediate(this.clearImmediate)
    if (height / width <= 9 / 16) {
      this.immediate = setImmediate(() =>
        this.setState({
          height: height,
          width: (height * 16) / 9,
        }),
      )
    } else {
      this.immediate = setImmediate(() => {
        this.setState({
          height: (width * 9) / 16,
          width: width,
        })
      })
    }
  }

  renderEmptyRow = amountEmptyRow => {
    const { listSize } = this.props
    if (amountEmptyRow > 0) {
      let row = []
      for (let i = 0; i < amountEmptyRow; i++) {
        row.push(<RowCamera empty key={i + listSize} cams={[]} />)
      }
      return row
    }
    return
  }

  render() {
    let stylesWrapper
    let height = window.innerHeight - 60,
      width = window.innerWidth - 50
    if (height / width <= 9 / 16) {
      stylesWrapper = {
        height: height,
        width: (height * 16) / 9,
      }
    } else {
      stylesWrapper = {
        height: (width * 9) / 16,
        width: width,
      }
    }
    const {
      classes,
      cams = [],
      listSize,
      isFetching,
      currentPage,
      totalPage,
      groups
    } = this.props
    const pageCamList = _.chunk(cams, Number(listSize))[currentPage - 1]
    const listCams = _.chunk(pageCamList, Math.sqrt(parseInt(listSize)))
    const amountEmptyRow = Math.sqrt(listSize) - listCams.length
    const emptyRow = this.renderEmptyRow(amountEmptyRow)
    return (
      <div className={classes.root}>
        <div className={classes.wrapper} style={stylesWrapper}>
          {isFetching ? (
            <Loading />
          ) : (
            <Fragment>
              {listCams.map((cams, index) => {
                return <RowCamera cams={cams} key={index} />
              })}
              {emptyRow}
              <TooltipWrapper title="Thêm camera">
                <Fab
                  className={classes.fab}
                  onClick={this._onAddCamClick}
                  color="primary"
                >
                  <AddIcon />
                </Fab>
              </TooltipWrapper>
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ followList }) => ({
  cams: followList.cameras,
  isFetching: followList.isFetching,
  listSize: followList.listSize,
  currentPage: followList.currentPage,
  totalPage: followList.totalPage,
  groups: followList.groups
})
export default connect(
  mapStateToProps,
  {
    modal_showAddCam,
    fetchFollowList,
    fetchCamGroup
  },
)(withStyles(styles)(FollowList))
