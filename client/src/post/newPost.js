import React, {
    useEffect,useState
} from 'react';
import { Redirect } from 'react-router-dom';
const axios = require('axios')
import {create } from './apiPost'

function NewPost(props) {
    const [redirect, setRedirect] = useState(false)
    const [error,setError]=useState([])
    const [formdata, setFormdata] = useState()
    const [loading, setLoading] = useState(false)
    const [fileSize,setFileSize]=useState(0)
    useEffect(() => {
        axios
            .get(`/user/${props.match.params.userId}`, {
                headers:{
                Accept: 'application/json',
                Authorization:`Bearer ${isAuthenticated().token}`
                }
            })
            .then(res => {
                if (res.error) {
                    setRedirect(true)
                }
                else { 
                    console.log(res.data);
                                        
                    setFormdata(res.data)
                    
                }
            })
            .catch(err => {
                throw err
            })
        
    }, [props.match.params.userId])
    
    const isAuthenticated = () => {
        if (typeof window == "undefined")
        {
            return false
        }
        if (localStorage.getItem('jwt')) {
            return JSON.parse(localStorage.getItem('jwt'))
        }
        else {
            return false
        }
    }
    const handleChange = (e) => {
        setError()
        var name = e.target.name
        
        var value = name === 'photo' ? (e.target.files[0]) : e.target.value
        const size = name === 'photo' ? (e.target.files[0].size) : 0
        setFileSize(size)
        setFormdata(prevState => ({
            ...prevState,
            [name]: value
        }))
        
    }
    const submitForm = (e) => {
        e.preventDefault()
        const form = new FormData()
        
        for (var x in formdata) {
            if (x === 'followers' || x === 'following')
            {
                form.set(x,JSON.stringify(formdata[x]))               

            }
            else
                form.set(x, formdata[x])               
            
            
        }
        
        const { name, email, password } = formdata
        let err = []
        
        if (fileSize > 1000000) {
            setLoading(false)
            err.push('File size limited to 1Mb')
        }
        if (password&& password.length < 6 ) {
            setLoading(false)
            err.push('Minimum length of password should be 6'
           ) 
        }
        if (name!==null && name.length < 4) {            
            setLoading(false)
            err.push('Minimum length of name should be 4')
        }

        if (email && !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)) {
            setLoading(false)
            err.push('not a valid mail id')
        }
        setError(err)
        
        if (err.length === 0)
        {
            setLoading(true)
           
            axios
            .put(`/user/updateuser/${props.match.params.userId}`,
                form,
                { 

                headers:{
                        Authorization: `Bearer ${isAuthenticated().token}`,
                        Accept: 'application/json',
                        ContentType: "multipart/form-data",
                    }
            })
            .then(res => {  
                if (res) {                            
                    setFormdata(res.data.user)
                    setRedirect(true)
                    
                }
                    
            })
            .catch(err => {
                console.log(err);
        })
        }
    }
    const {name,email,_id:id,about}=formdata||{name:"name",email:"email",_id:"",about:""}
    const photourl = id ? `http://localhost:5001/user/getphoto/${id}`: require('../images/avatar.png')
    if (redirect) {
        return <Redirect to={`/profile/${props.match.params.userId}`}/>
    }
    else return (
                   
            <div className="container">
            <h2 className="mt-5 mb-5">Editprofile</h2>
            {
                error? error.map((data, id) => {
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
                <div className="jumbotron text-center">
                    <h1>Loading...</h1>
                </div>
                :<></>
            }
            <img
                src={photourl}
                alt={name || 'user display picture'}
                style={{
                    height: '200px', width: "auto"
                }}
                onError={i =>
                    {
                          i.target.src=require('../images/avatar.png')
                    }}

                className="img-thumbnail"
            />
                <form encType="multipart/form-data" onSubmit={submitForm}>
                <div className="form-group">
                    <label className="text-muted">Profile image</label>
                    <input type="file" accept="image/*" className="form-control" name="photo" onChange={handleChange}/>
                </div>
                
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" className="form-control" name="name" value={name||""} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input type="email" className="form-control" name="email" value={email||""} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label className="text-muted">About</label>
                    <textarea type="email" className="form-control" name="about" value={about||""} onChange={handleChange}/>
                </div>
                
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input type="password" className="form-control" name="password"  onChange={handleChange}/>
                </div>
                <button className="btn btn-raised btn-primary" type="submit" >Update</button>
                </form>
        </div>
            
    );
}

export default NewPost;