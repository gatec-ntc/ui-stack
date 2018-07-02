
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getElementX, getElementRightX, isOncreenX, getElementY, getElementBottomY, isOncreenY } from '../util/element'

export default class AutoPosition extends Component {

    static propTypes = {
        element: PropTypes.node,
        className: PropTypes.string,
        positionClassNames: PropTypes.shape({
            main: PropTypes.string,
            top: PropTypes.string,
            bottom: PropTypes.string,
            left: PropTypes.string,
            right: PropTypes.string,
        }),
        top: PropTypes.bool,
        left: PropTypes.bool,
        maxPositionUpdateTries: PropTypes.number,
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (prevState.wantedTop === nextProps.top && prevState.wantedLeft === nextProps.left)
            return null

        return {
            wantedTop: nextProps.top,
            wantedLeft: nextProps.left,
            top: nextProps.top || false,
            left: nextProps.left || false,
            positionUpdateCount: 0,
        }
    }

    state = {}

    container = null

    componentDidMount() {
        this.updatePosition()
    }

    componentDidUpdate() {
        this.updatePosition()
    }

    render() {

        const {
            element = 'span',
            /* eslint-disable no-unused-vars */
            positionClassNames,
            className,
            top,
            left,
            maxPositionUpdateTries,
            /* eslint-enable no-unused-vars */
            ...otherProps
        } = this.props

        const props = {
            ref: this.receiveRef,
            className: this.getClassName(),
            ...otherProps
        }

        return React.createElement(element, props)
    }

    getClassName() {

        const {
            positionClassNames = {},
            className,
        } = this.props

        const {
            top,
            left,
        } = this.state

        return `${positionClassNames.main || ''} ${top ? positionClassNames.top || '' : positionClassNames.bottom || ''} ${left ? positionClassNames.left || '' : positionClassNames.right || ''} ${className || ''}`
    }

    receiveRef = (ref) => {
        this.container = ref
    }

    updatePosition() {

        if (!this.container)
            return

        const {
            maxPositionUpdateTries = 2,
        } = this.props

        if (this.state.positionUpdateCount >= maxPositionUpdateTries)
            return

        var containerX = getElementX(this.container)
        var containerRightX = getElementRightX(this.container, containerX)
        var containerY = getElementY(this.container)
        var containerBottomY = getElementBottomY(this.container, containerY)

        var left = isOncreenX(containerX) && (this.state.left || !isOncreenX(containerRightX - 1))
        var top = isOncreenY(containerY) && (this.state.top || !isOncreenY(containerBottomY - 1))

        if (left !== this.state.left || top !== this.state.top) {
            this.setState(state => ({
                left,
                top,
                positionUpdateCount: state.positionUpdateCount + 1
            }))
        }

    }

}
