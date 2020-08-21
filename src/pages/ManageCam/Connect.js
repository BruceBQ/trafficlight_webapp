import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'
import isEmpty from 'lodash/isEmpty'

import { withStyles } from '@material-ui/core/styles'
import { Scrollbars } from 'react-custom-scrollbars'
import TextInput from '../../components/TextInput'
import {
  changeAddCameraParams,
  // connectCamera,
  connectToCam,
} from '../../actions/action_camera'
import { toggleAddCamMap } from '../../actions/action_map'
import { getDataBeforeConnect } from '../../actions/action_manageCam'
import { showLoadingModal } from '../../actions/action_modal'
import { getAllProvinces } from '../../actions/action_political'
import {
  ProvinceControl,
  DistrictControl,
  CommuneControl,
  GroupControl,
  NoOptionsMessage,
} from '../../components/Select/SelectControl'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formContent: {
    flexGrow: 1,
  },
  formGroup: {
    marginTop: 10,
    marginRight: 10,
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
})

const selectStyles = {
  menu: styles => {
    return {
      ...styles,
      zIndex: 2,
    }
  },
}

class Connect extends Component {
  state = {
    value: '',
  }
  componentDidMount() {
    this.props.getDataBeforeConnect()
    // this.props.getAllProvinces()
    this.props.toggleAddCamMap()
  }
  componentWillUnmount() {
    this.props.toggleAddCamMap()
  }
  onChange = name => event => {
    this.props.changeAddCameraParams({ [name]: event.target.value })
  }
  changeSelect = name => value => {
    console.log(value)
    this.props.changeAddCameraParams({ [name]: value })
    // if(!isEmpty(value)){
    // }
  }

  handleSubmit = e => {
    // this.props.showLoadingModal("Đang kết nối tới camera")
    console.log('i am here')
    const {
      // id,
      name,
      lat,
      lng,
      province,
      district,
      commune,
      group,
      ip,
      port,
      cam_user,
      cam_pass,
    } = this.props.addCamera
    this.props.connectToCam({
      // id,
      name,
      lat,
      lng,
      province,
      district,
      commune,
      group,
      ip,
      port,
      cam_user,
      cam_pass,
    })
  }
  render() {
    const {
      classes,
      addCamera,
      errors = {},
      provinceOptions = [],
      districtOptions = [],
      communeOptions = [],
      groupOptions = [],
    } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.formContent}>
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            <div className={classes.formGroup}>
              <div className="form-group">
                <TextInput
                  label="Tên camera"
                  error={!isEmpty(errors.name)}
                  fullWidth
                  value={addCamera.name}
                  onChange={this.onChange('name')}
                  helperText={!isEmpty(errors.name) ? errors.name : ''}
                />
              </div>
              <div className="form-group">
                <TextInput
                  disabled
                  label="Vĩ độ"
                  type="number"
                  value={addCamera.lat}
                  style={{
                    marginRight: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  error={!isEmpty(errors.lat)}
                  helperText={!isEmpty(errors.lat) ? errors.lat : ''}
                />
                <TextInput
                  disabled
                  label="Kinh độ"
                  type="number"
                  value={addCamera.lng}
                  style={{
                    marginLeft: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  error={!isEmpty(errors.lng)}
                  helperText={!isEmpty(errors.lng) ? errors.lng : ''}
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
                  onChange={this.changeSelect('province')}
                  value={addCamera.province}
                  error={!isEmpty(errors.province)}
                  helperText={!isEmpty(errors.province) ? errors.province : ''}
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
                  onChange={this.changeSelect('district')}
                  value={addCamera.district}
                  error={!isEmpty(errors.district)}
                  helperText={!isEmpty(errors.district) ? errors.district : ''}
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
                  onChange={this.changeSelect('commune')}
                  value={addCamera.commune}
                  error={!isEmpty(errors.commune)}
                  helperText={!isEmpty(errors.commune) ? errors.commune : ''}
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
                  onChange={this.changeSelect('group')}
                  value={addCamera.group}
                  error={!isEmpty(errors.group)}
                  helperText={!isEmpty(errors.group) ? errors.group : ''}
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
                  onChange={this.changeSelect('group')}
                  value={addCamera.group}
                  error={!isEmpty(errors.group)}
                  helperText={!isEmpty(errors.group) ? errors.group : ''}
                />
                {!isEmpty(errors.group) && (
                  <FormHelperText
                    error={true}
                    className={classes.formHelperText}
                  >
                    {!isEmpty(errors.group) ? errors.group : ''}
                  </FormHelperText>
                )}
              </div>
              <div className="form-group">
                <TextInput
                  label="Địa chỉ IP"
                  value={addCamera.ip}
                  onChange={this.onChange('ip')}
                  style={{
                    marginRight: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  error={!isEmpty(errors.ip)}
                  helperText={!isEmpty(errors.ip) ? errors.ip : ''}
                />
                <TextInput
                  label="Port"
                  type="number"
                  value={addCamera.port}
                  onChange={this.onChange('port')}
                  className={classes.textField}
                  style={{
                    marginLeft: 5,
                    width: 'calc(50% - 5px)',
                  }}
                  error={!isEmpty(errors.port)}
                  helperText={!isEmpty(errors.port) ? errors.port : ''}
                />
              </div>
              <div className="form-group">
                <TextInput
                  label="Tên đăng nhập"
                  fullWidth
                  value={addCamera.cam_user}
                  onChange={this.onChange('cam_user')}
                  error={!isEmpty(errors.cam_user)}
                  helperText={!isEmpty(errors.cam_user) ? errors.cam_user : ''}
                />
              </div>
              <div className="form-group">
                <TextInput
                  label="Mật khẩu"
                  type="password"
                  fullWidth
                  value={addCamera.cam_pass}
                  onChange={this.onChange('cam_pass')}
                  error={!isEmpty(errors.cam_pass)}
                  helperText={!isEmpty(errors.cam_pass) ? errors.cam_pass : ''}
                />
              </div>
            </div>
          </Scrollbars>
        </div>
        <div className={classes.actionButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
          >
            TIẾP THEO
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ cameras, political }) => ({
  addCamera: cameras.addCamera,
  errors: cameras.errors,
  provinceOptions: political.provinces,
  districtOptions: political.districts,
  communeOptions: political.communes,
  groupOptions: political.groups,
})
export default connect(
  mapStateToProps,
  {
    getAllProvinces,
    changeAddCameraParams,
    connectToCam,
    showLoadingModal,
    getDataBeforeConnect,
    toggleAddCamMap,
  },
)(withStyles(styles)(Connect))
