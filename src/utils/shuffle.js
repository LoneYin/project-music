
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function (arr) {
    for (let i = 0; i < arr.length; i++) {
        let j = getRandomInt(0, i)
        let tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
    }
    return arr
}
