/**
 * unique value generator
 * 
 * @returns string
 */
export default () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}