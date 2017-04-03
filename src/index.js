/**
 * Created by xiaogang on 2017/3/30.
 */
"use strict";
import PersonalSwipe from './swipe';

const install = function (Vue) {
  Vue.directive('PersonalSwipe', PersonalSwipe);
};
//直接引用时
if (window.Vue) {
  window.PersonalSwipe = PersonalSwipe;
  Vue.use(install); // eslint-disable-line
}
//使用npm安装时
PersonalSwipe.install = install;
export default PersonalSwipe;

// import PersonalSwipe from 'modulePath/swipe/index';
// Vue.use(PersonalSwipe);
