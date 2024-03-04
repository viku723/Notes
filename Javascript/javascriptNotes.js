/* 1. Object Vs Map:
	* An object can contain only string, number and symbol as an key, where as Map contains any data type as key.
	* Map is ordered and iterative collection where as Object is not.
	* The size of an object cannot be determined directly
	* Objects can have methods to interact with its data whereas Map doesn't */

	

//2. Remove duplicate from an array
let arr = [2,1,1,4,8,8,3];

//Sol. 1
let UniqueArr = [...new Set(arr)];
console.log(UniqueArr);

//Sol. 2 
let UniqueArr2 = arr.reduce((acc, curr) => {
  return acc.includes(curr) ? acc: [...acc, curr];
}, []);

console.log(UniqueArr2);

//3. Array Sort:
Ex. 1
let arr = [2,1,1,4,8,8,3];
arr.sort((a, b)=> a < b ? -1 : 1)
console.log(arr);

Ex.2 , with Objects	

let arr = [
  {name: "John", lastName: "Wick"},
  {name: "Sam", lastName: "Rock"},
];
arr.sort((a, b)=> a.lastName < b.lastName ? -1 : 1)
console.log(arr);

//4. Range:
//Sol1
function range(start, end) {
  arr = [];
  for (let i =start; i<= end; i++) {
    arr.push(i)
  }
  return arr;
}
console.log(range(1, 50));
//Sol2
function range2(start, end) {
  return [...Array(end).keys()].map(el => el + start)
}
console.log(range2(5, 50))

//5. Find the number of occurance of minimum values in list

    let arr = [2,3,4,5,2,6,7, 2, 1,1];
    
    // Sol -1
    arr.sort((a, b) => a < b ? -1: 1;);
    let min = arr[0];
    let count = 0;
    arr.forEach((el) => {
      if (el == min) {
        count++;
      }
    })
    console.log(min, count)
    
    //Sol 2
    let min = Math.min(...arr);
    let count = arr.filter((el) => el == min).length;
    console.log(min, count)
    
