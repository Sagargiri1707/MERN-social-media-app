import React from 'react';
import { Route,Redirect } from 'react-router-dom'

function PrivateRoute({component:Component,...rest}) {
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
  

    return (
        <Route
            {...rest}
            render={
                props =>
                    isAuthenticated() ? (
                        <Component {...props}/>
                    ) : (
                            <Redirect 
                                to={{
                                    pathname: '/',
                                    state: {
                                        from :props.location
                                    }
                                }}/>
                    )
            } />
    )
}

export default PrivateRoute;