import React,{useState} from 'react';
import {Redirect} from 'react-router-dom'
const axios = require('axios')

function Deleteuser({ userId }) {
    const [redirect, setRedirect] = useState(false)
    
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
    const signout = () => {
        if(typeof window !== "undefiend")
            localStorage.removeItem('jwt')
        axios
            .post('/auth/signout')
            .then(res => {
                console.log(res)
            })
            .catch(err => {
            console.log(err);
            })
    }
    const deleteAccount = () => {
        axios
        .delete(`/user/removeuser/${userId}`, {
            headers:{
            Accept: 'application/json',
            ContentType: 'application/json',
            Authorization:`Bearer ${isAuthenticated().token}`
            }
        })
            .then(res => {
                if (res.error) {
                    console.log('failed');
                }
                else {
                    signout()
                    setRedirect(true)
                }

        })
        .catch(err => {
            throw err
        })
        
    }
    const deleteConfirm = () => {
        let answer = window.confirm("Are you sure to delete the account")
        if (answer) {
            deleteAccount()
        }

        
    }
    if (redirect) {
        return <Redirect to="/"/>
    }
    else   return (
            <button onClick={deleteConfirm} className="btn btn-raised btn-danger">
                Delete account
            </button>
    );
}

export default Deleteuser;