
import React from 'react'
import Link from 'react-router-dom/Link'
import Route from 'react-router-dom/Route'
import { OutboundLink } from 'react-ga'

const OptionalLink = props => {

    const {
        target,
        to,
        href,
        internal,
        eventLabel,
        activeClassName,
        style,
        ...otherProps,
    } = props

    var linkStyle = {
        position: 'relative',
        ...style,
    }

    if (href) {
        if (internal) {
            return <a style={linkStyle} href={href} {...otherProps} />
        } else {
            return <OutboundLink style={linkStyle} eventLabel={eventLabel || otherProps.title || href} to={href} target={target || '_blank'} {...otherProps} />
        }
    }

    if (to) {

        if (activeClassName) {

            const {
                className,
                ...finalProps,
            } = otherProps

            return (
                <Route path={to}>
                    {({ match }) => {
                        var finalClassName = match ? `${className || ''} ${activeClassName || ''}` : className
                        return <Link style={linkStyle} to={to} className={finalClassName} {...finalProps} />
                    }}
                </Route>
            )
        }

        return <Link style={linkStyle} to={to} {...otherProps} />
    }

    return <span style={linkStyle} {...otherProps} />
}

export default OptionalLink