/* 6. Hoisting: 
        Order of precedence:
        It’s important to keep a few things in mind when declaring JavaScript functions and variables:
        Variable assignment takes precedence over function declaration
        Function declarations take precedence over variable declarations

        Variable assignment over function declaration: 

        var double = 22;
        function double(num) {
        return (num*2);
        }

        console.log(typeof double); // Output: number
        Function declarations over variable declarations:

        var double;
        function double(num) {
        return (num*2);
        }

        console.log(typeof double); // Output: function


    Prototypical inheritance:
        Every object has a builtin property called 'prototype'. This prototype itself an object which in turn has 'prototype' and so on till it reaches the 'prototype' has null.
        
        How property looks up?
            a. First it will try to look up the property into the objet itself.
            b. if it doesn't find there, then it'll look into the object's prototype.
            c. if it doesn't find there, then it'll look into the object's prototype of prototype.
            d. if it doesn't till prototype is null then it will show undefined.

            example Prototype Chain:

                1.
                    const person = {
                        name: "john"
                    };

                    person.name // prints "john" since property present in the object itself.
                    person.lastName // undefined since property looks => person -> person.__proto__ -> Object.prototype -> null

                    person.__proto__ === Object.prototype // true
                    Object.prototype.__proto__ == null // true

                2.
                    person.toString()// person -> person.__proto__ -> Object.prototype finds here

                NOTE: all custom objects root prototype is "Object.prototype". However, this entirely not true. For example
                    const d = "test";
                    d.__proto__ == String.prototype // true

                3. const name = "John";
                   name.toUpperCase() // property lookup  => name -> name.__proto__ -> String.prototype // finds here

                4. name.toString() // property lookup  => name -> name.__proto__ -> String.prototype -> Object.prototype // finds here 
                    String.prototype.__proto__ == Object.prototype // true

        With above knowledge lets see some prototype inheritance:    
        
        1. Object Literal:
            If Objects are created and then you wanted to link each other then make use of Object.setPrototypeOf() for inheritance.

                let family  = {
                    familyName: "Doe",
                    getFullName: function(params) {
                        return this.name + " " + this.parentName + " " + this.familyName
                    }
                }
                let parent = {
                    parentName: "Jack"
                }
                let child = {
                    name: "John"
                }
                Object.setPrototypeOf(parent, family)
                Object.setPrototypeOf(child, parent)
                
                child.getFullName() // 'John Jack Doe'
            
            If you are creating new object and inherit properties from other objects them make use of Object.create(obj) which attaches 'obj' to new object's prototype (__proto__)
                let family  = {
                    familyName: "Doe",
                    getFullName: function(params) {
                        return this.name + " " + this.parentName + " " + this.familyName
                    }
                }
                let parent = Object.create(family) ;
                parent.parentName = "Jack";

                let child = Object.create(parent) ;
                child.name = "John";

                child.getFullName() // 'John Jack Doe'

        2. Using 'function and new' keyword:
            function Rectangle(length, width) {
                this.length = length;
                this.width = width;
            }
            
            Rectangle.prototype.getArea = function() {
                return this.length * this.width;
            };
            
            function Square(length) {
                Rectangle.call(this, length, length);
            }
            
            Square.prototype = Object.create(Rectangle.prototype);
            
            var square = new Square(3);
            
            console.log(square.getArea());              // 9
            console.log(square instanceof Square);      // true
            console.log(square instanceof Rectangle);   // true
            
        3. Class based inheritance
            
            class Rectangle {
                constructor(length, width) {
                    this.length = length;
                    this.width = width;
                }
            
                getArea() {
                    return this.length * this.width;
                }
            }
            
            class Square extends Rectangle {
                constructor(length) {
                    // same as Rectangle.call(this, length, length)
                    super(length, length);
                }
            }
            
            var square = new Square(3);
            
            console.log(square.getArea());              // 9
            console.log(square instanceof Square);      // true
            console.log(square instanceof Rectangle);   // true


    The Object.keys() and Object.getOwnPropertyNames() methods can retrieve all property names in an object. The former method returns 
    all enumerable property names, and the latter returns all properties regardless of enumerability.

    Neither method returns symbol properties, however, to preserve their ECMAScript 5 functionality. Instead, the Object.getOwnPropertySymbols() 
    method was added in ECMAScript 6 to allow you to retrieve property symbols from an object.

    Object.keys() vs Object.getOwnPropertyNames():
    When a property of an object is marked as "enumerable: true," it means that the property will be included when iterating over the object's properties. 
    Conversely, if a property is marked as "non-enumerable," it will be excluded from such iterations.

    By default, most properties you create on an object are enumerable. However, there are certain properties in JavaScript that are not enumerable, 
    such as properties added to the object's prototype chain or built-in properties like toString or constructor.
    Here's an example to illustrate enumerable property names:

    const obj = {
        name: 'Alice',
        age: 30,
    };

    console.log(Object.keys(obj)); // Output: ['name', 'age']

    In this example, both name and age properties are enumerable, so they are included when you use Object.keys() to retrieve the property names.

    You can control the enumerability of properties using methods like Object.defineProperty() or Object.defineProperties(). 
    By explicitly setting the enumerable property descriptor to false, you can make a property non-enumerable:

    javascript
    const obj = {};

    Object.defineProperty(obj, 'nonEnumProp', {
        value: 'This is a non-enumerable property',
        enumerable: false,
    });

    console.log(Object.keys(obj)); // Output: []
    In this example, nonEnumProp is a non-enumerable property, so it's not included when using Object.keys().

Symbols:
    JavaScript introduced symbols in ES6 as a way to prevent property name collisions. As an added bonus, symbols also provide a way to simulate 
    private properties in 2015-2019 JavaScript.
    The simplest way to create a symbol in JavaScript is to call the Symbol() function. The 2 key properties that makes symbols so special are:

    a. Symbol is a primitive data type. Symbols can be used as object keys. Only strings, numbers and symbols can be used as object keys.
    b. No two symbols are ever equal. 

    const symbol1 = Symbol();
    const symbol2 = Symbol();

    symbol1 === symbol2; // false

    const obj = {};
    obj[symbol1] = 'Hello';
    obj[symbol2] = 'World';

    obj[symbol1]; // 'Hello'
    obj[symbol2]; // 'World'

    //You can create a symbol and register in Symbols global registry by using Symbol.for("nameOfIdentifier");
    let s1 = Symbol.for("uid"); // check the Symbol's global registry whether "uid" identifier and it doesn't exist then creates one.
    let s2 = Symbol.for("uid"); // recurs already created symbol from registry

    s1 === s2; //true

    There are many built in symbols and one of them is Symbol.iterator. Its special symbol which is iterable, that means we can use in for..of 
    statement. Symbols acts as a private key in object since Symbols doesn't show up in Object.keys() or JSON.Stringify(). 
    However, we can get Symbols by using Object.getOwnPropertySymbols()


Generators and Iterators:
    Why we need iterator?
        If you see traditional for loop 
            for(var i= 0; i< arr.length; i++) {}
        It's needs track of index by using a variable and if we have nested for loops then we need to have multiple index variables. 
        This leads confusion and kind of verbose.

        What are iterators?
        Iterators are just objects with specific interfaces designed for iteration. All iterator objects have next() which returns result object. 
        The result object contains "value" and "done".

        What are generators?
        Generators are special functions which returns iterator.
            function *createGenrator() {
                yield 1;
                yield 2;
                yield 3;
            }

            let iterator = createGenrator();

            iterator.next() // {value: 1, done: false}
            iterator.next() // {value: 2, done: false}
            ..

        It stops execution after each yield statement until next(). This will be very helpful in async calls. Generators can be created as function expression,	object method etc.
        Iterable are objects with Symbol.iterator property. All collections objects (arrays, sets, maps) and strings are iterable. 
        Thats means we can use for-of loop.	All iterators are created by generators are iterable since by default generators add Symbol.iterator property.

        Examples for Generators:
            1. Generate an infinite sequence of numbers on-demand using a generator.
                function* infiniteNumbers() {
                    let i = 1;
                    while (true) {
                        yield i++;
                    }
                }

                const numbersIterator = infiniteNumbers();
                console.log(numbersIterator.next().value);  // Outputs: 1
                console.log(numbersIterator.next().value);  // Outputs: 2

            2. 

Note: WeakMap and WeakSet are not iterable since objects are weakly referenced, its size can't be determine at runtime.


Anytime you're going to use only object keys, then the best choice is a weak map however you can't use the forEach() method, the size property, 
or the clear() method to manage the items.

Proxies and Reflection?
    Proxies: Proxy allows to create a wrapper object around target object where you can intercept low lever object operations(get,set, has etc..) 
    which are internal to Javscript engine. These low level operations are intercepted by using traps method that invokes when specific 
    operation done on objects (get, set).

    Reflect API: Its Reflect object is a collection of methods which provides default behaviour(JS engine behaviour) for same low level operations. 
    There is a Reflect	Method for each proxy trap which has same name and arguments.

    Each trap overrides some built-in behavior of JavaScript objects, allowing you to intercept and modify the behavior. If you still need to use 
    the built-in behavior, then you can use the corresponding reflection API method.

    Creating Simple proxy:

        let target = {};

        let proxy = new Proxy(target, {});

        proxy.name = "proxy";
        console.log(proxy.name);        // "proxy"
        console.log(target.name);       // "proxy"

        target.name = "target";
        console.log(proxy.name);        // "target"
        console.log(target.name);       // "target"

        In this example, proxy forwards all operations directly to target. When "proxy" is assigned to the proxy.name property, name is created on target
        Examples:

        i.Validating Properties Using the set Trap 

            let proxy = new Proxy(target, {
                set(trapTarget, key, value, receiver) {

                    // ignore existing properties so as not to affect them
                    if (!trapTarget.hasOwnProperty(key)) {
                        if (isNaN(value)) {
                            throw new TypeError("Property must be a number.");
                        }
                    }

                    // add the property
                    return Reflect.set(trapTarget, key, value, receiver);
                }
            });

            // adding a new property
            proxy.count = 1;
            console.log(proxy.count);       // 1
            console.log(target.count);      // 1
            proxy.count = "someString"      // throws an error


        ii. Object Shape Validation Using the get Trap

            let proxy = new Proxy({}, {
                get(trapTarget, key, receiver) {
                    if (!(key in receiver)) {
                        throw new TypeError("Property " + key + " doesn't exist.");
                    }

                    return Reflect.get(trapTarget, key, receiver);
                }
            });
            nonexistent properties throw an error
            console.log(proxy.nme);             // throws error


iii. Preventing Property Deletion with the deleteProperty Trap

    in strict mode, delete throws an error when you attempt to delete a nonconfigurable property; in nonstrict mode, delete simply returns false. Here's an example:

    let target = {
        name: "target",
        value: 42
    };

    Object.defineProperty(target, "name", { configurable: false });

    console.log("value" in target);     // true

    let result1 = delete target.value;
    console.log(result1);               // true

    console.log("value" in target);     // false

    // Note: The following line throws an error in strict mode
    let result2 = delete target.name;
    console.log(result2);               // false

    console.log("name" in target);      // true

    example: Avoid delete property
    let target = {
        name: "target",
        value: 42
    };

    let proxy = new Proxy(target, {
        deleteProperty(trapTarget, key) {

            if (key === "value") {
                return false;
            } else {
                return Reflect.deleteProperty(trapTarget, key);
            }
        }
    });

    // Attempt to delete proxy.value

    console.log("value" in proxy);      // true

    let result1 = delete proxy.value;
    console.log(result1);               // false

    console.log("value" in proxy);      // true

    // Attempt to delete proxy.name

    console.log("name" in proxy);       // true

    let result2 = delete proxy.name;
    console.log(result2);               // true

    console.log("name" in proxy);       // false


Calling Constructors Without new:
    function Numbers(...values) {
        if (typeof new.target === "undefined") {
            throw new TypeError("This function must be called with new.");
        }
        this.values = values;
    }

    let instance = new Numbers(1, 2, 3, 4);
    console.log(instance.values);               // [1,2,3,4]

    // throws error
    Numbers(1, 2, 3, 4);

Swapping variables in ECMAScript 6
    let a = 1,
        b = 2;

    [ a, b ] = [ b, a ];

    console.log(a);     // 2
    console.log(b);     // 1




Block scopes, also called lexical scopes, are created:

    Inside of a function
    Inside of a block (indicated by the { and } characters)

    The Temporal Dead Zone: A variable declared with either let or const cannot be accessed until after the declaration. Attempting to do so results in a reference error
    if (condition) {
        console.log(typeof value);  // ReferenceError!
        let value = "blue";
    }

/* ES 6 function:
1.Default function parameters
2. Rest param converts to array from arguments.
3. the behavior of a function is defined by [[Call]], normal function execution, and [[Construct]], when a function is called with new.
  The new.target metaproperty also allows you to determine if a function was called using new or not.

Arrow Functions:
    - No this, super, arguments, and new.target bindings
    - Cannot be called with new 
    - No prototype
    - No arguments object 
    - Can't change this
    - Arrow functions have no this binding, which means the value of this inside an arrow function can only be determined by looking up the scope chain.
*/
//ES5 :

