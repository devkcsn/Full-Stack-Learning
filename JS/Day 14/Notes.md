# Promises

##### JS me Promises ek object hota hai jo future me asynchronous operation ke result ko represent karta hai.



##### There are a total of 3 states

##### 

* ##### Pending
* ##### fulfilled
* ##### rejected





In success part 'then' keyword is used.
In failure part 'catch' keyword is use.
And 'finally' is always working, working on cleanup.

Promises avoid CallBack and promote chaining.
CallBack is also used for async JS

setTimeout(() => {
for (var i = 0; i < 3; i++) {
setTimeout(() => {
console.log(i);
}, 0);
}
}, 4000);

