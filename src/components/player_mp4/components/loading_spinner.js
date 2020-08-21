import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from '@material-ui/core'

export default function LoadingSpinner({ player, className }) {
  if (player.error) return null

  return (
    <div>
      <CircularProgress />
    </div>
  )
}

LoadingSpinner.displayName = 'LoadingSpinner'