var PageHandler = {

    id: "123456",

    init: function() {
        document.addEventListener("click", function(event) {
            this.doSomething(event.type);     // error, 'this' refering to document...we can use here .bind(this) to rectify
        }, false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};

//ES6:	
init: function() {
    document.addEventListener("click", event => this.doSomething(event.type), false);
},


/*
Object.is() method accepts two arguments and returns true if the values are equivalent. 
Two values are considered equivalent when they are of the same type and have the same value
*/

console.log(+0 == -0);              // true
console.log(+0 === -0);             // true
console.log(Object.is(+0, -0));     // false

console.log(NaN == NaN);            // false
console.log(NaN === NaN);           // false
console.log(Object.is(NaN, NaN));   // true

console.log(5 == 5);                // true
console.log(5 == "5");              // true
console.log(5 === 5);               // true
console.log(5 === "5");             // false
console.log(Object.is(5, 5));       // true
console.log(Object.is(5, "5"));     // false	

//ES6 add Object.setPrototypeOf()
let person = {
    getGreeting() {
        return "Hello";
    }
};

let dog = {
    getGreeting() {
        return "Woof";
    }
};

// prototype is person
let friend = Object.create(person);
console.log(friend.getGreeting());                      // "Hello"
console.log(Object.getPrototypeOf(friend) === person);  // true

// set prototype to dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting());                      // "Woof"
console.log(Object.getPrototypeOf(friend) === dog);     // true


/*
Why to Use the Class Syntax
Despite the similarities between classes and custom types(Function constructor), there are some important differences to keep in mind:

Class declarations, unlike function declarations, are not hoisted. Class declarations act like let declarations and so exist in the temporal dead zone until execution reaches the declaration.
All code inside of class declarations runs in strict mode automatically. There's no way to opt-out of strict mode inside of classes.
All methods are non-enumerable. This is a significant change from custom types, where you need to use Object.defineProperty() to make a method non-enumerable.
All methods lack an internal [[Construct]] method and will throw an error if you try to call them with new.
Calling the class constructor without new throws an error.
Attempting to overwrite the class name within a class method throws an error.

In programming, something is said to be a first-class citizen when it can be used as a value, meaning it can be passed into a function, 
returned from a function, and assigned to a variable. 
JavaScript functions are first-class citizens (sometimes they're just called first class functions),
*/	

class MyClass {

*createIterator() {
    yield 1;
    yield 2;
    yield 3;
}

}

let instance = new MyClass();
let iterator = instance.createIterator();


// There is no abstract keyword in JS.  Workaround for abstract base class.
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error("This class cannot be instantiated directly.")
        }
    }
}

