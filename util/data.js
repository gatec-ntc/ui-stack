
import equal from 'deep-equal'

export function clearUndefined(obj) {

    if (!obj || typeof obj !== 'object')
        return obj

    var newObj = {}

    Object.keys(obj).filter(k => typeof obj[k] !== 'undefined').forEach(k => {
        var v = obj[k]
        newObj[k] = typeof v === 'object' ? clearUndefined(v) : v
    })

    return newObj
}

export function isEqual(a, b, opt) {
    return equal(clearUndefined(a), clearUndefined(b), opt)
}
