import React, { Component, Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

import LoggedInRoute from 'components/logged_in_route'
// import SecretRoute from '../../components/SecretRoute'
import Loading from 'components/Loading'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import ModalWrapper from 'components/Modal'
import { loadUserData } from '../../utils/localStorage'
import { startFollowList } from '../../actions/action_followList'

const SitemapPage = lazy(() => import('../Sitemap'))
const FollowList = lazy(() => import('../FollowList'))
const ManageCam = lazy(() => import('../ManageCam'))
const SearchVehicles = lazy(() => import('../SearchVehicles'))
const BlackList = lazy(() => import('../BlackList'))
const Violations = lazy(() => import('../Violations'))
const RecordVideo = lazy(() => import('../RecordVideo'))
const Flow = lazy(() => import('../Flow'))
const WaitTime = lazy(() => import('../WaitTime'))
const TrafficLight = lazy(() => import('../TrafficLight'))
const LightPeriod = lazy(() => import('../LightPeriod'))
// const ViolationDetail = lazy(() => import('pages/Violations/Detected/ViolationDetail'))

class Layout extends Component {
  componentDidMount() {
    const userData = loadUserData()
    if (userData !== undefined && userData.id !== undefined && userData.access_token !== undefined) {
      // this.props.startFollowList()
    }
  }

  render() {
    const { match } = this.props
    
    return (
      <div className="wrapper">
        <Sidebar />
        <Header />
        <main className="content">
          <Suspense fallback={<Loading />}>
            <Switch>
              <LoggedInRoute path={`${match.url}/sitemap`} component={SitemapPage} exact={true} />
              <LoggedInRoute path={`${match.url}/follow_list`} component={FollowList} />
              <LoggedInRoute path={`${match.url}/manage_cam`} component={ManageCam} />
              {/* <LoggedInRoute path={`${match.url}/search_vehicles`} component={SearchVehicles} /> */}
              {/* <LoggedInRoute path={`${match.url}/blacklist`} component={BlackList} /> */}
              {/* <LoggedInRoute path={`${match.url}/violations`} component={Violations} exact /> */}
              <LoggedInRoute path={`${match.url}/record_videos`} component={RecordVideo} exact />
              <LoggedInRoute path={`${match.url}/flow`} component={Flow} />
              <LoggedInRoute path={`${match.url}/wait_time`} component={WaitTime} />
              <LoggedInRoute path={`${match.url}/light_period`} component={LightPeriod} />
              <LoggedInRoute path={`${match.url}/traffic_light`} component={TrafficLight} />
              <Redirect from="/dashboard" to="/dashboard/sitemap" />
            </Switch>
          </Suspense>
        </main>
        <ModalWrapper />
      </div>
    )
  }
}

export default Layout
