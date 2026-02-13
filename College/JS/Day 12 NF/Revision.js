const person = {
    name: "KCSN",
    age: 23,
    first: 25
};

Object.defineProperty(person, 'age', {
    writable: false
});
person.age = 26;

console.log(person);

