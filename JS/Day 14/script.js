let myPromise = new Promise((resolve, reject) => {
    let success = true;
    if (success) {
        resolve("Operation Successfull")
    }
    else {
        reject("Operation failed");
    }
});

myPromise.then((message) => {
    console.log(message);
}).catch((message) => {
    console.log(message);
});

