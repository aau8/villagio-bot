/**
 * Создает сетку с указаным количеством колонок
 * @param {object} arr массив кнопок
 * @param {number} columns количество колонок
 * @returns массив с подмасивами с количеством элементов равным значению columns
 */
export default (arr, columns) => {
    const grid = []

    for (let i = 0; i < Math.ceil(arr.length / columns); i++) {
        grid[i] = arr.slice(i * columns, i * columns + columns)
    }

    return grid
}
