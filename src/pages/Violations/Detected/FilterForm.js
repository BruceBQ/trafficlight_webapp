import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  InlineDatePicker,
  MuiPickersUtilsProvider,
  DateTimePicker,
  DatePicker,
} from 'material-ui-pickers'
import { Scrollbars } from 'react-custom-scrollbars'
import viLocale from 'date-fns/locale/vi'
import Select from 'react-select'
import {
  CamList,
  ViolationType,
  VehicleType,
  StatusType,
  NoOptionsMessage,
} from 'components/Select/SelectControl'

const ViolationTypeOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Vượt đèn đỏ' },
  { value: 2, label: 'Lấn làn' },
]
const VehicleTypeOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Ô tô' },
  { value: 2, label: 'Xe máy' },
]
const StatusOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Chưa duyệt' },
  { value: 2, label: 'Đã duyệt' },
]

const selectStyles = {
  menu: styles => {
    return {
      ...styles,
      zIndex: 10,
    }
  },
}

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    flexGrow: 1,
  },
  formContent: {
    flexGrow: 1,
  },
  formGroup: {
    padding: '8px 8px 0 8px',
  },
  formActions: {
    padding: '0 8px 8px',
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
    fontSize: '0.875rem',
    padding: '2.5px 0 2.5px 6px',
  },
})

class FilterForm extends Component {
  handlePickerChange = (name, date) => {
    console.log(date)
    let newDate
    if (name === 'endTime') {
      newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    } else {
      newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }
    this.props.setFieldValue(name, newDate.toString())
  }

  handleSelectChange = (name, values) => {
    this.props.setFieldValue(name, values)
  }

  render() {
    const { classes, values, cameraOptions = [], handleSubmit } = this.props
    return (
      <form className={classes.form} onSubmit={handleSubmit} autoComplete="off">
        <div className={classes.formContent}>
          <Scrollbars style={{ width: '100%' }}>
            <div className={classes.formGroup}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                <div className="form-group">
                  <DatePicker
                    fullWidth
                    label="Từ ngày"
                    name="startDay"
                    clearable
                    clearLabel="Xóa"
                    okLabel="Chọn"
                    cancelLabel="Hủy"
                    variant="outlined"
                    format="dd/MM/yyyy"
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
                    value={values.startTime}
                    onChange={date => this.handlePickerChange('startTime', date)}
                  />
                </div>
                <div className="form-group">
                  <DatePicker
                    fullWidth
                    label="Đến ngày"
                    name="endDay"
                    clearable
                    clearLabel="Xóa"
                    okLabel="Chọn"
                    cancelLabel="Hủy"
                    variant="outlined"
                    format="dd/MM/yyyy"
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
                    value={values.endTime}
                    onChange={date => this.handlePickerChange('endTime', date)}
                  />
                </div>
              </MuiPickersUtilsProvider>
              <div className="form-group">
                <Select
                  placeholder={false}
                  styles={selectStyles}
                  classes={classes}
                  isMulti
                  components={{
                    Control: CamList,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  options={cameraOptions}
                  value={values.cameras}
                  onChange={values => this.handleSelectChange('cameras', values)}
                />
              </div>
              <div className="form-group">
                <Select
                  placeholder={false}
                  styles={selectStyles}
                  classes={classes}
                  components={{
                    Control: VehicleType,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  options={VehicleTypeOptions}
                  value={values.vehicleType}
                  onChange={values => this.handleSelectChange('vehicleType', values)}
                />
              </div>
              <div className="form-group">
                <Select
                  placeholder={false}
                  styles={selectStyles}
                  classes={classes}
                  components={{
                    Control: ViolationType,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  options={ViolationTypeOptions}
                  value={values.violationType}
                  onChange={values => this.handleSelectChange('violationType', values)}
                />
              </div>
              <div className="form-group">
                <Select
                  placeholder={false}
                  styles={selectStyles}
                  classes={classes}
                  components={{
                    Control: StatusType,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  options={StatusOptions}
                  value={values.status}
                  onChange={values => this.handleSelectChange('status', values)}
                />
              </div>
            </div>
          </Scrollbars>
        </div>
        <div className={classes.formActions}>
          <Button variant="contained" color="primary" fullWidth type="submit">
            Áp dụng
          </Button>
        </div>
      </form>
    )
  }
}

const mapStateToProps = ({ cameras }) => {
  const cameraOptions = cameras.cameras.map(cam => ({ value: cam.id, label: cam.name }))
  return {
    cameraOptions,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(FilterForm))
