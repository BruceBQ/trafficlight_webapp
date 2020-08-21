import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import TextInput from '../../components/TextInput'
import {
  ProvinceControl,
  DistrictControl,
  CommuneControl,
  GroupControl,
  NoOptionsMessage,
  Option,
} from '../../components/Select/SelectControl'
import { fetchDistricts, fetchCommunes } from '../../actions/action_political'

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formContent: {
    flexGrow: 1,
  },
  formGroup: {
    marginTop: 5,
    padding: '10px',
  },
  actionButton: {
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 5,
  },
  formHelperText: {
    margin: '8px 12px 0',
  },
  textField: {
    fontSize: '0.875rem',
    width: 'calc(50% - 5px)',
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
  process: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
class EditConnectForm extends Component {
  _onTextInputChange = event => {
    this.props.handleChange(event)
  }

  _onSelectChange = name => value => {
    this.props.setFieldValue(name, value, true)
    switch (name) {
      case 'province':
        this.props.setFieldValue('district', null, true)
        this.props.setFieldValue('commune', null, true)
        if (_.has(value, 'value')) {
          this.props.fetchDistricts(value.value)
        }
        break
      case 'district':
        this.props.setFieldValue('commune', null, true)
        if (_.has(value, 'value')) {
          this.props.fetchCommunes(value.value)
        }
        break
      default:
        break
    }
  }

  render() {
    const {
      classes,
      values,
      errors = {},
      isProcessing,
      provinceOptions = [],
      districtOptions = [],
      communeOptions = [],
      groupOptions = [],
      handleSubmit,
    } = this.props
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.formContent}>
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            <div className={classes.formGroup}>
              <div className="form-group">
                <TextInput
                  label="Tên camera"
                  name="name"
                  fullWidth
                  value={values.name}
                  onChange={this._onTextInputChange}
                  error={!_.isEmpty(errors.name)}
                  helperText={!_.isEmpty(errors.name) ? errors.name : ''}
                />
              </div>
              <div className="form-group">
                <TextInput
                  disabled
                  label="Vĩ độ"
                  type="number"
                  style={{
                    marginRight: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  value={values.lat}
                  error={!_.isEmpty(errors.lat)}
                  helperText={!_.isEmpty(errors.lat) ? errors.lat : ''}
                />
                <TextInput
                  disabled
                  label="Kinh độ"
                  type="number"
                  style={{
                    marginLeft: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  value={values.lng}
                  error={!_.isEmpty(errors.lng)}
                  helperText={!_.isEmpty(errors.lng) ? errors.lng : ''}
                />
              </div>
              <div className="form-group">
                <Select
                  classes={classes}
                  components={{
                    Control: ProvinceControl,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  placeholder={false}
                  options={provinceOptions}
                  styles={selectStyles}
                  onChange={this._onSelectChange('province')}
                  value={values.province}
                  error={!_.isEmpty(errors.province)}
                  helperText={
                    !_.isEmpty(errors.province) ? errors.province : ''
                  }
                />
              </div>
              <div className="form-group">
                <Select
                  classes={classes}
                  components={{
                    Control: DistrictControl,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  placeholder={false}
                  options={districtOptions}
                  styles={selectStyles}
                  onChange={this._onSelectChange('district')}
                  value={values.district}
                  error={!_.isEmpty(errors.district)}
                  helperText={
                    !_.isEmpty(errors.district) ? errors.district : ''
                  }
                />
              </div>
              <div className="form-group">
                <Select
                  classes={classes}
                  components={{
                    Control: CommuneControl,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  placeholder={false}
                  options={communeOptions}
                  styles={selectStyles}
                  onChange={this._onSelectChange('commune')}
                  value={values.commune}
                  error={!_.isEmpty(errors.commune)}
                  helperText={!_.isEmpty(errors.commune) ? errors.commune : ''}
                />
              </div>
              <div className="form-group">
                {/* <Creatable
                  classes={classes}
                  components={{
                    Control: GroupControl,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  isMulti
                  formatCreateLabel={inputValue => `Tạo mới "${inputValue}"`}
                  placeholder={false}
                  options={groupOptions}
                  styles={selectStyles}
                  onChange={this._onSelectChange('group')}
                  value={values.group}
                  error={!_.isEmpty(errors.group)}
                  helperText={!_.isEmpty(errors.group) ? errors.group : ''}
                /> */}
                <Select
                  classes={classes}
                  components={{
                    Control: GroupControl,
                    NoOptionsMessage: NoOptionsMessage,
                  }}
                  placeholder={false}
                  options={groupOptions}
                  styles={selectStyles}
                  onChange={this._onSelectChange('group')}
                  value={values.group}
                  error={!_.isEmpty(errors.group)}
                  helperText={!_.isEmpty(errors.group) ? errors.group : ''}
                />
              </div>
              <div className="form-group">
                <TextInput
                  label="Địa chỉ IP"
                  name="ip"
                  onChange={this._onTextInputChange}
                  style={{
                    marginRight: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  value={values.ip}
                  error={!_.isEmpty(errors.ip)}
                  helperText={!_.isEmpty(errors.ip) ? errors.ip : ''}
                />
                <TextInput
                  label="Port"
                  name="port"
                  type="number"
                  onChange={this._onTextInputChange}
                  className={classes.textField}
                  style={{
                    marginLeft: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  value={values.port}
                  error={!_.isEmpty(errors.port)}
                  helperText={!_.isEmpty(errors.port) ? errors.port : ''}
                />
              </div>
              <div className="form-group">
                <TextInput
                  label="Tên đăng nhập"
                  name="cam_user"
                  fullWidth
                  onChange={this._onTextInputChange}
                  value={values.cam_user}
                  error={!_.isEmpty(errors.cam_user)}
                  helperText={
                    !_.isEmpty(errors.cam_user) ? errors.cam_user : ''
                  }
                />
              </div>
              <div className="form-group">
                <TextInput
                  label="Mật khẩu"
                  name="cam_pass"
                  fullWidth
                  onChange={this._onTextInputChange}
                  value={values.cam_pass}
                  error={!_.isEmpty(errors.cam_pass)}
                  helperText={
                    !_.isEmpty(errors.cam_pass) ? errors.cam_pass : ''
                  }
                />
              </div>
            </div>
          </Scrollbars>
        </div>
        <div className={classes.actionButton}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isProcessing}
          >
            Lưu
            {isProcessing && (
              <CircularProgress
                size={24}
                className={classes.process}
                color="primary"
              />
            )}
          </Button>
        </div>
      </form>
    )
  }
}

const mapStateToProps = ({ cameras, political }) => ({
  errors: cameras.errors,
  isProcessing: cameras.isProcessing,
  provinceOptions: political.provinces,
  districtOptions: political.districts,
  communeOptions: political.communes,
  groupOptions: political.groups,
})

export default connect(mapStateToProps, { fetchDistricts, fetchCommunes })(
  withStyles(styles)(EditConnectForm),
)
