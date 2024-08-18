// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'ja'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * E​d​i​t
	 */
	edit: string
	/**
	 * C​a​n​c​e​l
	 */
	cancel: string
	/**
	 * P​r​e​v​i​e​w
	 */
	preview: string
	/**
	 * Y​o​u​r​ ​i​n​p​u​t​ ​e​x​c​e​e​d​s​ ​t​h​e​ ​c​h​a​r​a​c​t​e​r​ ​l​i​m​i​t​.
	 */
	textTooLong: string
	/**
	 * T​i​t​l​e
	 */
	title: string
	/**
	 * D​e​s​c​r​i​p​t​i​o​n
	 */
	desc: string
	/**
	 * S​e​l​e​c​t​ ​i​c​o​n
	 */
	iconSelect: string
	/**
	 * R​e​m​o​v​e​ ​i​c​o​n
	 */
	iconRemove: string
}

export type TranslationFunctions = {
	/**
	 * Edit
	 */
	edit: () => LocalizedString
	/**
	 * Cancel
	 */
	cancel: () => LocalizedString
	/**
	 * Preview
	 */
	preview: () => LocalizedString
	/**
	 * Your input exceeds the character limit.
	 */
	textTooLong: () => LocalizedString
	/**
	 * Title
	 */
	title: () => LocalizedString
	/**
	 * Description
	 */
	desc: () => LocalizedString
	/**
	 * Select icon
	 */
	iconSelect: () => LocalizedString
	/**
	 * Remove icon
	 */
	iconRemove: () => LocalizedString
}

export type Formatters = {}
