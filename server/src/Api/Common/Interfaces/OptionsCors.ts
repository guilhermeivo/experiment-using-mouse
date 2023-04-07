interface OptionsCors {
    origins?: string | Array<string>,
    headers?: string | Array<string>,
    methods?: string | Array<string>
}

const defaults: OptionsCors = {
    origins: 'null',
    headers: 'null',
    methods: 'null'
}

export { OptionsCors, defaults }