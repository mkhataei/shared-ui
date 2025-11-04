class GeneralUtils {
  static numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  static toPersianNumber(n) {
    return n.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
  }

  static groupBy(array, keyFn) {
    return array.reduce((acc, item) => {
      const key = keyFn(item)
      ;(acc[key] ||= []).push(item)
      return acc
    }, {})
  }

  static truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str
    }
    return `${str.slice(0, maxLength)} ...`
  }
}

export default GeneralUtils
