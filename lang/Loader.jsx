
import React from 'react'
import PropTypes from 'prop-types'
import { IntlProvider, injectIntl } from 'react-intl'

import { storeIntlReference } from './intl'
import { loadLanguage } from './loadUtils'

class LanguageLoader extends React.Component {

    static propTypes = {
        language: PropTypes.string,
        extraLoad: PropTypes.any,
    }

    state = {
        loading: false,
        loaded: false,
    }

    componentDidMount() {
        this.loadLanguage(this.props.language)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.language !== this.props.language) {
            this.language = null
            this.loadLanguage(nextProps.language)
        }
    }

    loadLanguage(language) {

        if (this.state.loading)
            return

        this.setState({
            loading: true,
            loaded: false
        })

        loadLanguage(language, this.props.extraLoad)
            .then(locale => {
                this.setState({
                    loading: false,
                    loaded: true,
                    language: locale.key,
                    messages: locale.messages,
                })
            })
            .catch(error => {
                if (error.isAborted)
                    return
                this.setState({
                    loading: false,
                    loaded: true,
                    language: language,
                    messages: {},
                    error: error,
                })
            })
    }

    render() {

        const {
            loading,
            loaded,
            language,
            messages,
        } = this.state

        if (loading || !loaded)
            return null

        return (
            <IntlProvider locale={language} messages={messages}>
                <IntlStore>
                    {this.props.children}
                </IntlStore>
            </IntlProvider>
        )
    }

}

const IntlReceiver = ({ intl, children }) => {

    storeIntlReference(intl)

    return children
}

const IntlStore = injectIntl(IntlReceiver)

export default LanguageLoader
