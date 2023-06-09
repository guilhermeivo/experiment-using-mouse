const urlServer = import.meta.env.VITE_API_URL
const url = import.meta.env.VITE_URL

const typeMethods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'POST'
}

export default (() => {

    const RegisterUser = (username, email) => {
        const path = `${ urlServer }/auth/register`

        return httpConnection(path, typeMethods.POST, 
            { 
                username: username,
                email: email,
                redirectUri: `${ url }/register/verify-email`
            })
    }

    const VerifyEmail = (userId, emailToken) => {
        const path = `${ urlServer }/auth/verify-email`

        return httpConnection(path, typeMethods.POST, 
            { 
                userId: userId,
                emailToken: emailToken
            })
    }

    const LoginUser = (email) => {
        const path = `${ urlServer }/auth/login`

        return httpConnection(path, typeMethods.POST, 
            { 
                connection: 'email',
                email: email,
                send: 'code'
            })
    }

    const CodeUser = (email, otc) => {
        const path = `${ urlServer }/auth/authenticate`

        return httpConnection(path, typeMethods.POST, 
            { 
                email: email,
                otc: otc,
                realm: 'email'
            })
    }

    const GetMazes = () => {
        const path = `${ urlServer }/maze`

        return httpConnection(path, typeMethods.GET)
    }

    const GetMazeByUser = () => {
        const path = `${ urlServer }/maze/user`

        return httpConnection(path, typeMethods.GET)
    }

    const CreateMaze = (name, description, object) => {
        const path = `${ urlServer }/maze`

        return httpConnection(path, typeMethods.POST, {
            name: name,
            description: description,
            object: JSON.stringify(object)
        })
    }

    const UpdateMaze = (id, name, description, object) => {
        const path = `${ urlServer }/maze/update`

        return httpConnection(path, typeMethods.POST, {
            id: id,
            name: name,
            description: description,
            object: JSON.stringify(object)
        })
    }

    const ToggleLikeMaze = (idMaze) => {
        const path = `${ urlServer }/maze/like`

        return httpConnection(path, typeMethods.POST, {
            id: idMaze
        })
    }

    const GetMazeById = (idMaze) => {
        const path = `${ urlServer }/maze/id?id=${ idMaze }`

        return httpConnection(path, typeMethods.GET)
    }

    const addViewMaze = (idMaze) => {
        const path = `${ urlServer }/maze/view`

        return httpConnection(path, typeMethods.POST, {
            id: idMaze
        })
    }

    const GetBySearchWithPaginations = (pageNumber, pageSize, q, sortBy, filters) => {
        const path = `${ urlServer }/maze/pagination/search?pageNumber=${ pageNumber }&pageSize=${ pageSize }&q=${ q }&sortBy=${ sortBy }&filters=${ filters }`

        return httpConnection(path, typeMethods.GET)
    }

    const httpConnection = (url, method, body) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url, {
                    method: method,
                    credentials: 'include',
                    body: body ? JSON.stringify(body) : null
                }).then(response => response.json())
                .catch(() => { throw new Error('Error when trying to connect to the server, probably the server is off.') })

                if (response.Succeeded) {
                    resolve(response.Data)
                } else {
                    throw new Error(`There was an error processing the request (${ response.Message })`)
                }
            } catch (exception) {
                const message = document.querySelector('message-info')
                message.addMessageInfo({ description: exception.message, type: 'warn' })

                reject(exception.message)
            }
        })
    }
    
    return {
        RegisterUser, VerifyEmail, LoginUser, CodeUser, GetMazes, GetMazeByUser, CreateMaze, ToggleLikeMaze, GetMazeById, addViewMaze, UpdateMaze, GetBySearchWithPaginations
    }
    
})()