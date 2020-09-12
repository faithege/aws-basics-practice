const n = [2]
const list = [1, 2, 3, 4]
const list2 = list.map(n => n*2) // [2, 4, 6, 8]
console.log(list, list2)

const listOfList = [list, list2]
const list3 = listOfList.flatMap(n => n)

console.log(list3.reduce((n, m) => n+m))

console.log(list3.some(el => el === 3))

const isThree = function(n) {
    return n === 3
}

console.log(list3.every(el => el === 3))
console.log(list3.every(isThree))

console.log(list3, listOfList.flat())