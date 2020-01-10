
import * as api from '../services';
import { message } from 'antd';

export default {
  namespace: 'eating',
  state: {
    rowKey: 'id',
    dataSource: [],
    loading: false,
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0
    },
    searchContent: '',
    avator: null,
    food: '', // 食材
    categoryId: undefined, // 分类id
    categoryName: '',
    categoryList: [], // 分类数据
    eatingSort: '',
    keyWordList: [], // 关键字
    keyWord: '',
    canEatingList: [{ id: 1, name: '能吃' }, { id: 2, name: '慎吃' }, { id: 3, name: '禁止' }],
    canEatingSource: {
      pregnantStatus: undefined,
      puerperaStatus: undefined,
      sucklingStatus: undefined,
      babyStatus: undefined,
    },
    detailContent: '',
    url: ''
  },
  effects: {
    *getEatingList({ payload }, { call, put, select }) {
      const { pagination, searchContent } = yield select(state => state.eating);
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });
      const params = {
        content: searchContent,
        page: pagination.current,
        limit: pagination.pageSize
      };
      const result = yield call(api.getEatingList, params);
      const { data, code } = result;
      yield put({
        type: 'save',
        payload: {
          loading: false
        }
      });
      if (code === 0) {
        yield put({
          type: 'save',
          payload: {
            dataSource: data.list,
            pagination: {
              ...pagination,
              total: data.totalCount
            }
          }
        });
      }
    },
    *getCategoryList({ payload }, { call, put, select }) {
      const result = yield call(api.getCategoryList, { ...payload });
      const { data, code } = result;
      if (code === 0) {
        yield put({
          type: 'save',
          payload: {
            categoryList: data
          }
        });
      }
    },
    *delete({ payload }, { call, put }) {
      const result = yield call(api.deleteEating, { ...payload });
      const { code } = result;
      if (code === 0) {
        message.success('操作成功');
        yield put({
          type: 'getEatingList',
          payload: {}
        });
      }
    },
    *saveEatingFetch({ payload }, { call, put, select }) {
      const { richText } = payload;
      const { food, categoryId, avator, eatingSort, keyWordList, canEatingSource } = yield select(state => state.eating);
      const params = {
        title: food,
        categoryId: categoryId,
        img: avator,
        sort: eatingSort,
        keyWord: keyWordList.join('、'),
        pregnantStatus: canEatingSource.pregnantStatus,
        puerperaStatus: canEatingSource.puerperaStatus,
        sucklingStatus: canEatingSource.sucklingStatus,
        babyStatus: canEatingSource.babyStatus,
        text: richText
      }

      if (payload.id === 'new') {
        return yield call(api.saveEatingAddFetch, params);
      }else {
        params.id = payload.id;
        return yield call(api.saveEatingFetch, params);
      }
    },
    *getEatingInfo({ payload }, { call, put }) {
      const result = yield call(api.getEditInfo, { ...payload });
      const { code, data = {} } = result;
      const { title, categoryId, categoryName, img, keyWord, sort, pregnantStatus, puerperaStatus, sucklingStatus, babyStatus, url } = data;
      if (code === 0) {
        yield put({
          type: 'save',
          payload: {
            food: title,
            categoryId,
            categoryName,
            avator: img,
            eatingSort: sort,
            keyWordList: keyWord.split('、'),
            keyWord,
            canEatingSource: {
              pregnantStatus,
              puerperaStatus,
              sucklingStatus,
              babyStatus,
            },
            url
          }
        });
        return data;
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    clearAttributes(state) {
      return {
        ...state,
        food: '',
        categoryId: '',
        categoryName: '',
        avator: null,
        eatingSort: '',
        keyWordList: [],
        keyWord: '',
        canEatingSource: {
          pregnantStatus: undefined,
          puerperaStatus: undefined,
          sucklingStatus: undefined,
          babyStatus: undefined,
        },
        url: ''
      };
    }
  },
};
