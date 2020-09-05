import React,{useState} from 'react';
import {Link } from 'react-router-dom'

const axios = require('axios')
function Signup(props) {
    const [credential, setCredential] = useState({
        name: "",
        email: "",
        password: "",
        open:false
    })
    const [error, setError] = useState()
    const handleChange = (e) => {
        setError()

       var  name =e.target.name
        var value=e.target.value
        setCredential(prevState => ({
            ...prevState,
            [name]: value
        }))   
    }
    const submitForm = (e) => {
        e.preventDefault()
        setError()
        
        const user = {
            "name":credential.name,
            "email":credential.email,
            "password":credential.password
        }          
        axios
            .post('/auth/signup', (user))
            .then(res => {  
                if (res.data.error && res.data.error.length>0)
                {
                    setError(res.data.error)     
                }
                else if (res.data.message) {

                     setError()
                   setCredential({
                        name: "",
                        email: "",
                        password: "",
                        open: true
                    })
                    
                }
            })
            .catch(err => {
                console.log(err);
        })
        
        
    }
    const {name,email,password,open}=credential
    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Signup</h2>
            {
                error ?
                    
                    error.map((data, id) => {
                            return (
                                <div key={id} className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <p>{data}</p>
                                </div>
                            )
                        }) 
                    :
                    <></>
                    
            }
           
            {
                open ?
                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                           <p>Account created please <Link to="/signin">Signin</Link></p>
                        </div>
                    :
                    <></>
                    
            }
            
            <form onSubmit={submitForm}>

                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" className="form-control" name="name" value={name} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input type="email" className="form-control" name="email" value={email} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input type="password" className="form-control" name="password" value={password} onChange={handleChange}/>
                </div>
                <button className="btn btn-raised btn-primary" type="submit" >Submit</button>
            </form>

        </div>
    );
}

export default Signup;