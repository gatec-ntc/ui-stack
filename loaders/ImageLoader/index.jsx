
import React from 'react'
import PropTypes from 'prop-types'

import { loadImage } from '../../util/image'
import { isPrerendering } from '../../util/prerender'

import errorImg from './error.svg'
import loadingImg from './loading.svg'
import placeholderImg from './placeholder.svg'

import styles from './ImageLoader.scss'

const defaultImageSize = 60

class ImageLoader extends React.Component {

    static propTypes = {
        src: PropTypes.string,
        loadingSrc: PropTypes.string,
        errorSrc: PropTypes.string,
        defaultSrc: PropTypes.string,
        defaultSize: PropTypes.number,
        asBackground: PropTypes.bool,
        disableDefault: PropTypes.bool,
        avoidMaxHeight: PropTypes.bool,
    }

    state = {
        loading: !!this.props.src && !isPrerendering(),
        width: this.props.defaultSize || defaultImageSize,
        height: this.props.defaultSize || defaultImageSize,
    }

    componentDidMount() {

        if (!this.state.loading)
            return

        this.load()

    }

    load() {

        if (!this.state.loading) {
            this.setState({
                loading: true,
            })
        }

        this.imageRequest = loadImage(this.getImageUrl())

        this.imageRequest
            .then(image => {
                this.setState({
                    loading: false,
                    width: image.width,
                    height: image.height,
                })
            })
            .catch(error => {
                if (error.isAborted)
                    return
                this.setState({
                    loading: false,
                    error: true,
                })
            })

    }

    componentWillUnmount() {
        if (this.imageRequest && this.imageRequest.abort)
            this.imageRequest.abort()
    }

    getImageUrl() {
        const { src, defaultSrc, disableDefault } = this.props
        return src || (disableDefault ? '' : defaultSrc || placeholderImg)
    }

    getLoadingUrl() {
        const { loadingSrc } = this.props
        return loadingSrc || loadingImg
    }

    getErrorUrl() {
        const { errorSrc } = this.props
        return errorSrc || errorImg
    }
    render() {

        const {
            src, // eslint-disable-line no-unused-vars
            errorSrc, // eslint-disable-line no-unused-vars
            loadingSrc, // eslint-disable-line no-unused-vars
            defaultSrc, // eslint-disable-line no-unused-vars
            disableDefault, // eslint-disable-line no-unused-vars
            children,
            defaultSize,
            className,
            asBackground,
            avoidMaxHeight,
            ...otherProps,
        } = this.props

        const {
            loading,
            height,
            error,
        } = this.state

        const imageSrc = error ? this.getErrorUrl() : (loading ? this.getLoadingUrl() : this.getImageUrl())

        if (asBackground) {

            var bgImgStyles = {}

            if (imageSrc)
                bgImgStyles.backgroundImage = `url(${imageSrc})`

            const bgClassName = `${loading || error ? styles.bgLoading : styles.bgImg} ${className || ''}`

            return (
                <span {...otherProps} className={bgClassName} style={bgImgStyles}>
                    {otherProps.dangerouslySetInnerHTML ? null : (children || <img src={imageSrc} className={styles.hiddenImg} />)}
                </span>
            )
        }

        delete otherProps.dangerouslySetInnerHTML

        var imgStyles = {}

        if (!avoidMaxHeight || loading)
            imgStyles.maxHeight = `${height || defaultSize || defaultImageSize}px`

        const imgClassName = `${loading || error ? styles.loading : styles.img} ${className || ''}`

        return <img {...otherProps} className={imgClassName} style={imgStyles} src={imageSrc} />
    }

}

export default ImageLoader
