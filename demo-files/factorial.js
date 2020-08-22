// factorial (4) = 4 * 3 * 2 * 1
function factorial(num) {
    let n = 1
    for ( i  = 1 ; i <= num; i++) {
        n = n * i
    }
    return n
}

function factorialRecursive(num) {
    if (num === 1) {
        return 1
    } else {
        return num * factorialRecursive(num-1) // 4 * (3 * (2 * (1 * (0 * (-1)))))
    }
}

function dynamoScan(query) { // returns data
    // make a call to dynamo
    // are we done? if so return
    // recurse if not done
}

console.log(factorial(4))
console.log(factorial(10))
console.log(factorial(2))
console.log(factorial(3))

console.log(factorialRecursive(4))