export default class PaginatedList<T> {
    public Items: Array<T>
    public PageIndex: number
    public TotalPages: number
    public TotalCount: number
    public HasPreviousPage: boolean
    public HasNextPage: boolean

    constructor(items: Array<T>, count: number, pageIndex: number, pageSize: number) {
        this.PageIndex = pageIndex
        this.TotalPages = Math.ceil(count / pageSize)
        this.TotalCount = count
        this.Items = items
        this.HasPreviousPage = this.PageIndex > 1
        this.HasNextPage = this.PageIndex < this.TotalPages
    }
}