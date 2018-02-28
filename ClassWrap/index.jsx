
import React from 'react'

function ClassWrapFactory(Component, addClassName, addProps) {
    return function ClassWrap(props) {

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

export default ClassWrapFactory
export { ClassWrapFactory as ClassWrap }
