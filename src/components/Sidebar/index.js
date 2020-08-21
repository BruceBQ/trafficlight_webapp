import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Nav } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TooltipWrapper from '../TooltipWrapper'
import AppsOutlined from '@material-ui/icons/AppsOutlined'
import MapsOutlined from '@material-ui/icons/MapOutlined'
import VideocamOutlined from '@material-ui/icons/VideocamOutlined'
import DescriptionIcon from '@material-ui/icons/Description'
import Search from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import SettingsOutlined from '@material-ui/icons/SettingsOutlined'
import ListAltIcon from '@material-ui/icons/ListAlt'
import DepartureBoardOutlined from '@material-ui/icons/DepartureBoardOutlined'
import VideoLibrary from '@material-ui/icons/VideoLibraryOutlined'
import Timer from '@material-ui/icons/Timer'
import TrafficOutlined from '@material-ui/icons/TrafficOutlined'
import BarChartIcon from '@material-ui/icons/BarChart'
import { indigo } from '@material-ui/core/colors'
import { toggleSettingsMenu } from '../../actions/action_ui'

const styles = theme => ({
  root: {
    width: 60,
    zIndex: 1,
    background: 'white',
    position: 'fixed',
    borderRight: '1px solid #E3E3E3',
    top: 50,
    bottom: 0,
  },
  wrapper: {
    height: '100%',
    marginLeft: 2,
    marginRight: 2,
    // width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topIcon: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  bottomIcon: {
    flexGrow: 0,
  },
  nav: {},
  navItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  navLink: {
    display: 'flex',
  },
  navLinkActive: {
    borderLeft: `4px solid ${indigo[900]}`,
    borderRadius: 4,
    paddingLeft: '-4px',
    display: 'block',
    color: indigo[900],
    backgroundColor: '#e8f0fe',
    fontWeight: 500,
  },
  smallIcon: {
    fontSize: 24,
  },
  icon: {
    marginRight: -10,
  },

  menuItem: {
    padding: 0,
    height: '100%',
    // paddingLeft: 0,
    // paddingRight: 0,
  },
  listItemText: {
    fontSize: '0.825rem',
    fontWeight: 500,
  },
  navLinkMenu: {
    display: 'flex',
    padding: '11px 16px',
  },
})


class Sidebar extends Component {
  state = {
    anchorEl: null,
  }

  toggleSettingsMenu = () => {
    if (!this.props.settingsMenu) {
      this.props.dispatch(toggleSettingsMenu())
    } else {
      
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { classes } = this.props
    const { anchorEl } = this.state
    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <div className={classes.topIcon}>
            <ul className={classes.nav}>
              <li className={classes.navItem}>
                <NavLink
                  to="/dashboard/sitemap"
                  className={classes.navLink}
                  activeClassName={classes.navLinkActive}
                  exact={true}
                >
                  <TooltipWrapper title="Bản đồ" placement="right">
                    <IconButton color="inherit">
                      <MapsOutlined className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink
                  to="/dashboard/follow_list"
                  activeClassName={classes.navLinkActive}
                  exact={true}
                >
                  <TooltipWrapper title="Danh sách theo dõi" placement="right">
                    <IconButton color="inherit">
                      <AppsOutlined className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              {/* <li className={classes.navItem}>
                <NavLink
                  to="/dashboard/search_vehicles"
                  activeClassName={classes.navLinkActive}
                  exact={true}
                >
                  <TooltipWrapper title="Tìm kiếm phương tiện" placement="right">
                    <IconButton color="inherit">
                      <Search className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink to="/dashboard/blacklist" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Danh sách đen" placement="right">
                    <IconButton color="inherit">
                      <ListAltIcon className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink to="/dashboard/violations" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Vi phạm" placement="right">
                    <IconButton color="inherit">
                      <DescriptionIcon className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li> */}
              <li className={classes.navItem}>
                <NavLink to="/dashboard/record_videos" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Xem lại" placement="right">
                    <IconButton color="inherit">
                      <VideoLibrary className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink to="/dashboard/flow" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Lưu lượng" placement="right">
                    <IconButton color="inherit">
                      <DepartureBoardOutlined className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink to="/dashboard/traffic_light" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Điều khiển đèn tín hiệu" placement="right">
                    <IconButton color="inherit">
                      <TrafficOutlined className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink to="/dashboard/light_period" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Chu kỳ đèn" placement="right">
                    <IconButton color="inherit">
                      <BarChartIcon className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
              <li className={classes.navItem}>
                <NavLink to="/dashboard/wait_time" activeClassName={classes.navLinkActive}>
                  <TooltipWrapper title="Thời gian chờ trung bình" placement="right">
                    <IconButton color="inherit">
                      <Timer className={classes.smallIcon} />
                    </IconButton>
                  </TooltipWrapper>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className={classes.bottomIcon}>
            <Nav>
              <li className="nav-item">
                <IconButton onClick={this.handleClick} className={classes.smallIcon}>
                  <SettingsOutlined className={classes.smallIcon} />
                </IconButton>
              </li>
            </Nav>
          </div>
          <Menu
            id="expand-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose} className={classes.menuItem}>
              <NavLink
                to="/dashboard/manage_cam"
                className={classes.navLinkMenu}
                // activeClassName={classes.navLinkActive}
                exact={true}
              >
                <ListItemIcon className={classes.icon}>
                  <VideocamOutlined className={classes.smallIcon} />
                </ListItemIcon>
                <ListItemText
                  primary="QUẢN LÝ CAMERA"
                  classes={{ primary: classes.listItemText }}
                />
              </NavLink>
            </MenuItem>
            {/* <MenuItem onClick={this.handleClose}>
              <NavLink to="/dashboard/manage_cam" className={classes.navLink}>
                <ListItemIcon className={classes.icon}>
                  <ScheduleOutlined  className={classes.smallIcon}/>
                </ListItemIcon>
                <ListItemText primary="LOGS" classes={{primary: classes.listItemText}}/>
              </NavLink>
            </MenuItem> */}
          </Menu>
        </div>
        {/* {this.props.settingsMenu && <SettingsMenu />} */}
      </div>
    )
  }
}

const mapStateToProps = ({ ui }) => ({
  settingsMenu: ui.settingsMenu,
})

export default connect(mapStateToProps)(withStyles(styles)(Sidebar))
