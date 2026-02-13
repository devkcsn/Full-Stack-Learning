# **JS BASIC NOTES**



\- let var cons



these are the keywords in which we can store any variable with its value.





 	let manish; ES6 {}	scope local

 	var manish; ES5 func	scope global

 	const manish;		scope local



* ### What is hoisting ?



let ab = 45;



console.log(ab);

in copy rest.

---

ES - ECMA Script



a is not defined is an error

undefined is a value



-- Concatenation is a kind of typecast, which says that we can write different datatype together by using '+' .

Eg - if we want to print a string and variable of same or different datatype as well.

 	let str = "hello" ;

 	let num = 10;

 	console.log(str + " World " + num );



#### What is browser context API?

its basically gives us 3 features

\- window object

\- heap memory

\- stack



JS has mainly 2 versions a) ES5 and b) ES6

ES5 is older version and ES6 is newer and currently running version.



-- ES5 only introduced "var" for initialization of a variable. But ES6 come through with "let" and "const" along with "var" for initialization of variable.



---

### -- Difference between var, let and const ?



* var is globally scoped which means that it doesn't matter wherever we use var in the function, it is valid all over in it's parent function.

function abcd() {

    for(var i =0 ; i< 12 ; i++){

        console.log(i);

    }

    console.log(i);

}



The "i" in the above code is valid all over the function abcd() because we use var before it.



* let \& const are braces scoped which means that it matter when let is use within braces in the function.

 eg:

 	function abcd(){

 		for(let i = 0; i < 12; i++ ){

 			console.log(i);

 			}

 			console.log(i);

 		 }

* var add itself in window of browser, let \& const doesn't.





* What is window ?

Js me kai sare features hain pr kuch features jo hum use krte wo feature wo nhi hai pr fir bhi use kar paate hain kyuki wo feature js language use kr leti hai windows se, or window hai ek

box of features given by browser to use in js.

.556 	eg alert() , prompt() , console .



*  
* What is browser context api?



Browser give some features to use are known as browser context api. Browser mainly gives 3 features

1. Window Object
2. Stack
3. Heap Memory



---



---

## For loop

---

for(initialization ; evaluation ; increment/decrement) {

     execution;

}



---



* ##### What is Stack ?

 

Stack is just like a box which contain s set of instructions to execute. Those instruction will execute with concept with First come First serve.



* ##### What is Heap memory ?



Jitne nhi intermediate data ya variable hum banate hai unhe store karna padta hai ushke lie hota hai Heap Memory.



* ##### Execution context ?



Execution context is an imaginary container where the function's code is executed and it's created wherever a function is called. It contain 3 things:

1. Variable
2. Function called in parent
3. Lexical environment



* ##### Lexical environment ?



lexical environment hota hai ek chart jisme ye likha hota hai ki aapka particular function kin cheezo ko access kar sakta hai or kin chizo ko nahi, mtlb ki it holds it's scope

and scope chain.



* ##### What is Truthy and Falsy ?



JS me kuch bhi likho wo mainly do prakaar me se ek prakar ko belong krti hai, jo ki ya to Truthy ko belong karegi ya Falsy ko belong karegi.



 		-- Falsy ke keywords: 0 , false, undefined, null , NaN . document.all





 	agar in 6 keywords me se koi bhi ek keyword ap use karte ho toh wo condition falsy me convert ho jayega.



 		-- Truly are every word which doesn't belong to Falsy.



* ##### What is forEach loop ?



ForEach loop sirf array pe chalta hai matlb ki jb bhi tumhare pas ek array ho, tb forEach loop use me aata hai. Asan sabdo me: JAb aapko array ke har ek element me kuch perform karna ho toh for each loop use karte hai.



 	eg:

 	let a = \[1,2,3,4,5,6,7,8,9];

 	a.forEach(function(elem){

 		console.log(elem-2);

 	})



 	output: \[1,2,3,4,5,6,7,8,9];

 	--> \[3,4,5,6,8,7,8,9,10,11];



 	ForEach kabhi bhi by default apke array me change nhi krta, wo aapko changes krke deta hai array ki temporary copy pr jis vjha se array hamesha same rehta hai.



* ##### What is ForIn loop ?



Objects pr loop krne ke lie hota hai forIn loop

eg:

 	\[obj,obj2,obj3,obj4]

 	let obj = {

 		name: "harsh" ,

 		age: 24 ,

 		city: "Patna"

 		}

 	for (let key in obj) {

 		console.log(key);

 	}

 	for (let key in obj) {

 		console.log(obj\[key]);

 	}

  	for (let key in obj) {

 		console.log(key , obj\[key]);

 	}



* What is CallBack function ?



jb bhi koi aisa code jo baad me chalta hai ap likhoge, kyuki wo code baad me chalta hai JS ko ye pata nhi hota ki wo complete hua ya nhi, aisa code ke completion pr JS ko bataya jaata hai ki wo complete ho gya or ap use chala sakte ho, ye batana ka kaam callback ka hai. CallBack functions are the concept of AsyncJavaScript. Asan sabdo me callback function normal function hota hai jo ki tb chalta hai jab kaam complete ho jaaye, ek give time ke baad, ya jo code baad me chalta ho use hm function de dete hai or jb vo code complete ho jjaye tb vo function chla dena use kehte hain





forin foeach are method not loop





* First class function
* iife ( Immediately Invoked Function Expression )  function -
* typeof- method hota hhai jo type batata hai.
* predefined functions are methods and our created function is function.
* isArray to check whether array or not.
* delete object property.
* equality and strict equality.

 

 	Day 6 for if else

 	Day 7 for loops and array

