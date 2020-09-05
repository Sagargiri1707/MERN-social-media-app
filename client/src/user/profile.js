import React,{useState,useEffect} from 'react';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import  DeleteProfile from './deleteuser'
import ProfileTabs from './profileTabs';
const axios = require('axios')

function Profile(props) {
 const [user, setUser] = useState()
    const [redirect, setRedirect] = useState(false)
    const [following,setFollowing]=useState(false)
    const [error,setError]=useState()
    useEffect(() => {        
        axios
            .get(`/user/${props.match.params.userId}`, {
                headers:{
                Accept: 'application/json',
                ContentType: 'application/json',
                Authorization:`Bearer ${isAuthenticated().token}`
                }
            })
            .then(res => {
                if (res.error) {
                    setRedirect(true)
                }
                else {
                    setUser(res.data)
                    checkFollow(res.data)
                }
            })
            .catch(err => {
                throw err
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
    const checkFollow = (user) => {
        
        if (user) {
    
        const userId = isAuthenticated().user._id
            const match = user.followers.find(follower => {
                
               
            if (follower._id === userId)
            {                
                return true
            }
           });
            setFollowing(match)
            
              
        }
    }
    
    const followButton = () => {
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
                setUser(res.data)
                setFollowing(!following)
            }
           
            

    })
        .catch(err => {
            console.log(err);
    })
    }
    const unfollowButton = () => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        
        
        const unfollowId = user._id
        const data = ({ userId, unfollowId })
        
        axios
            .put(`/user/unfollow`,
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
                setUser(res.data)
                setFollowing(!following)
            }
           
            

    })
        .catch(err => {
            console.log(err);
    })
    }
    const {_id:id}=user||{id:""}
    const photourl = id? `http://localhost:5001/user/getphoto/${id}?${new Date().getTime()}`:require('../images/avatar.png')
    if (redirect) {
        return <Redirect to="/signin"/>
    }
    else if(user)
    return (
        <div>
            {console.log(user)
            }
            <div className="container ">
            <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={photourl}
                            onError={i =>
                            {
                                  i.target.src=require('../images/avatar.png')
                            }}
                            alt={user.name || 'user display picture'}
                            style={{
                                height: '200px', width: "auto"    
                            }}
                            className="img-thumbnail"
                            
                        />
                        
                    </div>
                    <div className="col-md-6">
                    <div className="lead mt-2">
                            <p>Name {user.name}</p>
                            <p>Email {user.email}</p>
                            {user.about? <p>About: <br/>{user.about||""}</p>: <></>}
                            <p>{`Joined ${new Date(user.created).toLocaleString()}`}</p>
                        </div>

                        {
                            isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ?
                            <div className="d-inline-block ">
                                <Link
                                    to={`/user/edit/${user._id}`}
                                    className="btn btn-raised btn-success mr-5"
                                >
                                    Edit Profile
                                </Link>
                                    <DeleteProfile userId={user._id}/>
                            </div>
                                :
                                <div className="d-inline-block">
                                {
                                    !following ?
                                    <button onClick={followButton} className="btn btn-success btn-raised mr-5">
                                        Follow
                                    </button> :
                                        <button onClick={unfollowButton} className="btn btn-danger btn-raised ">
                                            Unfollow
                                        </button>
                                        
                                }
                                </div>
                
                                
                        }
                    </div>
                
                </div>
                <hr /> 

                <ProfileTabs followers={user.followers} following={user.following} />

                
            </div>
        </div>
        );
    else 
        return <div className="jumbotron">
            <h1>Loading</h1>
        </div>
}

export default Profile;