import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Button, TextField, Card, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Add as AddIcon, CropSquare as CropSquareIcon, ChangeHistory as ChangeHistoryIcon, Delete } from '@material-ui/icons'
import { isDrawZones, onChangeTypeDraw, isDrawArrow, removeDirect, removeShape } from 'actions/draw_zones/action_draw'
import _ from 'lodash'
import Select from 'react-select'

import { ZoneControl, NoOptionsMessage } from 'components/Select/SelectControl'

const styles = {
  root: {
    width: '100%',
    textAlign: 'center',
    // padding: '10px',
  },
  items: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px 0',
    alignItems: 'center',
  },
  cardRoot: {
    width: '100%',
  },
  cardItem: {
    display: 'flex',
    padding: '0 10px',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderLeft: "4px solid #1a237e",
  },
  cardItemActive: {
    display: 'flex',
    padding: '0 10px',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid #1a237e',
  },
  cardDirectActive: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 10px 10px 30px',
    borderLeft: '4px solid #1a237e',
  },
  cardDirect: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 10px 10px 30px',
  },
  boxAdd: {},
  customAutoCom: {
    margin: '10px 0',
  },
  button: {
    textTransform: 'initial',
    marginLeft: 10,
  },
  buttonActive: {
    background: '#e0e0e0',
    textTransform: 'initial',
    marginLeft: 10,
    border: '1px solid transparent !important',
  },
  typeDraw: {
    width: '30%',
  },
  buttons: {
    marginTop: 10,
    textAlign: 'left',
  },
  title: {
    color: '#1a237e',
    fontWeight: 'bold',
    transition: '.3s ease-in-out',
  },
  textField: {
    fontSize: '0.875rem',
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
}

const selectStyles = {
  menu: (styles) => {
    return {
      ...styles,
      zIndex: 2,
    }
  },
}

