import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormControl,
  FormGroup,
  Switch,
  CircularProgress,
  Divider,
} from '@material-ui/core'
import { Remove, Add } from '@material-ui/icons'
import { red, green, yellow } from '@material-ui/core/colors'
import { Alert } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import DateFnsUtils from '@date-io/date-fns'
import { InlineTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers'
import viLocale from 'date-fns/locale/vi'

const styles = () => ({
  root: {
    padding: 16,
  },
  row: { display: 'flex', flexDirection: 'row' },
  formGroup: {
    marginBottom: 8,
    marginRight: 8,
  },
  inputProps: {
    width: 100,
    textAlign: 'center',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
  },
  labelText: {
    display: 'flex',
    alignItems: 'center',
  },
  light: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    marginRight: 4,
  },
  redLight: {
    background: red[900],
  },
  greenLight: {
    background: green[800],
  },
  yellowLight: {
    background: yellow[800],
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellSpan: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  inputPropsTable: {
    width: 70,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: 400,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 500,
  },
  sectionContent: {
    marginLeft: 32,
  },
  phaseName: {
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorMessages: {
    color: 'red',
  },
  button: {
    width: 100,
  },
  formControl: {
    marginLeft: 32,
  },
})

class ModeForm extends React.Component {
  componentDidMount() {}

  handleIconButtonClick = (event, name, type) => {
    const { values, setFieldValue } = this.props
    let offset = 0
    if (type === 'sub') {
      offset = -1
    } else if (type === 'add') {
      offset = 1
    }
    const path = _.toPath(name)
    let p = 0,
      obj = values
    while (obj && p < path.length) {
      obj = obj[path[p++]]
    }

    setFieldValue(name, obj + offset > 0 ? obj + offset : 0)
  }

  handleInputChange = (event) => {
    const { setFieldValue } = this.props
    const value = parseInt(event.target.value) || 0
    console.log(value)
    setFieldValue(event.target.name, value)
  }

  handleSwitchChange = (event, name) => {
    this.props.setFieldValue(name, event.target.checked)
  }

  handlePickerChange = (date, name) => {
    this.props.setFieldValue(name, date)
  }

  handleRadioChange = (event) => {
    this.props.setFieldValue(event.target.name, event.target.value)
  }

  render() {
    const { classes, values, handleSubmit, errorConfig, isEditingConfig } = this.props
    if (_.isEmpty(values)) {
      return null
    }

    return (
      <Scrollbars style={{ width: '100%', height: '100%' }}>
        <form className={classes.root} onSubmit={handleSubmit}>
          <div className={classes.section}>
            <Typography className={classes.sectionTitle}>Tham số mặc định</Typography>
            <div className={classes.sectionContent}>
              {values.static.map((phase, index) => {
                return (
                  <div key={index}>
                    <Typography className={classes.phaseName}>{phase.phase}</Typography>
                    <div className={classes.row}>
                      <div className={classes.formGroup}>
                        <TextField
                          label={
                            <div className={classes.label}>
                              <div className={classNames(classes.light, classes.redLight)}></div>
                              <div className={classes.labelText}>Đèn đỏ tối đa</div>
                            </div>
                          }
                          variant="outlined"
                          type="number"
                          className={classes.textField}
                          InputProps={{
                            inputProps: {
                              min: '0',
                              max: '9999',
                              className: classes.inputProps,
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].max_red`, 'sub')}
                                >
                                  <Remove />
                                </IconButton>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].max_red`, 'add')}
                                >
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name={`static[${index}].max_red`}
                          value={values.static[index].max_red}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          label={
                            <div className={classes.label}>
                              <div className={classNames(classes.light, classes.greenLight)}></div>
                              <div className={classes.labelText}>Đèn xanh tối thiểu</div>
                            </div>
                          }
                          variant="outlined"
                          type="number"
                          className={classes.textField}
                          InputProps={{
                            inputProps: {
                              min: '0',
                              max: '9999',
                              className: classes.inputProps,
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].min_green`, 'sub')}
                                >
                                  <Remove />
                                </IconButton>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].min_green`, 'add')}
                                >
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name={`static[${index}].min_green`}
                          value={values.static[index].min_green}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          label={
                            <div className={classes.label}>
                              <div className={classNames(classes.light, classes.redLight)}></div>
                              <div className={classes.labelText}>Đèn đỏ mặc định</div>
                            </div>
                          }
                          variant="outlined"
                          type="number"
                          className={classes.textField}
                          InputProps={{
                            inputProps: {
                              min: '0',
                              max: '9999',
                              className: classes.inputProps,
                            },
                            startAdornment: (
                              <InputAdornment position="start" className={classes.inputAdornment}>
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].red`, 'sub')}
                                >
                                  <Remove />
                                </IconButton>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].red`, 'add')}
                                >
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name={`static[${index}].default_red`}
                          value={values.static[index].red}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          label={
                            <div className={classes.label}>
                              <div className={classNames(classes.light, classes.yellowLight)}></div>
                              <div className={classes.labelText}>Đèn vàng mặc định</div>
                            </div>
                          }
                          variant="outlined"
                          type="number"
                          className={classes.textField}
                          InputProps={{
                            inputProps: {
                              min: '0',
                              max: '9999',
                              className: classes.inputProps,
                            },
                            startAdornment: (
                              <InputAdornment position="start" className={classes.inputAdornment}>
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].yellow`, 'sub')}
                                >
                                  <Remove />
                                </IconButton>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].yellow`, 'add')}
                                >
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name={`static[${index}].yellow`}
                          value={values.static[index].yellow}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <TextField
                          label={
                            <div className={classes.label}>
                              <div className={classNames(classes.light, classes.greenLight)}></div>
                              <div className={classes.labelText}>Đèn xanh mặc định</div>
                            </div>
                          }
                          variant="outlined"
                          type="number"
                          className={classes.textField}
                          InputProps={{
                            inputProps: {
                              min: '0',
                              max: '9999',
                              className: classes.inputProps,
                            },
                            startAdornment: (
                              <InputAdornment position="start" className={classes.inputAdornment}>
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].green`, 'sub')}
                                >
                                  <Remove />
                                </IconButton>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  className={classes.iconButton}
                                  onClick={(event) => this.handleIconButtonClick(event, `static[${index}].green`, 'add')}
                                >
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name={`static[${index}].green`}
                          value={values.static[index].green}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <Divider />
          <div className={classes.section}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography className={classes.sectionTitle} style={{ marginBottom: '0.5rem' }}>
                Chế độ thông minh
              </Typography>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={values.intelligent.enabled}
                        onChange={(event) => this.handleSwitchChange(event, 'intelligent.enabled')}
                      />
                    }
                    label="Bật"
                  />
                </FormGroup>
              </FormControl>
            </div>
            <div className={classes.sectionContent}>
              {/* <div>
                <Typography className={classes.title}>Tham số đầu vào - Độ dài dòng chờ (mét)</Typography>
                <div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Rất ngắn</TableCell>
                        <TableCell align="center">Ngắn</TableCell>
                        <TableCell align="center">Trung bình</TableCell>
                        <TableCell align="center">Dài</TableCell>
                        <TableCell align="center">Rất dài</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.intelligent.input.map((phase, index1) => (
                        <TableRow key={index1}>
                          <TableCell>{phase.phase}</TableCell>
                          {phase.params.map((item, index2) => {
                            if (_.has(item, 'min') && _.has(item, 'max')) {
                              return (
                                <TableCell align="center" key={index2}>
                                  <div className={classes.tableCell}>
                                    <span className={classes.tableCellSpan}>Từ</span>
                                    <TextField
                                      variant="outlined"
                                      type="number"
                                      InputProps={{
                                        inputProps: {
                                          min: '0',
                                          className: classes.inputPropsTable,
                                        },
                                      }}
                                      name={`intelligent.input[${index1}].params[${index2}].min`}
                                      value={item.min}
                                      onChange={this.handleInputChange}
                                      disabled={!values.intelligent.enabled}
                                    />
                                    <span className={classes.tableCellSpan}>đến</span>
                                    <TextField
                                      variant="outlined"
                                      type="number"
                                      InputProps={{
                                        inputProps: {
                                          min: '0',
                                          className: classes.inputPropsTable,
                                        },
                                      }}
                                      name={`intelligent.input[${index1}].params[${index2}].max`}
                                      value={item.max}
                                      onChange={this.handleInputChange}
                                      disabled={!values.intelligent.enabled}
                                    />
                                  </div>
                                </TableCell>
                              )
                            } else if (!_.has(item, 'max') && _.has(item, 'min')) {
                              return (
                                <TableCell align="center" key={index2}>
                                  <div className={classes.tableCell}>
                                    <span className={classes.tableCellSpan}>Trên</span>
                                    <TextField
                                      variant="outlined"
                                      type="number"
                                      InputProps={{
                                        inputProps: {
                                          min: '0',
                                          className: classes.inputPropsTable,
                                        },
                                      }}
                                      name={`intelligent.input[${index1}].params[${index2}].min`}
                                      value={item.min}
                                      onChange={this.handleInputChange}
                                      disabled={!values.intelligent.enabled}
                                    />
                                  </div>
                                </TableCell>
                              )
                            } else if (_.has(item, 'max') && !_.has(item, 'min')) {
                              return (
                                <TableCell align="center" key={index2}>
                                  <div className={classes.tableCell}>
                                    <span className={classes.tableCellSpan}>Dưới</span>
                                    <TextField
                                      variant="outlined"
                                      type="number"
                                      InputProps={{
                                        inputProps: {
                                          min: '0',
                                          className: classes.inputPropsTable,
                                        },
                                      }}
                                      name={`intelligent.input[${index1}].params[${index2}].max`}
                                      value={item.max}
                                      onChange={this.handleInputChange}
                                      disabled={!values.intelligent.enabled}
                                    />
                                  </div>
                                </TableCell>
                              )
                            }
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Typography className={classes.title}>Tham số đầu ra - Thời gian đèn xanh (giây)</Typography>
                <div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Rất ngắn</TableCell>
                        <TableCell align="center">Ngắn</TableCell>
                        <TableCell align="center">Trung bình</TableCell>
                        <TableCell align="center">Dài</TableCell>
                        <TableCell align="center">Rất dài</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.intelligent.output.map((phase, index1) => (
                        <TableRow key={index1}>
                          <TableCell>{phase.phase}</TableCell>
                          {phase.params.map((item, index2) => {
                            return (
                              <TableCell align="center" key={index2}>
                                <div className={classes.tableCell}>
                                  <TextField
                                    variant="outlined"
                                    type="number"
                                    InputProps={{
                                      inputProps: {
                                        min: '0',
                                        className: classes.inputPropsTable,
                                      },
                                    }}
                                    name={`intelligent.output[${index1}].params[${index2}].value`}
                                    value={item.value}
                                    onChange={this.handleInputChange}
                                    disabled={!values.intelligent.enabled}
                                  />
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div> */}
              <div>
                <div className={classes.row}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                    <div className={classes.formGroup}>
                      <InlineTimePicker
                        disabled={!values.intelligent.enabled}
                        ampm={false}
                        label="Bắt đầu"
                        variant="outlined"
                        format="HH:mm"
                        name="intelligent.start"
                        value={values.intelligent.start}
                        onChange={(date) => this.handlePickerChange(date, 'intelligent.start')}
                      />
                    </div>
                    <div className={classes.formGroup}>
                      <InlineTimePicker
                        disabled={!values.intelligent.enabled}
                        ampm={false}
                        label="Kết thúc"
                        variant="outlined"
                        format="HH:mm"
                        name="intelligent.end"
                        value={values.intelligent.end}
                        onChange={(date) => this.handlePickerChange(date, 'intelligent.end')}
                      />
                    </div>
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className={classes.section}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography className={classes.sectionTitle} style={{ marginBottom: '0.5rem' }}>
                Chế độ đèn vàng
              </Typography>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        className={classes.switch}
                        checked={values.yellow_blink.enabled}
                        onChange={(event) => this.handleSwitchChange(event, 'yellow_blink.enabled')}
                      />
                    }
                    label="Bật"
                  />
                </FormGroup>
              </FormControl>
            </div>

            <div className={classes.sectionContent}>
              <div>
                <RadioGroup className={classes.radioGroup} name="yellow_blink.mode" value={values.yellow_blink.mode} onChange={this.handleRadioChange}>
                  <FormControlLabel value="static" control={<Radio color="primary" disabled={!values.yellow_blink.enabled} />} label="Cố định" />
                  <div className={classes.row} style={{ marginLeft: 24 }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                      <div className={classes.formGroup}>
                        <InlineTimePicker
                          ampm={false}
                          label="Bắt đầu"
                          variant="outlined"
                          format="HH:mm"
                          value={values.yellow_blink.start}
                          name="yellow_blink.start"
                          onChange={(date) => this.handlePickerChange(date, 'yellow_blink.start')}
                          disabled={values.yellow_blink.mode !== 'static' || !values.yellow_blink.enabled}
                        />
                      </div>
                      <div className={classes.formGroup}>
                        <InlineTimePicker
                          ampm={false}
                          label="Kết thúc"
                          variant="outlined"
                          format="HH:mm"
                          value={values.yellow_blink.end}
                          name="yellow_blink.end"
                          onChange={(date) => this.handlePickerChange(date, 'yellow_blink.end')}
                          disabled={values.yellow_blink.mode !== 'static' || !values.yellow_blink.enabled}
                        />
                      </div>
                    </MuiPickersUtilsProvider>
                  </div>
                  <FormControlLabel value="intelligent" control={<Radio color="primary" disabled={!values.yellow_blink.enabled} />} label="Thông minh" />
                  <div className={classes.row} style={{ marginLeft: 24 }}>
                    <div className={classes.formGroup}>
                      <TextField
                        label="Ngưỡng lưu lượng (xe/phút)"
                        variant="outlined"
                        type="number"
                        name="yellow_blink.flow_threshold"
                        InputProps={{
                          inputProps: {
                            min: '0',
                            // max: '9999',
                          },
                        }}
                        value={values.yellow_blink.flow_threshold}
                        onChange={this.handleInputChange}
                        disabled={values.yellow_blink.mode !== 'intelligent' || !values.yellow_blink.enabled}
                      />
                    </div>
                    <div className={classes.formGroup}>
                      <TextField
                        variant="outlined"
                        type="number"
                        name="threshold"
                        InputProps={{
                          inputProps: {
                            min: '0',
                            // max: '9999',
                          },
                        }}
                        label="Ngưỡng thời gian (phút)"
                        name="yellow_blink.time_threshold"
                        value={values.yellow_blink.time_threshold}
                        onChange={this.handleInputChange}
                        disabled={values.yellow_blink.mode !== 'intelligent' || !values.yellow_blink.enabled}
                      />
                    </div>
                  </div>
                  <FormControlLabel value="immediate" control={<Radio color="primary" disabled={!values.yellow_blink.enabled} />} label="Ngay lập tức" />
                  <div></div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div>
            <div className={classes.error}>
              {/* <span className={classes.errorMessages}>{errorConfig ? errorConfig[0] : null}</span> */}
              {!_.isEmpty(errorConfig) && <Alert color="danger">{errorConfig[0]}</Alert>}
            </div>
            <Button variant="contained" color="primary" type="submit" disabled={isEditingConfig} className={classes.button}>
              {isEditingConfig ? <CircularProgress size={24} /> : 'Áp dụng'}
            </Button>
          </div>
        </form>
      </Scrollbars>
    )
  }
}

const mapStateToProps = ({ trafficControl }) => {
  return {
    errorConfig: trafficControl.error,
    isEditingConfig: trafficControl.api.isEditingConfig,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ModeForm))