/**
The static Reflect.construct() method acts like the new operator, but as a function. It is equivalent to calling new target(...args)
*/

function func1(a, b, c) {
  this.sum = a + b + c;
}

const args = [1, 2, 3];
const object1 = new func1(...args);
const object2 = Reflect.construct(func1, args);

console.log(object2.sum);
// expected output: 6

console.log(object1.sum);
// expected output: 6


/*
Differences between Service and Web Workers:


Service workers are a proxy between the browser and the network. By intercepting requests made by the document, service workers can redirect 
requests to a cache, enabling offline access.

A Web Worker is just a general purpose background thread. The intention here is to run background code such that long running tasks do not 
block the main event loop and cause a slow UI. Web Workers do not intercept network requests, rather the front end code explicitly sends messages 
to the Web Worker.
*/	

Service Worker:

    /* main.js */

    navigator.serviceWorker.register('/service-worker.js');



    /* service-worker.js */

    // Install 
    self.addEventListener('install', function(event) {
        // ...
    });

    // Activate 
    self.addEventListener('activate', function(event) {
        // ...
    });

    // Listen for network requests from the main document
    self.addEventListener('fetch', function(event) {
        // ...
    });

    Web workers are general-purpose scripts that enable us to offload processor-intensive work from the main thread.

    /* main.js */

    // Create worker
    const myWorker = new Worker('worker.js');

    // Send message to worker
    myWorker.postMessage('Hello!');

    // Receive message from worker
    myWorker.onmessage = function(e) {
      console.log(e.data);
    }
    
    /*
    
    preventDefault() prevents the default browser behavior for a given element.

    stopPropagation() stops an event from bubbling or propagating up the DOM tree.

    Whereas,

    return false is a combination of both preventDefault() and stopPropagation().*/


