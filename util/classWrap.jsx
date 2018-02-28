
import React from 'react'

function classWrapFactory(Component, addClassName, addProps) {
    return function classWrap(props) {

        const {
            className,
            ...otherProps,
        } = props

        const newProps = {
            className: `${addClassName}${className ? ' ' + className : ''}`,
            ...otherProps,
            ...addProps,
        }

        return React.createElement(Component, newProps)
    }
}

export { classWrapFactory as classWrap }
