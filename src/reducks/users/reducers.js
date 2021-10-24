import * as Actions from './actions';
import initialState from '../store/initialState';

export const UsersReducer = (state = initialState.users, action) => {
    //ここが最初に読まれてるっぽいからココでクッキー読み込む => SSRの箇所だからできない。

    console.log("+action.type@UsersReducer")
    console.log(action.type)
    console.log(JSON.stringify(state)+"+state@UsersReducer")
    console.log(JSON.stringify(action.payload)+"+action.payload@UsersReducer")
    
    // console.log(state+"+state@UsersReducer")
    switch (action.type) {
        case Actions.SIGN_IN:
            console.log("SIGN_IN")
            return {
                //スプレッド構文＋マージ構文
                //それぞれの連想配列を展開して、同じ項目があった場合、
                //後に出てきたものを採用してreturnする。
                ...state,
                ...action.payload
            }
        case Actions.SIGN_OUT:
            return {
                ...initialState.users,
            }
        case Actions.UPDATE_USERS:
            return {
                ...state,
                ...action.payload
            }
        case Actions.POST_WORK:
            // console.log(JSON.stringify(state)+"state reducer")
            // console.log(JSON.stringify(action.payload)+"action.payload reducer")
            return {
                ...state,
                userAssessmentWorks : {
                    ...state.userAssessmentWorks,
                    ...action.payload.userAssessmentWorks
                },
                instantChangedWorkId : {
                    ...state.instantChangedWorkId,
                    ...action.payload.instantChangedWorkId
                }
            }
        case Actions.LIKED_WORK:
            // console.log(JSON.stringify(state)+"state reducer")
            // console.log(JSON.stringify(action.payload)+"action.payload reducer")
            return {
                ...state,
                userAssessmentWorks : {
                    ...state.userAssessmentWorks,
                    ...action.payload.userAssessmentWorks
                },
                instantChangedWorkId : {
                    ...state.instantChangedWorkId,
                    ...action.payload.instantChangedWorkId
                }
            }
        case Actions.DELETE_ASSESSMENT:
            return {
                ...state,
                userAssessmentWorks : actions.payload.userAssessmentWorks
            }
        default:
            console.log("default")
            return state
    }
}