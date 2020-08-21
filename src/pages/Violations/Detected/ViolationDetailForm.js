import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'
import Select from 'react-select'
import _ from 'lodash'
import DateFnsUtils from '@date-io/date-fns'
import { InlineDatePicker, InlineTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers'
import viLocale from 'date-fns/locale/vi'
import { ViolationType, VehicleType, NoOptionsMessage } from 'components/Select/SelectControl'

import TextInput from 'components/TextInput'
import Viewer from 'react-viewer'

const selectStyles = {
  menu: styles => {
    return {
      ...styles,
      zIndex: 2,
    }
  },
}

const ViolationTypeOptions = [{ value: 1, label: 'Vượt đèn đỏ' }, { value: 2, label: 'Lấn làn' }]

const VehicleTypeOptions = [{ value: 1, label: 'Ô tô' }, { value: 2, label: 'Xe máy' }]

const styles = theme => ({
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
  form: {
    padding: 8,
  },
  thumnail: {
    width: 200,
    // height: 180,
    padding: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 400,
  },
  thumnailWrapper: {
    display: 'flex',
    // justifyContent: 'center',
  },
  videoWrapper: {
    display: 'flex',
    // justifyContent: 'center',
  },
})

class ViolationDetailForm extends Component {
  state = {
    show: false,
  }
  handleSelectChange = (name, values) => {
    this.props.setFieldValue(name, values)
  }

  handleInputChange = event => {
    this.props.handleChange(event)
  }

  handlePickerChange = (name, date) => {
    this.props.setFieldValue(name, date)
  }

  render() {
    const { classes, values = {}, handleSubmit, dirty } = this.props
    let imgArr = []
    if (_.has(values, 'thumnails'))
      imgArr = values.thumnails.map(item => ({
        src: `http://10.49.46.46:3000${item}`,
        alt: values.plateNumber,
      }))
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
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
          <TextInput
            fullWidth
            label="Địa điểm"
            value={values.address}
            name="location"
            disabled
            onChange={this.handleInputChange}
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
          <TextInput
            fullWidth
            label="Biển số xe"
            value={values.plateNumber}
            name="plateNumber"
            onChange={this.handleInputChange}
          />
        </div>
        {/* <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
          <div className="form-group">
            <InlineDatePicker
              fullWidth
              label="Ngày"
              name="day"
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
              value={values.day}
              onChange={this.handlePickerChange}
            />
          </div>
          <div className="form-group">
            <InlineTimePicker
              fullWidth
              ampm={false}
              seconds
              label="Giờ"
              name="time"
              variant="outlined"
              format="HH:mm:ss"
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
              value={values.time}
              onChange={this.handlePickerChange}
            />
          </div>
        </MuiPickersUtilsProvider> */}
        <div className="form-group">
          <TextInput
            fullWidth
            label="Thời gian"
            disabled
            value={values.timestamp}
            name="timestamp"
            // onChange={this.handleInputChange}
          />
        </div>
        {/* <div className="form-group">
          <TextInput
            fullWidth
            label="Mô tả"
            value={values.description}
            name="description"
            onChange={this.handleInputChange}
          />
        </div> */}
        <div className="form-group">
          <Typography className={classes.label}>Hình ảnh</Typography>
          <div className={classes.thumnailWrapper}>
            {_.has(values, 'thumnails') &&
              values.thumnails.map((item, index) => (
                <img
                  key={index}
                  src={`http://10.49.46.46:3000${item}`}
                  className={classes.thumnail}
                  onClick={() => this.setState({ show: true })}
                />
              ))}
            {_.has(values, 'thumnails') && (
              <Viewer
                visible={this.state.show}
                onClose={() => this.setState({ show: false })}
                images={imgArr}
              />
            )}
          </div>
        </div>
        <div className="form-group">
          <Typography className={classes.label}>Video</Typography>
          <div className={classes.videoWrapper}>
            <video width="400" controls>
              <source src={values.video} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="form-group">
          <Button variant="contained" color="primary" type="submit" disabled={!dirty}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    )
  }
}

export default withStyles(styles)(ViolationDetailForm)
