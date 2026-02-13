function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Raw Data"), 2000);
  });
}

function processData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data + " => processed"), 1000);
  });
}

function saveData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data + " => saved"), 500);
  });
}

fetchData()
  .then((result) => {
    console.log("Step 1", result);
    return processData(result);
  })
  .then((processed) => {
    console.log("Step 2", processed);
    return saveData(processed);
  })
  .then((final) => {
    console.log("Step 3", final);
  })
  .catch((error) => {
    console.error("Error", error);
  });
