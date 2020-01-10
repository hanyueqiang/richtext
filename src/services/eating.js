import { request } from '@utils';

export function getEatingList(payload) {
  return request('/restapi/v1/food_suitability/list', {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });
}
export function getCategoryList(payload) {
  return request('/restapi/v1/category/list', {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });
}
export function saveEatingFetch(payload) {
  return request('/restapi/v1/food_suitability/update', {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });
}
export function saveEatingAddFetch(payload) {
  return request('/restapi/v1/food_suitability/add', {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });
}
export function deleteEating(payload) {
  return request('/restapi/v1/food_suitability/delete', {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });
}

export function getEditInfo(payload) {
  return request('/restapi/v1/food_suitability/info', {
    method: 'POST',
    body: JSON.stringify({
      ...payload
    })
  });
}