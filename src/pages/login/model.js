
import * as api from './service';
import { notification } from 'antd';
import { routerRedux } from 'dva';

export default {
    namespace: 'login',
    state: {
        isError: false
    },
    effects: {
        *login({ payload }, { call, put }) {
            sessionStorage.setItem("isLogin", true);
            yield put(routerRedux.push('/knowledge/eating'));
            // const { password, ...rest } = payload;
            // const { status } = yield call(api.login, { password: password, ...rest });
            // if (status === 0) {
            //     sessionStorage.setItem("isLogin", true);
            //     yield put(routerRedux.push('/knowledge/eating'));
            // } else {
            //     yield put({
            //         type: 'save',
            //         payload: {
            //             isError: true
            //         }
            //     });
            //     notification.error({
            //         message: '用户名或密码错误，请重新登录。',
            //     });
            // }
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
