
import queryString from 'query-string'

export default {

    queryString(queryObject) {
        return queryObject ? '?' + queryString.stringify(queryObject) : ''
    },

    query(search) {
        return search ? queryString.parse(search) : {}
    },

}
