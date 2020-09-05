
import React, { useState, useEffect } from 'react';
import {Link } from 'react-router-dom'

const axios = require('axios')
function Users(props) {
    const [users, setUsers] = useState()
    const [error, setError] = useState()
    const [open, setOpen] = useState(false)
    const [userfollowed,setUserFollowed]=useState('')
    useEffect(() => {
       const userId = isAuthenticated().user._id
       const token=isAuthenticated().token

    axios.get(`/user/findpeople/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                ContentType: "application/json",
            }
        })
        .then(res => {
            setUsers(res.data)
        })
        .catch(err => {
        console.log(err);
        
    })
    
    
        
    }, [])
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
    const setFollow = (user,index) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        
        
        const followId = user._id
        const data = ({ userId, followId })
        
        axios
            .put(`/user/follow`,
            data,
            { 
            headers:{
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    ContentType: "application/json",
                }
        })
        .then(res => {
            if (res.error) {
                setError(res.error)    
            }
            else {
                let tofollow = users
                tofollow.splice(index, 1)
                setUsers(tofollow)
                setOpen(true)
                setUserFollowed(`followed :: ${user.name}`)

                    
            }
            
    })
        .catch(err => {
            console.log(err);
    })
    }
    if(users)
    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Users</h2>
            {open &&
                <div className="alert alert-success">
                <p>{userfollowed}</p>
            </div>
            }
            <div className="row">
            {                
                
                    users ?
                    users.map((data,id) => {
                            return(
                                <div key={id} className="card col-4">
                                    <img
                                        className="card-img-top"
                                        src={`http://localhost:5001/user/getphoto/${data._id}?${new Date().getTime()}`}
                                        onError={i => {
                                            i.target.src=require('../images/avatar.png')
                                        }}
                                        style={{width:'100%',height:"15vw",objectFit:'cover'}}
                                        alt={data.name} />
                                <div className="card-body">
                                        <h5 className="card-title">{data.name}</h5>
                                        <p className="card-text">
                                            {data.email}
                                        </p>
                                        <Link to={`/profile/${data._id}`} className="btn btn-raised btn-primary btn-sm"> profile</Link>

                                        <button onClick={()=>setFollow(data,id)} className="btn btn-raised btn-info float-right btn-sm">
                                            Follow
                                        </button>
                                </div>
                            </div>
                            )
                    })
                    : <></>
                }
                </div>
            </div>
        );
    else {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>
                <h1>Loading</h1>
            </div>
        )
    }
}

export default Users;
