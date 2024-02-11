// function getData(index) {
//     if (index < 1) {
//         throw new Error("wrong number")
//     } 
//     //let a = 1/index
//     //index.hhvb.nnn;
//     return index;
// }


// try {
//     console.log(getData(0))
// } catch (e) {
//     if (e instanceof TypeError) {
//         console.error("passed 1")
//     }
//     if (e instanceof Error) {
//         console.error("passed 2")
//     }
// } finally {
//     console.log("print")
// }

function x() {
    try {
        return 1;
    } catch (e) {
        return 2
    } finally {
        return 3 //prints
    }
}

console.log(x());



function y() {
    try {
        throw new Error("")
        return 1;
    } catch (e) {
        console.log(e)
        return 2
    } 
}

console.log(y());




