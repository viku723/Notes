console.log("hello");


const obj = {
    a: "aa"
}

console.log(obj)


const obj2 = Object.create(obj);

console.log(Object.getPrototypeOf(obj2) === obj);


function ClassA() {
    this.a = "aaa"
}
ClassA.prototype.m1 = function() {
    console.log(this.a);
}

function ClassB() {

}
const a = new ClassA();
ClassB.prototype = a;


const b = new ClassB();

b.m1()


