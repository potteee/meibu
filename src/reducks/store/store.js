import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import {UsersReducer} from '../users/reducers'
// import {WorksReducer} from '../works/reducers'
//　リロード（更新）時データ保持機構
// import persistState from "redux-localstorage";
// import {WorksReducer} from '../works/reducers'//未作成

//developper tool
const bindMiddleware = (middleware) => {
    console.log("bindMiddleware")
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension')
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
    users: UsersReducer,
    // works: WorksReducer,
})

//HYDRETE SSR時にサーバサイドで生成された任意の State をクライアント側に移譲する処理
const reducer = (state, action) => {
    console.log("reducer@store")
    if (action.type === HYDRATE){
        const nextStage = {
            ...state, //use previos state
            ...action.payload, //apply delta from hydration
        } 
        //reducerがクライアント側で引き継ぐべき値であったら・・・今のところない。
        // if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
        // console.log("reducer if")
        console.log(action.type+"+action.type@reducer true")
        return nextStage
    } else {
        console.log(action.type+"+action.type@reducer else")
        // const cookiesDocument = document.cookie

        //ここ?を直さないと
        // return compose(persistState())(combinedReducer(state,action))
        return combinedReducer(state,action)
    }
}

const initStore = () => {
    // return compose(persistState())(createStore(reducer, bindMiddleware([thunkMiddleware])))
    console.log("initStore")
    return createStore(reducer, bindMiddleware([thunkMiddleware]))
}

export const wrapper = createWrapper(initStore)