/* 
Primitive Types do not have any methods. All primitives are immutable.

Closure is combination of a function and lexical environment.


Execution Context:
    When you run any javascript code, it creates an environment to transformation(creation phase) and execution (execution phase) of code. This is called execution context.
    There is global execution context and function execution context for every function invoke. In debugger, you can see right side "scope" before the "call stack".
    
    In execution context, there are two phases:
    1. Memory Creation phase:
        a. creates a global object i.e window object.
        b. binds "this" object to window object.
        c. stores variables and functions in global execution context and set it to undefined
    2. Execution Phase:
        a. executes code line by line.
        b. creates execution context for each functions.

when creating variables with var keyword, it will stored in window object(if its in global execution context) and set to undefined. However, in case of let, it will stored in 
"temporal dead zone" (If you see in debugger its "Script" execution context).
    ex: 
        var x=10;
        var y=11;
    After creation phase window object would be:
    {
        ...
        ...
        x: undefined,
        y: undefined,
        ...
    }
    After execution phase window object would be:
    {
        ...
        ...
        x: 10,
        y: 11,
        ...
    }

    if instead of var, let keyword used then x and y wouldn't storing in window object(in debugger, it will show as <value unavailable>).



Event Loop:
    Javascript engine is a single threaded non blocking. JS code executes synchronously which blocking in nature, however, to run asynchronously we can make use of WebAPIs and
    event loop so that it can be non blocking.
    
    Event loop monitors call stack, MacroTask queue and MicroTask queue. Whenever, callStack is empty then event loop will take the task from MicroTask queue and push to 
    CallSTack. If MicroTask doesn't have any task then it will pick task from MacroTask queue and push it to the call stack. First priority would be MicroTask queue then CallBack
    queue.

    Macrotasks are tasks that are scheduled to run on the main thread and are typically associated with longer or more significant operations, such as I/O operations, 
    timers (e.g., setTimeout and setInterval), and user input events (e.g., click, mousemove).

    Microtasks are tasks that are scheduled to run after the current macrotask completes but before the next macrotask begins. 
    They are typically associated with shorter and faster tasks. Some examples of microtasks include promises (e.g., Promise.resolve()), mutation observers, and the process.nextTick 
    method in Node.js.


    Example of EVent Loop:

        console.log('Start of script');
        setTimeout(() => {
            console.log('Inside setTimeout (macrotask)');
        }, 0);

        Promise.resolve().then(() => {
            console.log('Inside promise (microtask)');
        });

        console.log('End of script');

        O/P:
            Start of script
            End of script
            Inside promise (microtask)
            Inside setTimeout (macrotask)

    Explanation:
        a. It will executes console.log('Start of script');
        b. Then setTimeout will placed into the MacroTask queue after 0 second.
        c. Promise.resolve() callback method will be pushed into the MicroTask queue.
        d. t will executes console.log('End of script');	
        e. It will pick the task from MicroTask queue and pushed to call stack and executes it.
        f. It will pick the task from MacroTask queue and pushed to call stack and executes it.

    Please note here that 
        a. callbacks we are referring here are async in nature.
            ex: sync CB: function xyz(() => { console.log("hi"}) { }
                async CB:   setTimeout(() => {
                                console.log('Inside setTimeout (macrotask)');
                            }, 0);
        b. Asynchronous tasks include events like user interactions (e.g., click events), timers (e.g., setTimeout), and I/O operations (e.g., reading files).
        c. setTimeout(() => {}, 5000) this doesn't give guarantee that after 5 seconds setTimeout's callback will be executed. It depends call stack and queues.

    
Memory Storage:
    Primitive data types(string, number, boolean, undefined, symbol, null) are stored in "stack" memory 
    where as reference types(Array, function, objects) are stored in "heap" and accessed by reference.


*/

  