const axios = require('axios')

export const create = (userId, token, post) => {
    return axios
        .post(`/post/new/${userId}`,post,
            { 
            headers:{
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    ContentType: "application/json",
                }
            })
        .then(res => {
            return res.json()
        })
        .catch(err => {
            console.log(err)
        })
}