// import { useState, useEffect } from "react";

// function Counter() {
//   // useState ek hook hai jo component ke andar ek state banata hai
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <h2> Counter Example </h2>
//       <p> Current count: {count} </p>
//       <button onClick={() => setCount(count + 1)}> Increment </button>
//       <button onClick={() => setCount(count - 1)}> Decrement </button>
//     </div>
//   );
// }

// function Toggle() {
//   const [isOn, setIsOn] = useState(false);
//   return (
//     <div>
//       <h2> Toggle Example</h2>
//       <p> Status: {isOn ? "ON" : "OFF"} </p>
//       <button onClick={() => setIsOn(!isOn)}> Toggle </button>
//     </div>
//   );
// }

// //Form Control
// function FormControl() {
//   const [name, setName] = useState("");
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Hello ${name},form submitted!`);
//   };
//   return (
//     <div>
//       <h2>Form Control Example</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// function UseEffectExample() {
//   const [message, setMessage] = useState("Loading-- ");
//   useEffect(() => {
//     console.log("Component Mount");
//     setTimeout(() => {
//       setMessage("data loaded successfully");
//     }, 2000);
//     return () => console.log("component unmount");
//   }, []);

//   return (
//     <div>
//       <h2>useEffect Example</h2>
//       <p>{message}</p>
//     </div>
//   );
// }

// //Data Fetching
// function DataFetching() {
//   const [users, setUsers] = useState([]);
//   useEffect(() => {
//     fetch("https://jsonplaceholder.typicode.com/users")
//       .then((res) => res.json())
//       .then((data) => setUsers(data));
//   }, []);

//   return (
//     <div>
//       <h2>Data Fetching Example</h2>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function ListExample(){
//   const fruits = ['Apple', 'Banana', 'Orange', 'Mango'];

//   return (
//     <div>
//       <h2>Simple List Example</h2>
//       <ul>
//         {fruits.map((fruit, index) => (
//           <li key={index}>{fruit}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Counter />
//         <Toggle />
//         <FormControl />
//         <UseEffectExample />
//         <DataFetching />
//         <ListExample />
//       </header>
//     </div>
//   );
// }

// export default App;

//Day 2

import React, { useState } from "react";
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div
      style={{
        fontFamily: "Arial",
        textAlign: "center",
        marginTop: "50px",
        padding: 20,
      }}
    >
      <h1>Conditional Rendering Example</h1>
      <h1>{isLoggedIn ? "Welcome Back!" : "Please Log In"}</h1>
      {/* Button se login /logout toggle karenge */}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "Log Out" : "Log In"}
      </button>
      {/* Conditional Rendering */}
      {isLoggedIn ? <p>You are logged in!</p> : <p>You are logged out!</p>}
    </div>
  );
}
