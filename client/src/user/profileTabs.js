import React from 'react';
import { Link } from 'react-router-dom'
function ProfileTabs(props) {
    
    return (
        <div className="row">
        <div className="col-md-4">
            <h3 className="text-primary">
                Followers
            </h3>
                <hr />
                                                

                {
                    
                props.followers.map((person, i) => {
                    
                    return (
                        <div key={i}>


                            <Link to={`/profile/${person._id}`}>

                                    <img 
                                        className="float-left mr-2 mt-2"
                                        style={{height:'30px',width:'30px',borderRadius:'50%'}}
                                        src={`http://localhost:5001/user/getphoto/${person._id}`}
                                        alt={ 'user'}
                                        onError={i =>
                                            {
                                                  i.target.src=require('../images/avatar.png')
                                            }}
                                    />
                                    <p className="lead">{person.name}</p>
                                    </Link>  
                                    </div>


                        )
            
                    })
            
                    }

                             
        </div>
        <div className="col-md-4">
                <h3 className="text-primary">
                    Following
                </h3>
                <hr />
                {
                    props.following.map((person, i) => {
                        
                        return (
                            <div key={i}>


                                <Link to={`/profile/${person._id}`}>

                                        <img 
                                            className="float-left mr-2 mt-2"
                                            style={{height:'30px',width:'30px',borderRadius:'50%'}}
                                            src={`http://localhost:5001/user/getphoto/${person._id}`}
                                            alt={ 'user'}
                                            onError={i =>
                                                {
                                                      i.target.src=require('../images/avatar.png')
                                                }}
                                        />
                                        
                                        <p className="lead">{person.name}</p>
                                        </Link>  
                                        </div>

    
                            )
                
                        })
                
                }
                                 
            </div>
            
        </div>
    );
}

export default ProfileTabs;