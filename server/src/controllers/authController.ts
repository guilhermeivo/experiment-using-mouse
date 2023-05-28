import IControllerProps from "../common/interfaces/IControllerProps"
import { authenticateUser, loginUser, logoutUser, registerUser, verifyEmailUser } from "../identity/identityService"

export default () => {
    const register: IControllerProps = {
        method: `POST('register')`,
        handle: registerUser
    }

    const logout: IControllerProps = {
        method: `POST('logout')`,
        handle: logoutUser
    }

    const verifyEmail: IControllerProps = {
        method: `POST('verify-email')`,
        handle: verifyEmailUser
    }

    const login: IControllerProps = {
        method: `POST('login')`,
        handle: loginUser
    }

    const authenticate: IControllerProps = {
        method: `POST('authenticate')`,
        handle: authenticateUser
    }

    return [ register, logout, verifyEmail, login, authenticate ]
}