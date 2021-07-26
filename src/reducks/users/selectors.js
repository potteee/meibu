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

export const getUserSex = createSelector(
    [usersSelector],
    state => state.userSex
)

export const getUserProfile = createSelector(
    [usersSelector],
    state => state.userProfile
)

export const getUserEmail = createSelector(
    [usersSelector],
    state => state.userEmail
)

export const getUserLiveIn = createSelector(
    [usersSelector],
    state => state.userLiveIn
)

export const getUserWebsite = createSelector(
    [usersSelector],
    state => state.userWebsite
)

export const getUserBirthday = createSelector(
    [usersSelector],
    state => state.userBirthday
)

export const getUserAssessmentWorks = createSelector(
    [usersSelector],
    state => state.userAssessmentWorks
)

export const getUserBookmark = createSelector(
    [usersSelector],
    state => state.userBookmark
)