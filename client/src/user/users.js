import React, { useState, useEffect } from 'react';
import {Link } from 'react-router-dom'

const axios = require('axios')
function Users(props) {
    const [users,setUsers]=useState()
    useEffect(() => {
        axios
            .get('/user/getusers')
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                }
                else 
                setUsers(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    if(users)
    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Users</h2>
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
                                        <Link to={`/profile/${data._id}`} className="btn btn-raised btn-primary btn-sm">link to profile</Link>
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