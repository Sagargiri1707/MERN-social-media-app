import React from 'react';
import { Link ,withRouter} from 'react-router-dom'
const axios = require('axios')




function navbar({ history }) {

    const isAuthenticated = () => {
        if (typeof(window) == "undefined")
        {
            return false
        }
        if (localStorage.getItem('jwt')) {
            return  JSON.parse(localStorage.getItem('jwt'))
        }
        else {
            return false
        }
    }
    const signout = () => {
        if(typeof(window) !== "undefiend")
            localStorage.removeItem('jwt')
        axios
            .post('/auth/signout')
            .then(res => {
                console.log(res)
            })
            .catch(err => {
            console.log(err);
            })
        history.push('/')
    }

    
    const isActive = (history, path) => {
        if (history.location.pathname === path)
            return {
                color:"#e7fe09"
            }
        else
            return {
                color: "#ffffff"
            } 
    }
    return (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item" >
                <Link
                    className="nav-link"
                    style={
                        isActive(history, '/')
                    }
                    
                    to="/">
                    Home
                     </Link>
            </li>
            <li className="nav-item" >
                <Link
                    className="nav-link"
                    style={
                        isActive(history, '/users')
                    }
                    
                    to="/users">
                    Users
                     </Link>
            </li>
            {
                !isAuthenticated() && (
                    <>
                         <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={
                                    isActive(history, '/signup')
                                }
                                to="/signup">
                                Signup
                                </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={
                                isActive(history, '/signin')
                            }
                                to="/signin">
                                Signin
                                </Link>
                        </li>

                    </>
                )
            }

            {
                isAuthenticated() && (
                    <>
                         <li className="nav-item">
                         <Link
                                to={`/findpeople`}
                                className="nav-link"
                                style={isActive(history, `/findpeople`)}
                            >
                        Find people
                        </Link>
                    </li>
                   
                        <li className="nav-item">
                           
                            <Link
                                to={`/profile/${isAuthenticated().user._id}`}
                                className="nav-link"
                                style={isActive(history, `/profile/${isAuthenticated().user._id}`)}
                            >
                        Profile   
                        </Link>
                        
                        </li>
                        <li className="nav-item">
                            <span
                                className="nav-link"
                                style={
                                    isActive(history, '/signout'), {
                                cursor: 'pointer', color: "#fff"
                                }
                            }
                            onClick={signout} >
                            Signout
                        </span>
                    </li>
                    </>
    
                )

                
            }
           

        </ul>
    );
}

export default withRouter(navbar);