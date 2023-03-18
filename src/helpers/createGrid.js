/**
 * Создает сетку с указаным количеством колонок
 * @param {object} arr массив кнопок
 * @param {number} columns количество колонок
 * @returns массив с подмасивами с количеством элементов равным значению columns
 */
const createGrid = (arr, columns = 1) => {
    const grid = []

    for (let i = 0; i < Math.ceil(arr.length / columns); i++) {
        grid[i] = arr.slice(i * columns, i * columns + columns)
    }

	// console.log('grid', grid)

    return grid
}

export default createGrid