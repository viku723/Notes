var x = 10;
var y = 20;


function one() {
    var b = 22;
    two()
}

function two() {
    var a = 8;
    three()
}

function three() {

    this.zz = 23;
    this.xy = () => {
        console.log(this.zz)
        function aa() {
            console.log(this);
        }
        aa();
    }

    this.xz = function() {
        console.log(this)
    }
    let s = 3;
    return x + y;
}

//one();

let a = new three();
a.xy()
a.xz()
