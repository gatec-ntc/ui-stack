
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
        handleProps: PropTypes.func,
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

        if (!this.state.loading || this.state.error) {
            this.setState({
                loading: true,
                error: null,
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
                    error: error,
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

    handleImageProps(imgProps) {

        const {
            handleProps, // eslint-disable-line no-unused-vars
        } = this.props

        return handleProps ? handleProps(imgProps, this.state) : imgProps
    }

    render() {

        const {
            /* eslint-disable no-unused-vars */
            src,
            errorSrc,
            loadingSrc,
            defaultSrc,
            disableDefault,
            handleProps,
            /* eslint-enable no-unused-vars */
            defaultSize,
            asBackground,
            avoidMaxHeight,
            className,
            style = {},
            children,
            ...otherProps,
        } = this.props

        const {
            loading,
            height,
            error,
        } = this.state

        const imageSrc = error ? this.getErrorUrl() : (loading ? this.getLoadingUrl() : this.getImageUrl())

        if (asBackground) {

            var bgImgStyles = {
                ...style,
            }

            if (imageSrc)
                bgImgStyles.backgroundImage = `url(${imageSrc})`

            const bgClassName = `${loading || error ? styles.bgLoading : styles.bgImg} ${className || ''}`

            const bgImgProps = {
                className: bgClassName,
                style: bgImgStyles,
                children: otherProps.dangerouslySetInnerHTML ? null : (children || <img src={imageSrc} className={styles.hiddenImg} />),
                ...otherProps,
            }

            return <span {...this.handleImageProps(bgImgProps)} />
        }

        delete otherProps.dangerouslySetInnerHTML

        var imgStyles = {
            ...style,
        }

        if (!avoidMaxHeight || loading)
            imgStyles.maxHeight = `${height || defaultSize || defaultImageSize}px`

        const imgClassName = `${loading || error ? styles.loading : styles.img} ${className || ''}`

        const imgProps = {
            className: imgClassName,
            style: imgStyles,
            src: imageSrc,
            ...otherProps,
        }

        return <img {...this.handleImageProps(imgProps)} />
    }

}

export default ImageLoader
