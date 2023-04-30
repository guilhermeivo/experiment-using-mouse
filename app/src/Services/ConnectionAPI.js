const urlServer = import.meta.env.VITE_API_URL

const typeMethods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'POST'
}

export default (() => {
    const Register = (callback) => {
        try {
            const path = `${ urlServer }/account/register`
            const client = new XMLHttpRequest()
            client.onreadystatechange = () => {
                if (client.readyState == XMLHttpRequest.DONE) {
                    callback(JSON.parse(client.responseText))
                }
            }
            client.open(typeMethods.POST, path, false)
            client.withCredentials = true
            client.send()
        }  catch {
            const message = document.querySelector('message-info')
            message.addMessageInfo({ description: 'Error when trying to connect to the server, probably the server is off.', type: 'warn' })
        }
    }

    const CreateMaze = (name, base64image, description = 'description') => {
        const path = `${ urlServer }/api/maze?name=${ name }&description=${ description }`
        
        return httpConnection(path, typeMethods.POST, { base64image: base64image })
    }

    const UpdateMaze = (id, name, base64image) => {
        const path = `${ urlServer }/api/maze/${ id }?name=${ name }`
        
        return httpConnection(path, typeMethods.PUT, { base64image: base64image })
    }

    const GetMaze = () => {
        const path = `${ urlServer }/api/maze`
        
        return httpConnection(path, typeMethods.GET)
    }

    const GetMazeById = (id) => {
        const path = `${ urlServer }/api/maze/${ id }`
        
        return httpConnection(path, typeMethods.GET)
    }

    const httpConnection = (url, method, body = { }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url, {
                    method: method,
                    credentials: 'include',
                    body: JSON.stringify(body)
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
        Register,
        CreateMaze,
        UpdateMaze,
        GetMazeById
    }
})()