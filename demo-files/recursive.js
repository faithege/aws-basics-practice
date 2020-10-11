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

// recursive practice
function countdown(number){

    console.log(number)

    if (number === 0) {
        return number
    }
    else {
        return countdown(--number)
    }

}
countdown(10)

// x%10 gets the last digit
// Math.floor(number/10) pops off the last digit

function sumOfDigits(number){
    if (number == 0) {
        return 0
    } else {
        return (number % 10) + sumOfDigits(Math.floor(number/10))
        
    }

}

console.log(sumOfDigits(234))
console.log(sumOfDigits(17))
console.log(sumOfDigits(21211))

function reverseString(string){

    lastChar = string.slice(-1)

    if (string.length === 0){
        return ''
    } else {
        return lastChar + reverseString(string.substring(0, string.length - 1)) //my attempt - works!!
        
    }
}

//alternative
function revStr(str){
    if (str === '') return '';
    return revStr(str.substr(1)) + str[0];
  }
  revStr('cat');
  // tac

console.log(reverseString('hello'))

//example i thought of myself
function powerOf(x,y){
    if (y===0){
        return 1
    } else {
        return x * powerOf(x,y-1)
    }
}

console.log(powerOf(9,2)) //81
console.log(powerOf(2,5)) //32
console.log(powerOf(3,6)) //729