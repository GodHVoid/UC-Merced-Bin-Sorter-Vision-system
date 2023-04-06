import React from "react";

const url = "http://localhost:3000";

// import React, {useState} from "react";
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';

// function Login(){
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const history = useHistory();

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const data = {
//             email,
//             password
//         }
//         try{
//             const response = await axios.post('/app/login', data);
//             if (response.data === 'success'){
//                 history.push('/livefeed');
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     return(
//         <form onSubmit={handleSubmit} className = "loginForm">
//             <label>
//                 Email:
//                 <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
//             </label>
//             <label>
//                 Password:
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             </label>
//             <button type="submit">Login</button>
//         </form>
//     );
// }
// export default Login;


function checkLogin() {
  fetch(url + "/api/login", {
    method: "GET", 
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
    .then(data => console.log(data))
}

function Login() {
  return (
    <div className="Login">
      <form onSubmit={ checkLogin() } className="LoginForm">
        <label htmlFor="sorter-id">ID</label>
        <input type="text" />
        <br />
        <label htmlFor="sorter-password">Password</label>
        <input type="password" />
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;