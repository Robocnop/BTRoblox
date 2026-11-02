"use strict"

// Lightweight localization helper.
//
// Strings are written in English directly in the code and wrapped with i18n():
//     i18n("Hide Ads")
//     i18n("Are you sure? ({0})", seconds)
//
// The English text is used as the lookup key in the locale dictionaries
// (js/locales/*.js). Missing translations fall back to English, so new strings
// never break anything and can be translated later.

const i18n = (() => {
	const locales = {}

	const getBrowserLanguage = () => {
		try { return chrome.i18n.getUILanguage() }
		catch(ex) {}

		try { return navigator.language }
		catch(ex) {}

		return "en"
	}

	const language = String(getBrowserLanguage() || "en").replace(/_/g, "-").toLowerCase()

	const getMessages = () => locales[language] || locales[language.split("-")[0]] || null

	const format = (str, args) => (args.length ? str.replace(/\{(\d+)\}/g, (match, index) => (index in args ? args[index] : match)) : str)

	const i18n = (str, ...args) => {
		const messages = getMessages()
		const translated = messages && Object.prototype.hasOwnProperty.call(messages, str) ? messages[str] : str

		return format(translated, args)
	}

	i18n.language = language

	i18n.register = (lang, messages) => {
		lang = lang.toLowerCase()
		locales[lang] = Object.assign(locales[lang] || {}, messages)
	}

	i18n.getMessages = () => getMessages() || {}

	return i18n
})()
