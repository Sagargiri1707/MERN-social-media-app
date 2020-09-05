import React,{useState} from 'react';
import {Redirect } from 'react-router-dom'
const axios = require('axios')

function Signup(props) {
    const [credential, setCredential] = useState({
        email: "",
        password: ""
    })
    const [redirect,setRedirect]=useState(false)
    const [error, setError] = useState()
    const [loading,setLoading]=useState(false)
    const handleChange = (e) => {
        setError()

       var  name =e.target.name
        var value=e.target.value
        setCredential(prevState => ({
            ...prevState,
            [name]: value
        }))   
    }
    const authenticate = (data, next) => {
        
        if (typeof (window) !== 'undefined') {
            console.log(123);
            
            localStorage.setItem("jwt",JSON.stringify (data))
        }
        next()
    }
    const submitForm = (e) => {
        e.preventDefault()
        setError()
        setLoading(true)
        const user = {
            "email":credential.email,
            "password":credential.password
        }        
        
        
        axios
            .post(`/auth/signin`, user)
            .then(res => {  
                setLoading(false)
                if (res.data.error && res.data.error.length > 0)
                {
                    setError(res.data.error)     
                }
                else if (res.data) {                    
                    authenticate(res.data, () => {
                        setRedirect(true)
                    }) 
                    
                }
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            })
            setError()
                    
            setCredential(
                {
                      email: "",
                    password: "",
                    open:true
                }
            )
           
        
    }
    const { email, password } = credential
    if (redirect)
    {
        return (
            <Redirect to='/'/>
        )
    }
    
    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Signin</h2>
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
                loading ?
                    <div className="jumbotron text-center">loading</div>
                    :
                    <></>
           }
           
            
            <form onSubmit={submitForm}>

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