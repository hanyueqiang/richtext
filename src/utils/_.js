
import moment from 'moment';

// get today time
export const getTimeDate = (fmt = "YYYY-MM-DD") => {
  return moment().format(fmt);
}

// time format
export const FormatDate = 'YYYY-MM-DD HH:mm';

// time format
export const getFormatDate = (val, fmt = FormatDate) => {
  if (!val) return;
  return moment(val).format(fmt);
}
// get moment
export const getMoment = (val) => {
  if (!val) return null;
  return moment(val);
}

export const getChineseWeek = () => {
  return "星期" + "日一二三四五六".charAt(new Date().getDay());
}

export const queryKeysByPath = (pathname, menusData) => {
  if (typeof (pathname) !== "string") {
    return '';
  }
  const reg = /(^\/*)|(\/*$)/g; // 匹配字符串首尾斜杠
  const path = pathname.replace(reg, '');
  const routes = path.split('/');
  return routes[1] || '';
};


export const getCanEating = (val) => {
  if (!val) return '-';
  switch (val) {
    case 1: return '能吃';
    case 2: return '慎吃';
    case 3: return '禁止';
    default: return '-';
  }
}



