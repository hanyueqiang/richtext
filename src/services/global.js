import { request } from '@utils';

export function logout() {
  return request('/logout', {
    method: 'GET',
  });
}
export function getSysInfo(payload) {
  return request('/getSysInfo', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
    }),
  });
}
export function getMessage(payload) {
  return request('/getMessage', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
    }),
  });
}
export function uploadFile(payload) {
  return request('/restapi/v1/file/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: JSON.stringify({
      ...payload,
    }),
  });
}