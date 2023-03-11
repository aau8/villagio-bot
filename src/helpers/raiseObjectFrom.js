/**
 * Настраивает объект данных пользователя
 * @param {object} from - данные пользователя
 * @returns обработанный объект с измененными и дополненными данными, часть из которых указана по умолчанию
 */
const raiseObjectFrom = (from) => {
	const id = from.id
	delete from.id

	return {
		tg_id: id,
		start_date: new Date(),
		...from,
		phone: null,
		language_selected: from.language_code || null,
		subscription: true,
		realty: null,
	}
}

export default raiseObjectFrom