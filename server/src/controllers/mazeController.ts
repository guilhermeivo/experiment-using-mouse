import IControllerProps from "../common/interfaces/IControllerProps"
import authGuard from "../middleware/authGuard"
import createMaze from "../services/maze/commands/createMaze"
import addViewMaze from "../services/maze/commands/addViewMaze"
import updateMaze from "../services/maze/commands/updateMaze"
import toogleLikeMaze from "../services/maze/commands/toogleLikeMaze"
import getByIdMaze from "../services/maze/queries/getByIdMaze"
import getByUserMaze from "../services/maze/queries/getByUserMaze"
import getAllMaze from "../services/maze/queries/getAllMaze"
import getBySearchWithPaginationMaze from "../services/maze/queries/getBySearchWithPaginationMaze"
import getAllWithPaginationMaze from "../services/maze/queries/getAllWithPaginationMaze"

export default () => {
    const getWithPagination: IControllerProps = {
        method: `GET('pagination')`,
        auth: authGuard,
        handle: getAllWithPaginationMaze
    }

    const getBySearchWithPagination: IControllerProps = {
        method: `GET('pagination/search')`,
        auth: authGuard,
        handle: getBySearchWithPaginationMaze
    }

    const getAll: IControllerProps = {
        method: `GET`,
        auth: authGuard,
        handle: getAllMaze
    }

    const getByUser: IControllerProps = {
        method: `GET('user')`,
        auth: authGuard,
        handle: getByUserMaze
    }

    const getById: IControllerProps = {
        method: `GET('id')`,
        auth: authGuard,
        handle: getByIdMaze
    }

    const toggleLike: IControllerProps = {
        method: `POST('like')`,
        auth: authGuard,
        handle: toogleLikeMaze
    }

    const addView: IControllerProps = {
        method: `POST('view')`,
        auth: authGuard,
        handle: addViewMaze
    }

    const create: IControllerProps = {
        method: `POST`,
        auth: authGuard,
        handle: createMaze
    }

    const update: IControllerProps = {
        method: `POST('update')`,
        auth: authGuard,
        handle: updateMaze
    }

    return [ getAll, getByUser, getById, toggleLike, addView, create, update, getWithPagination, getBySearchWithPagination ]
}