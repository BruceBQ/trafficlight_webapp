import React from 'react'
import Manager from '../manager'

export default class Player extends React.Component {
  constructor(props) {
    super(props)

    this.video = null
    this.manager = new Manager(props.store)
    this.actions = this.manager.getActions()
    this.manager.subscribeToPlayerStateChange(this.handleStateChange.bind(this))
  }

  componentDidMount(){}

  componentWillUnMount(){}

  render(){

    return (
      <div></div>
    )
  }
}

