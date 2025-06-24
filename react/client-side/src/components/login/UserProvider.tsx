// import { createContext, Dispatch, ReactNode, useReducer } from "react"
// import reducerUsers, { Action, User } from "./ReducerUsers";
// const initUsers: User = { email: '', password: '' }
// export const UsersContext = createContext<{ state: User, dispatch: Dispatch<Action> } | undefined>(undefined);
// const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [state, dispatch] = useReducer(reducerUsers, initUsers)
//     return (<>
//         <UsersContext value={{ state, dispatch }}>
//             {children}
//         </UsersContext>
//     </>)
// }
// export default UserProvider




import { createContext, useReducer, ReactNode } from "react";

export type User = {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    address?: string;
    phone?: string;
};

export type Action =
    | { type: "LOGIN_USER"; data: User }
    | { type: "UPDATE_USER" | "ADD_USER"; data: Partial<User> & { email: string } }
    | { type: "DELETE_USER"; email: string };

const initialState: User = {};

function userReducer(state: User, action: Action): User {
    switch (action.type) {
        case "LOGIN_USER":
            return action.data;
        case "UPDATE_USER":
        case "ADD_USER":
            return { ...state, ...action.data };
        case "DELETE_USER":
            return state.email === action.email ? {} : state;
        default:
            return state;
    }
}

export const UsersContext = createContext<{
    state: User;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UsersContext.Provider value={{ state, dispatch }}>
            {children}
        </UsersContext.Provider>
    );
};
