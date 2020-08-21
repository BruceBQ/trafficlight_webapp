import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  MuiPickersUtilsProvider,
  InlineDateTimePicker,
} from 'material-ui-pickers'
import viLocale from 'date-fns/locale/vi'
import DateFnsUtils from '@date-io/date-fns'
import { filterWaitTimeChartData } from 'actions/action_wait_time'
import { Typography,Button } from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import { Refresh } from '@material-ui/icons'
import classNames from 'classnames'
import ArrowTooltip from 'components/TooltipWrapper'

const styles = themes => ({
  root: {
    display: 'flex',
    paddingTop: 16,
    paddingLeft: 16,
  },
  refresh: {
    marginLeft: 30,
  },
  inputProps: {
    fontSize: '0.875rem',
    padding: '12px 14px',
  },
  inputLabel: {
    fontSize: '0.875rem',
    transform: 'translate(19px, 14px) scale(1)',
  },
  input: {
    display: 'flex',
    width: 120,
    fontSize: '0.875rem',
    padding: '2.5px 0 2.5px 6px',
  },
  legend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
  },
  rect: {
    width: 20,
    height: 20,
    marginRight: 4,
    borderRadius: 4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 24,
  },
  hnt: {
    background: '#98abc5',
  },
  hht: {
    background: '#8a89a6',
  },
  wait: {
    background: indigo[700],
  },
  notwait: {
    background: indigo[200],
  },
  greenLight: {
    background: '#2e7d32',
  },
})

const selectStyles = {
  menu: styles => {
    return {
      ...styles,
      zIndex: 2,
    }
  },
}

class Filter extends Component {
  handlePickerChange = (date, type) => {
    this.props.filterWaitTimeChartData({
      [type]: date.toString(),
      filter: 'after'
    })
  }

  handleSelectChange = (date, type) => {}

  handleClick = () => {
    this.props.filterWaitTimeChartData({
      time: new Date().toString(),
      filter: 'after'
    })
  }

  render() {
    const { classes, filter } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.form}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
            <InlineDateTimePicker
              name="time"
              label="Thời điểm"
              variant="outlined"
              format="dd/MM/yyyy HH:mm"
              ampm={false}
              InputLabelProps={{
                classes: {
                  root: classes.inputLabel,
                },
              }}
              InputProps={{
                inputProps: {
                  className: classes.inputProps,
                },
              }}
              value={filter.time}
              onChange={date => this.handlePickerChange(date, 'time')}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.refresh}>
          <ArrowTooltip title="Tải lại">
            <Button variant="contained" onClick={this.handleClick} color="primary">
              <Refresh />
            </Button>
          </ArrowTooltip>
        </div>
        <div className={classes.legend}>
          <div className={classes.row}>
            <div className={classNames(classes.rect, classes.wait)} />
            <Typography>Tổng xe chờ</Typography>
          </div>
          <div className={classes.row}>
          <div className={classNames(classes.rect, classes.notwait)} />
            <Typography>Tổng xe không chờ</Typography>
          </div>
          <div className={classes.row}>
            <div className={classNames(classes.rect, classes.hnt)} />
            <Typography>Hà Huy Tập</Typography>
          </div>
          <div className={classes.row}>
            <div className={classNames(classes.rect, classes.hht)} />
            <Typography>Huỳnh Ngọc Huệ</Typography>
          </div>
          {/* <div className={classes.row}>
            <div className={classNames(classes.rect, classes.redLight)} />
            <Typography>Đèn đỏ</Typography>
          </div>
          <div className={classes.row}>
            <div className={classNames(classes.rect, classes.yellowLight)} />
            <Typography>Đèn vàng</Typography>
          </div>
          <div className={classes.row}>
            <div className={classNames(classes.rect, classes.greenLight)} />
            <Typography>Đèn xanh</Typography>
          </div> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ waitTime }) => ({
  filter: waitTime.filter,
})

export default connect(mapStateToProps, { filterWaitTimeChartData })(
  withStyles(styles)(Filter),
)