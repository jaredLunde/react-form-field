import React from 'react'
import PropTypes from 'prop-types'
import dummyChange from 'empty/function'


export default class FormField extends React.PureComponent {
  static propTypes = {
    validator: PropTypes.func,
    transformer: PropTypes.func,
    initialValue: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      value: props.initialValue,
      isValid: true
    }
  }

  field = null
  setRef = e => {
    if (e !== null) {
      this.field = e
      e.oninput = () => this.setValue(e.value)

      if (typeof this.props.innerRef === 'function') {
        this.props.innerRef(e)
      }
      else if (this.props.innerRef && this.props.innerRef.current !== void 0) {
        this.props.innerRef.current = e
      }
    }
  }

  setValue = value => {
    this.setState(
      (_, {validator, transformer}) => {
        value = transformer ? transformer(value) : value
        return {
          value,
          isValid: validator ? validator(value) : true
        }
      }
    )
  }

  reset = () => {
    const {field} = this
    field.value = ''
    return this.setValue(field.value)
  }

  focus = () => {
    this.field.focus()
  }

  render () {
    const {
      children,
      value,
      validator,
      transformer,
      initialValue,
      innerRef,
      onChange,
      ...props
    } = this.props
    const {setRef, reset, isValid} = this

    /** formFieldRef, isValid, reset, value */
    return children({
      formFieldRef: setRef,
      reset,
      value,
      onChange: onChange || dummyChange,
      ...props,
      ...this.state
    })
  }
}
