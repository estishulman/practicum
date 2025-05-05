export type User = {
    id?: number
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    address?: string
    phone?: string
}
export type Action = {
    type: 'LOGIN_USER'
    data: User
} | {
    type: 'UPDATE_USER' | 'Add_USER'
    data: Partial<User> & { email: string }
} | {
    type: 'DELETE_USER'
    email: string
}
export default (state: User, action: Action): User => {
    switch (action.type) {
        case 'LOGIN_USER':
            return action.data
        case 'UPDATE_USER':
            return action.data
        case 'Add_USER':
            return { ...state, ...action.data }
        default:
            return state
    }
}