class AddTypeZone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isButtonOpen: true,
      isAutocompleteOpen: false,
      tags: [],
      tag: [],
      typeDraw: [],
      dataZoneDrew: null,
    }
  }

  componentDidMount = () => {
    const { zoneOptions, zonesDrew } = this.props

    let dataDrew = []
    if (!_.isEmpty(zonesDrew)) {
      console.log('zonesDrew', zonesDrew)

      zonesDrew.zones.map((dataZoneOption) => {
        let item = zoneOptions.filter((zoneOption) => zoneOption.id === dataZoneOption.id)
        item[0].vertices = dataZoneOption.vertices
        if (_.isEmpty(item[0].arrow)) {
          item[0].arrow = dataZoneOption.arrow
        }
        dataDrew.push(item[0])
      })
    }
    if (dataDrew) {
      this.setState({
        tags: dataDrew,
      })
    }
  }

  handleAutocomplete = () => {
    this.setState({
      isButtonOpen: !this.state.isButtonOpen,
      isAutocompleteOpen: !this.state.isAutocompleteOpen,
    })
  }

  onTagsChange = (values) => {
    console.log(values)
    this.setState({
      tag: values,
    })
  }

  onTypeDrawChange = (e, value) => {
    this.setState({
      typeDraw: value,
    })
  }

  isDrawShape = (e, value) => {
    this.props.isDrawZones(value)
  }

  isDrawArrow = (e, value) => {
    this.props.isDrawArrow(value)
  }

  handleChangeTypeZone = (e) => {
    this.props.onChangeTypeDraw(e.target.value)
  }

  handleAddDataAutoComplete = () => {
    let { tags, tag } = this.state

    this.setState({
      ...this.state,
      tags: [...tags, ...tag],
      tag: [],
    })
  }

  handleDeleteZone = (id) => {
    const { tags } = this.state
    const newTags = tags.filter((item) => item.id !== id)

    this.setState({
      ...this.state,
      tags: newTags,
    })

    this.props.removeShape(id)
  }

  handleRemoveDirect = (id) => {
    this.props.removeDirect(id)
  }

  render() {
    let { classes, controlDraw, controlDrawDirect, zoneOptions, shapeSelected } = this.props
    let { isButtonOpen, isAutocompleteOpen, tags, tag } = this.state
    let zoneSelectOptions = zoneOptions.map((item) => {
      return {
        ...item,
        value: item.type,
        label: item.title,
      }
    })

    for (let i = 0; i < tags.length; i++) {
      zoneSelectOptions = zoneSelectOptions.filter((item) => item.type !== tags[i].type)
    }

    if (shapeSelected) {
      shapeSelected = shapeSelected.replace(/__|_/gi, '')
    }

    return (
      <div className={classes.root}>
        {tags.length
          ? tags.map((tag) => (
              <div className={classes.items} key={tag.id}>
                <Card className={classes.cardRoot}>
                  <div className={Number(shapeSelected) === tag.id ? classes.cardItemActive : classes.cardItem}>
                    <Typography className={Number(shapeSelected) === tag.id ? classes.title : null}>{tag.title}</Typography>
                    <div>
                      <Button
                        variant={controlDraw.id === tag.id && controlDraw.status ? 'outlined' : 'contained'}
                        size="small"
                        className={(controlDraw.id === tag.id && controlDraw.status === 2) || tag.vertices.length ? classes.buttonActive : classes.button}
                        color="primary"
                        disabled={!isButtonOpen || (controlDraw.id === tag.id && controlDraw.status === 2) || tag.vertices.length}
                        onClick={(e) => this.isDrawShape(e, tag)}
                      >
                        {(controlDraw.id === tag.id && controlDraw.status === 2) || tag.vertices.length
                          ? 'Vẽ xong'
                          : controlDraw.id === tag.id && controlDraw.status === 1
                          ? 'Đang vẽ'
                          : 'Vẽ'}
                      </Button>
                      <IconButton onClick={() => this.handleDeleteZone(tag.id)}>
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                  {tag.direct === 'yes' && tag.vertices.length ? (
                    <div className={classes.cardDirect}>
                      {' '}
                      <Typography>Hướng</Typography>
                      <div>
                        <Button
                          variant={controlDrawDirect.id === tag.id && controlDrawDirect.status ? 'outlined' : 'contained'}
                          size="small"
                          className={
                            (controlDrawDirect.id === tag.id && controlDrawDirect.status === 2) || tag.arrow.length ? classes.buttonActive : classes.button
                          }
                          color="primary"
                          disabled={!isButtonOpen || (controlDrawDirect.id === tag.id && controlDrawDirect.status === 2) || tag.arrow.length}
                          onClick={(e) => this.isDrawArrow(e, tag)}
                        >
                          {(controlDrawDirect.id === tag.id && controlDrawDirect.status === 2) || tag.arrow.length
                            ? 'Vẽ xong'
                            : controlDrawDirect.id === tag.id && controlDrawDirect.status === 1
                            ? 'Đang vẽ'
                            : 'Vẽ'}
                        </Button>{' '}
                        {tag.arrow.length ? (
                          <IconButton onClick={() => this.handleRemoveDirect(tag.id)}>
                            <Delete />
                          </IconButton>
                        ) : null}
                      </div>
                    </div>
                  ) : null}{' '}
                </Card>
              </div>
            ))
          : null}

        {/* ============================================================================== */}

        {isAutocompleteOpen ? (
          <div className={classes.boxAdd}>
            {/* <Autocomplete
              multiple
              className={classes.customAutoCom}
              disableCloseOnSelect
              id="combo-box-demo"
              size="small"
              options={zoneOptions}
              filterOptions={(options, params) => {
                for (let i = 0; i < tags.length; i++) {
                  options = options.filter((item) => item.type !== tags[i].type)
                }
                return options
              }}
              onChange={this.onTagsChange}
              getOptionLabel={(option) => option.title}
              value={tag}
              renderInput={(params) => <TextField {...params} label="Vùng nhận dạng" variant="outlined" />}
            /> */}
            <Select
              classes={classes}
              components={{
                Control: ZoneControl,
                NoOptionsMessage: NoOptionsMessage,
              }}
              isClearable
              isMulti
              options={zoneSelectOptions}
              placeholder={false}
              styles={selectStyles}
              value={tag}
              onChange={this.onTagsChange}
            />
            <div className={classes.buttons}>
              <Button variant="contained" color="primary" disabled={!tag.length} style={{ marginRight: 10 }} onClick={this.handleAddDataAutoComplete}>
                Thêm
              </Button>
              <Button variant="contained" color="default" onClick={this.handleAutocomplete}>
                Hủy
              </Button>
            </div>
          </div>
        ) : null}

        {isButtonOpen ? (
          <div className={classes.buttons}>
            <Button size="small" variant="contained" color="primary" onClick={this.handleAutocomplete}>
              <AddIcon />
              <Typography component="p" style={{ textTransform: 'initial', color: 'white' }}>
                {' '}
                Thêm mới vùng nhận dạng{' '}
              </Typography>
            </Button>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    controlDraw: state.drawZones.controlDraw,
    controlDrawDirect: state.drawZones.controlDrawDirect,
    zoneOptions: state.drawZones.zoneOptions,
    shapeSelected: state.drawZones.shapeSelected,
    zonesDrew: state.cameras.editCam.functions,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isDrawZones: (value) => {
      dispatch(isDrawZones(value))
    },
    onChangeTypeDraw: (name) => {
      dispatch(onChangeTypeDraw(name))
    },
    isDrawArrow: (value) => {
      dispatch(isDrawArrow(value))
    },
    removeDirect: (id) => {
      dispatch(removeDirect(id))
    },
    removeShape: (type) => {
      dispatch(removeShape(type))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddTypeZone))
