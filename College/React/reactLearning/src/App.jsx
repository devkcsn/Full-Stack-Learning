// import { useState } from "react";

// function Counter() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <h2>Counter Example</h2>
//       <p>Current count: {count}</p>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//       <button onClick={() => setCount(count - 1)}>Decrement</button>
//     </div>
//   );
// }

// function Toggle() {
//   const [isOn, setIsOn] = useState(false);
//   function buttonclicked() {
//     if(isOn === false){
//         setIsOn(true);
//     }
//     else{
//         setIsOn(false);
//     }
//   }
//   return (
//     <div>
//       <h2>Toggle Example</h2>
//       <p>Status: {isOn ? "ON" : "OFF"}</p>
//       <button onClick={buttonclicked}>Toggle</button>
//     </div>
//   );
// }

// function FormControl() {
//   const [name, setName] = useState("");
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Hello ${name}, form submitted!`);
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

// function App() {
//   return (
//     <div>
//       <Counter />
//       <Toggle />
//       <FormControl />
//     </div>
//   );
// }

// export default App;

// import React,{useState, useEffect} from 'react';

// export default function UseEffectExample() {
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

//Data Fetching
// import React,{useState , useEffect} from "react" ;

// export default function DataFetching() {
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

// Day 2

// import React, { useState } from "react";
// import './App.css';
// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   return (
//     <div
//       style={{
//         fontFamily: "Arial",
//         textAlign: "center",
//         marginTop: "50px",
//         padding: 20,
//       }}
//     >
//       <h1>Conditional Rendering Example</h1>
//       <h1 class="beti-heading">{isLoggedIn ? "Welcome Back!" : "Please Log In"}</h1>
//       {/* Button se login /logout toggle karenge */}
//       <button class="btn" onClick={() => setIsLoggedIn(!isLoggedIn)}>
//         {isLoggedIn ? "Log Out" : "Log In"}
//       </button>
//       {/* Conditional Rendering */}
//       {isLoggedIn ? <p>You are logged in!</p> : <p>You are logged out!</p>}
//     </div>
//   );
// }

// And and OR operator
// import React, { useState } from "react";
// export default function App() {
//   const [showMessage, setShowMessage] = useState(false);
//   return (
//     <div style={{ fontFamily: "sans-serif", padding: 20 }}>
//       <h1>Logical And ( && ) Example </h1>
//       {/* Toggle Button */}
//       <button onClick={() => setShowMessage(!showMessage)}>
//         {showMessage ? "Hide" : "Show"}message
//       </button>
//       {/* Conditiona Rendering with && operator */}
//       {showMessage && (
//         <p>Hello This message is only visible when showMessage = true.</p>
//       )}
//     </div>
//   );
// }

// Day 3
// import React from "react";
// function App(){
//     const fullName = "Madharchod potter";
//     const firstName = fullName.slice(0, 11);
//     const lastName = fullName.slice(-6);
//     return(
//         <div>
//             <h2>Full Name: {fullName}</h2>
//             <p>First Name: {firstName}</p>
//             <p>Last Name: {lastName}</p>
//         </div>
//     );
// }
// export default App;

// Sub-string
// import React from "react";
// function App(){
//     const fullName = "Madharchod potter";
//     const firstName = fullName.substring(0, 11);
//     const lastName = fullName.substring(6);
//     return(
//         <div>
//             <h2>Full Name: {fullName}</h2>
//             <p>First Name: {firstName}</p>
//             <p>Last Name: {lastName}</p>
//         </div>
//     );
// }
// export default App;

// Includes
// import React from "react";
// function App(){
//     const text = "Gand mari teri gand mari gali gali teri gand mari";
//     const hasString = text.includes("gand");
//     const hasString2 = text.includes("chut");
//     return(
//         <div>
//             <h2>Full Name: {text}</h2>
//             <p>Includes String: {hasString.toString}</p>
//             <p>Includes String: {hasString2.toString}</p>
//         </div>
//     );
// }
// export default App;

//Day 4 Promises

// import React, { useEffect, useState } from "react";

// export default function App() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchdata = new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const success = true; // Simulate success or failure
//         if (success) {
//           resolve("Data fetched successfully!");
//         } else {
//           reject("Error fetching data.");
//         }
//       }, 2000);
//     });
//     fetchdata
//       .then((result) => {
//         setData(result);
//       })
//       .catch((err) => {
//         setError(err);
//       });
//   }, []);

//   return (
//     <div>
//       <h1>Promises Example</h1>
//       <p>(data || error || "Loading data....")</p>
//     </div>
//   );
// }

//Multiple Then - React Component

// import React, { useState, useEffect, useCallback } from "react";

// export default function App() {
//   const [status, setStatus] = useState("Not started");
//   const [steps, setSteps] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   function fetchData() {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve("Raw Data"), 2000);
//     });
//   }

//   function processData(data) {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(data + " => processed"), 1000);
//     });
//   }

//   function saveData(data) {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(data + " => saved"), 500);
//     });
//   }

//   const handleDataFlow = useCallback(() => {
//     setIsLoading(true);
//     setStatus("Starting data processing...");
//     setSteps([]);

//     fetchData()
//       .then((result) => {
//         console.log("Step 1", result);
//         setSteps(prev => [...prev, `Step 1: ${result}`]);
//         setStatus("Data fetched, processing...");
//         return processData(result);
//       })
//       .then((processed) => {
//         console.log("Step 2", processed);
//         setSteps(prev => [...prev, `Step 2: ${processed}`]);
//         setStatus("Data processed, saving...");
//         return saveData(processed);
//       })
//       .then((final) => {
//         console.log("Step 3", final);
//         setSteps(prev => [...prev, `Step 3: ${final}`]);
//         setStatus("All steps completed successfully!");
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error", error);
//         setStatus(`Error: ${error}`);
//         setIsLoading(false);
//       });
//   }, []);

//   // useEffect to automatically start data flow when component mounts
//   useEffect(() => {
//     console.log("Component mounted - starting data flow");
//     handleDataFlow();
    
//     // Cleanup function (optional)
//     return () => {
//       console.log("Component will unmount");
//     };
//   }, [handleDataFlow]); // Include handleDataFlow in dependency array


//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1>Promise Chain Example with useEffect</h1>
//       <div style={{ marginBottom: "20px" }}>
//         <button 
//           onClick={handleDataFlow} 
//           disabled={isLoading}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             backgroundColor: isLoading ? "#ccc" : "#28a745",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: isLoading ? "not-allowed" : "pointer"
//           }}
//         >
//           {isLoading ? "Processing..." : "Restart Data Flow"}
//         </button>
//         <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
//           Data flow starts automatically when component mounts. Click button to restart.
//         </p>
//       </div>
      
//       <div style={{ marginBottom: "20px" }}>
//         <h3>Status: {status}</h3>
//         {isLoading && (
//           <div style={{ color: "#007bff" }}>
//             ⏳ Loading...
//           </div>
//         )}
//       </div>

//       <div>
//         <h3>Processing Steps:</h3>
//         <ul>
//           {steps.map((step, index) => (
//             <li key={index} style={{ margin: "5px 0" }}>
//               {step}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

//Async Await

import { useEffect, useState } from "react";

function App() {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve("Data fetched successfully!");
                    }, 2000)
                );
                setMsg(result);
            } catch (err) {
                setMsg(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Async/Await Example</h1>
            <p>{msg || "Loading..."}</p>
        </div>
    );
}

export default App;