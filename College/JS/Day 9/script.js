// let familyPartition = document.querySelectorAll('.family-partition'); //To select all div with class having same name.
// for (let i = 0 ; i< familyPartition.length ; i++ ) {
//     // familyPartition[i].addEventListener("mouseenter" , () => {
//     //     console.log("ghus gya");
        

//         // familyPartition[i].addEventListener("mouseenter" , (dets) => {
//         // console.log(dets);

//         familyPartition

//     })
// } ;

let familyPartition = document.querySelectorAll('.family-partition');
for (let i = 0 ; i< familyPartition.length ; i++ ) {
console.log(familyPartition[i]);

console.log(familyPartition[i].childNodes);

console.log(familyPartition[i].childNodes[3]);

familyPartition[i].addEventListener("mousemove", function(dets) {

    familyPartition[i].childNodes[3].style.left = dets.x + "px";
})

}