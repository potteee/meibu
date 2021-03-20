import {createSelector} from 'reselect';

const usersSelector = (state) => state.users;

export const getIsSignedIn = createSelector(
    [usersSelector],
    state => state.isSignedIn
)
export const getUserId = createSelector(
    [usersSelector],
    state => state.uid
)
export const getRole = createSelector(
    [usersSelector],
    state => state.role
)
export const getUserName = createSelector(
    [usersSelector],
    state => state.userName
)
export const getUserImage = createSelector(
    [usersSelector],
    state => state.userImage
)


// export const getUserEmail = createSelector(
//     [usersSelector],
//     state => state.userEmail
// )

// export const getUserProfile = createSelector(
//     [usersSelector],
//     state => state.userProfile
// )


// export const getPostWorksId = createSelector(
//     [usersSelector],
//     state => state.postNumber
// )