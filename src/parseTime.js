// @ts-check

/**
 * @typedef {{
 *  year: number, month: number, date: number, hours: number, minutes: number
 * }} myDate
 */

/**
 * @param {string} time
 * @returns {number|null} UNIX Time
 */
function parseTime(time) {
    const exactRegex = /^(?:(?<today>today) |(?<tomorrow>tomorrow) |(?:(?<rmonth>\d\d?)\/(?<rdate>\d\d?) )|(?<lastdate>\d+)days )?(?:(?<morning>morning)|(?<noon>noon)|(?<afternoon>afternoon)|(?<night>night)|(?<midnight>midnight)|(?<hour>\d\d?)(?::(?<rmin>\d\d?))?(?<ap>am|pm)?)$/

    const lastRegex = /^(?<lasthour>\d+)(?:hours|hrs|hour|hr)|(?<lastminute>\d+)(?:minutes|mins|min)|(?<lastdate>\d+)(?:days|day)$/

    const isoStringRegex = /^(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})T(?<hour>\d{2}):(?<minutes>\d{2}).+$/
    let [ year, month, date, hours, minutes ] = (/** @type {string[]} */ (new Date().toISOString().match(isoStringRegex)).slice(1).map(it => parseInt(it, 10)))

    if (!year || !month || !date || !hours || !minutes) throw 'never'

    hours += 9 // JST Only

    const exactFound = time.toLowerCase().match(exactRegex)

    if (exactFound) {
        const [
            today, tomorrow, rmonth, rdate, lastdate, morning,
            noon, afternoon, night, midnight,
            hour, rmin, ap
        ] = exactFound.slice(1)

        if (today) {
            // Do nothing
        } else if (tomorrow) {
            date += 1
        } else if (lastdate) {
            date += parseInt(lastdate, 10)
        } else if (rmonth && rdate) {
            month = Number.parseInt(rmonth, 10)
            date = Number.parseInt(rdate, 10)
        }

        if (morning) {
            hours = 8
        } else if (noon) {
            hours = 12
        } else if (afternoon) {
            hours = 16
        } else if (night) {
            hours = 21
        } else if (midnight) {
            hours = 0
            date += 1
        } else if (hour && ap == 'am') {
            hours = parseInt(hour, 10)
        } else if (hour && ap == 'pm') {
            hours = 12 + parseInt(hour, 10)
        } else if (hour) {
            hours = parseInt(hour, 10)
        }
        minutes = 0

        if (hour && rmin) {
            minutes = Number.parseInt(rmin, 10)
        }
    } else {
        const lastFound = time.toLowerCase().match(lastRegex)
        if (!lastFound) return null

        const [ lasthour, lastminutes, lastdate ] = lastFound.slice(1).map(it => parseInt(it, 10))

        if (lasthour && !Number.isNaN(lasthour)) {
            hours += lasthour
            minutes = 0
        } else if (lastminutes && !Number.isNaN(lastminutes)) {
            minutes += lastminutes
        } else if (lastdate) {
            minutes = 0
            date += lastdate
        }
    }

    const normalized = normalizeDate({
        year, month, date, hours, minutes
    })
    const isoStr = `${normalized.year}-${normalized.month}-${normalized.date}:${normalized.hours}:${normalized.minutes}:00+09:00`
    return new Date(isoStr).getTime()
}

/**
 * @param {myDate} date
 * @returns {myDate}
 */
function normalizeDate(date) {
    const copied = { ...date }

    while (copied.minutes >= 61) {
        copied.hours += 1
        copied.minutes += -60
    }
    while (copied.hours >= 25) {
        copied.date += 1
        copied.hours += -24
    }

    let needMonthAdvance = true
    while (needMonthAdvance) {
        needMonthAdvance = false
        while ([4, 6, 9, 11].includes(copied.month) && copied.date >= 31) {
            copied.month += 1
            copied.date += -30
            needMonthAdvance = true
        }
        while ([1, 3, 5, 7, 8, 10, 12].includes(copied.month) && copied.date >= 32) {
            copied.month += 1
            copied.date += -31
            needMonthAdvance = true
        }
        while (copied.month == 2 && isLeapYear(copied.year) && copied.month >= 30) {
            copied.month += 1
            copied.date += -29
            needMonthAdvance = true
        }
        while (copied.month == 2 && !isLeapYear(copied.year) && copied.month >= 29) {
            copied.month += 1
            copied.date += -28
            needMonthAdvance = true
        }
    }
    while (copied.month >= 13) {
        copied.year += 1
        copied.month += -12
    }
    return copied
}

/**
 * @param {number} year
 * @returns {boolean}
 */
function isLeapYear(year) {
    if (year % 400) return true
    if (year % 100) return false
    if (year % 4) return true
    return false
}

module.exports = { parseTime }
