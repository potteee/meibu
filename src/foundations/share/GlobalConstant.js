// function define(name, value){
//   Object.defineProperty(window, name, { 
//    get: function(){return value;},
//    set: function(){throw(name+' is already defined !!');},
//   });
// }

// define('SSG_WAIT_SEC',90)

export const SSG_WAIT_SEC = 86400;
export const ONE_CLICK_APPEARANCE_IN_POSTING = 54;

export const FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED = 0;
export const FIRST_POSTED_FLAG_NOT_POSTED = 1;
export const FIRST_POSTED_FLAG_I_POSTED = 2;