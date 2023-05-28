import IEntityBase from "../common/interfaces/IEntityBase";

export default interface user extends IEntityBase {
    email: string,
    username: string,
    emailConfirmed: boolean,
    createdAt?: Date,
    createdByIp?: string
}