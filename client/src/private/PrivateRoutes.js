import { Navigate } from 'react-router'


const LoggedIn = ({ children, user }) => {
    return user ? children : <Navigate to="/auth" />
}

const LoggedOut = ({ children, user }) => {
    return !user ? children : <Navigate to="/compte" />
}


const Subscriber = ({ children, user }) => {
    return user && (user.subscriber || user.adminLvl > 0) ? children : <Navigate to="/" />
}

const SubscriberGC = ({ children, user }) => {
    return user && (user.subscriber || user.adminLvl > 0) ? children : <Navigate to="/" />
}

const IsAdmin = ({ children, user }) => {
    return user && user.adminLvl > 0 ? children : <Navigate to="/" />
}


export {
    LoggedIn,
    LoggedOut,
    Subscriber,
    SubscriberGC,
    IsAdmin
}