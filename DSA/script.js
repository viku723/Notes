/**
 * 
 */

function removeDuplicateFromAnArray(arr) {
    const newUniqueArray = arr.reduce((prev, curr) => {
        return prev.includes(curr) ? prev: [...prev, curr]
    }, [])
    return newUniqueArray;
}
const arr = [1,2,3,4,4,6,6,5,6]
console.log(removeDuplicateFromAnArray(arr));

//=====================================================

const str = "Vivekanand";
function countCharacters(str) {
    str = str.toLowerCase();
    const countChar = new Map();
    str.split('').forEach((char) => {
        if (countChar.has(char)) {
            countChar.set(char, countChar.get(char) + 1)
        } else {
            countChar.set(char, 1);
        }
    });
    return countChar.entries();
}
console.log(countCharacters(str));

//==============================================================


function isPalindrome(str) {
    let reverseString = "";
    for(let i = str.length - 1; i>=0; i--) {
        reverseString += str.charAt(i);
    }
    return reverseString == str
}
const str2 = "madam1";

console.log(isPalindrome(str2));


//================================================================

/**
 * Example 1:

    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
    Example 2:

    Input: nums = [3,2,4], target = 6
    Output: [1,2]
    Example 3:

    Input: nums = [3,3], target = 6
    Output: [0,1]
 */

    function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const element = nums[i];
            if (map.get(element) >= 0) {
                return [map.get(element), i]
            } else {
                map.set(target - element, i);
            }        
        }
        return []
    }

    console.log(twoSum([3,2,4], 6))

//==========================================

// Valid Parentheses

const str3 = '(){}[]'

// function isValidParentheses(str) {

//     const map = new Map();

//     map.set("(", ")");
//     map.set("{", "}");
//     map.set("[", "]");
//     map.set("<", ">");

//     str.split('').forEach((char) => {
//         if ()
//     })

    

// }



//======================
// Find nth largest element. Array is not sorted. Array can contain duplicate values. Find 3 largest element

const arr2 = [0,-1, 3,2,1,1,4,4,5,5];

function findNthLargestElement(arr, nthElement) {

    arr = [...new Set(arr)];
    arr.sort((a,b) => a - b);
    return arr[nthElement - 1];
}

console.log(findNthLargestElement(arr2, 4))

//=============================================
// Given a roman numeral, convert it to an integer.

function convertRomanToInteger(roman) {
    let map = new Map();
    map.set("I", 1);
    map.set("V", 5);
    map.set("X", 10);
    map.set("L", 50);
    map.set("C", 100);
    map.set("D", 500);
    map.set("M", 1000);

    let sum = 0;
    for (let index = 0; index < roman.length; index++) {
        const element = map.get(roman[index]);
        const nextElement = map.get(roman[index + 1])
    
        if (element <  nextElement) {
            let num = nextElement - element;
            sum += num ;
            index++;
        } else {
            sum += element;
        }
    }
    return sum;
}

console.log(convertRomanToInteger("MCMXCIV"))


//===============
//27. Remove Element

function removeElement(arr, num) {
    return arr.filter(e => e != num).length
}

console.log("remove element", removeElement([3,2,2,3], 3))
console.log("remove element", removeElement([0,1,2,2,3,0,4,2], 2))

//======================================================================

function binarySearch(arr, searchElement) {
    let low = 0;
    let high = arr.length - 1;
    while(low <= high) {
        let mid = Math.floor(low + (high - low) / 2);
        if(searchElement == arr[mid]) return mid;
        else if(searchElement > arr[mid]) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

console.log("binary search", binarySearch([1,2,3,4,5,6], 4));
console.log("binary search", binarySearch([3,4,5,6, 7, 11], 7));

//===========================================================================

//35. Search Insert Position

function searchInsertPosition(arr, searchElement) {
    let low = 0;
    let high = arr.length - 1;
    let mid = -1;
    while(low <= high) {
        mid = Math.floor(low + (high - mid) / 2)

        if (searchElement == arr[mid]) {
            return mid;
        } else if (searchElement > arr[mid]) {
            low = mid +1;
        } else {
            high = mid - 1
        }
    }
    return mid;
}


console.log("searchInsertPosition", searchInsertPosition([1,3,4,5], 2))