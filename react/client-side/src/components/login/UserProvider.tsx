import { createContext, Dispatch, ReactNode, useReducer } from "react"
import reducerUsers, { Action, User } from "./ReducerUsers";
const initUsers: User = { email: '', password: '' }
export const UsersContext = createContext<{ state: User, dispatch: Dispatch<Action> } | undefined>(undefined);
const UserProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducerUsers, initUsers)
    return (<>
        <UsersContext value={{ state, dispatch }}>
            {children}
        </UsersContext>
    </>)
}
export default UserProvider

