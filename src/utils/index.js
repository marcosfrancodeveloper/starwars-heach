/**
 * Parse the date time to string
 * @param {(Object|string|number)} val
 * @param {int} type
 * @returns {string}
 */
export function formatDate(val, type = 0) {
	var date = new Date(val),
		mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		day = ("0" + date.getDate()).slice(-2),
		hour = ("0" + date.getHours()).slice(-2),
		minute = ("0" + date.getMinutes()).slice(-2),
		second = ("0" + date.getSeconds()).slice(-2);

	if (type = 0) {
		return [date.getFullYear(), mnth, day].join("-") + " " + [hour, minute, second].join(":");
	}
	else {
		return [day, mnth, date.getFullYear()].join("/") + " " + [hour, minute, second].join(":");
	}
}

/**
 * Parse the date time to string
 * @param {(Object|string|number)} val
 * @param {int} type
 * @returns {string}
 */
export function formatPrice(value, fixed = 2) {
	const val = Number(value.replace(",", "."));
	if (!val) return '0,00';
	const valueString = val.toFixed(fixed).replace(".", ",");
	return valueString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format number to Real
 * @param {*} numero
 */
export function numberToReal(value, fixed = 2) {
	const val = Number(value.replace(",", "."));
	if (!val) return '0,00';
	var value = val.toFixed(fixed).split('.');
	value[0] = "R$ " + value[0].split(/(?=(?:...)*$)/).join('.');
	return value.join(',');
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	if (time == null || time == undefined || time == '') {
		return null
	}

	// Apply rules to run correctly
	if (cFormat == '{m}/{y}') { time = time + "-01 00:00:00" }
	if (cFormat == '{d}/{m}/{y}') { time = time + " 00:00:00" }
	if (cFormat == '{h}:{i}:{s}') { time = "2020-01-01 " + time }

	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date

	if (typeof time === 'object') {
		date = time
	}
	else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}

		date = new Date(time)
	}

	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}

	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (result.length > 0 && value < 10) { value = '0' + value }
		return value || 0
	})
	return time_str
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
	url = url == null ? window.location.href : url
	const search = url.substring(url.lastIndexOf('?') + 1)
	const obj = {}
	const reg = /([^?&=]+)=([^?&=]*)/g
	search.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1)
		let val = decodeURIComponent($2)
		val = String(val)
		obj[name] = val
		return rs
	})
	return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
	// returns the byte length of an utf8 string
	let s = str.length
	for (var i = str.length - 1; i >= 0; i--) {
		const code = str.charCodeAt(i)
		if (code > 0x7f && code <= 0x7ff) s++
		else if (code > 0x7ff && code <= 0xffff) s += 2
		if (code >= 0xDC00 && code <= 0xDFFF) i--
	}
	return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
	if (!json) return ''
	return cleanArray(
		Object.keys(json).map(key => {
			if (json[key] === undefined) return ''
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
		})
	).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
		decodeURIComponent(search)
			.replace(/"/g, '\\"')
			.replace(/&/g, '","')
			.replace(/=/g, '":"')
			.replace(/\+/g, ' ') +
		'"}'
	)
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
	const div = document.createElement('div')
	div.innerHTML = val
	return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
	if (typeof target !== 'object') {
		target = {}
	}
	if (Array.isArray(source)) {
		return source.slice()
	}
	Object.keys(source).forEach(property => {
		const sourceProperty = source[property]
		if (typeof sourceProperty === 'object') {
			target[property] = objectMerge(target[property], sourceProperty)
		} else {
			target[property] = sourceProperty
		}
	})
	return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
	if (!element || !className) {
		return
	}
	let classString = element.className
	const nameIndex = classString.indexOf(className)
	if (nameIndex === -1) {
		classString += '' + className
	} else {
		classString =
			classString.substr(0, nameIndex) +
			classString.substr(nameIndex + className.length)
	}
	element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
	if (type === 'start') {
		return new Date().getTime() - 3600 * 1000 * 24 * 90
	} else {
		return new Date(new Date().toDateString())
	}
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function () {
		const last = +new Date() - timestamp

		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}

	return function (...args) {
		context = this
		timestamp = +new Date()
		const callNow = immediate && !timeout
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}

		return result
	}
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
	if (!source && typeof source !== 'object') {
		throw new Error('error arguments', 'deepClone')
	}
	const targetObj = source.constructor === Array ? [] : {}
	Object.keys(source).forEach(keys => {
		if (source[keys] && typeof source[keys] === 'object') {
			targetObj[keys] = deepClone(source[keys])
		} else {
			targetObj[keys] = source[keys]
		}
	})
	return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
	return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
	const timestamp = +new Date() + ''
	const randomNum = parseInt((1 + Math.random()) * 65536) + ''
	return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
		ele.className = ele.className.replace(reg, ' ')
	}
}