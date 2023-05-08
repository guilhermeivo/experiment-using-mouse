import entityBase from "../common/interfaces/entityBase";

export default interface user extends entityBase {
    email: string,
    username: string,
    emailConfirmed: boolean,
    createdAt?: Date,
    createdByIp?: string
}