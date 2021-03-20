import * as Actions from './actions';
import initialState from '../store/initialState';

export const WorksReducer = (state = initialState.works, action) => {
    //ここが最初に読まれてるっぽいからココでクッキー読み込む => SSRの箇所だからできない。

    console.log(action.type+"+action.type@WorksReducer")
    console.log(JSON.stringify(state)+"+state@WorkssReducer")
    console.log(JSON.stringify(action.payload)+"+action.payload@WorksReducer")
    
    // console.log(state+"+state@UsersReducer")
    switch (action.type) {
        case Actions.POST_WORK:
            return {
                ...state,
                ...action.payload
            }
        // case Actions.SIGN_OUT:
        //     return {
        //         ...initialState.users,
        //     }
        default:
            return state
    }
}