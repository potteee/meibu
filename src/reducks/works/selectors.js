import {createSelector} from 'reselect';

const workSelector = (state) => state.works;

export const getWorkId = createSelector(
    [workSelector],
    state => state.workId
    )

export const getWorkName = createSelector(
    [workSelector],
    state => state.workName
    )

export const getWorkScore = createSelector(
    [workSelector],
    state => state.workScore
)