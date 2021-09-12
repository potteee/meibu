// Date(時間)形式を文字列に変換

const DateToString = (date,type=1) => {
  let format_str = "";
  const year_str = date.getFullYear();
  //月だけ+1すること
  const month_str = 1 + date.getMonth();
  const day_str = date.getDate();
  const hour_str = date.getHours();
  const minute_str = date.getMinutes();
  const second_str = date.getSeconds();
  
  if(type == 0){
    format_str = 'YYYY-MM-DD hh:mm:ss';
  }else if(type == 1){
    format_str = 'YYYYMMDDhhmmss';
  }else{
    format_str = 'YYYYMMDDhhmmss';
  }

  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);
  format_str = format_str.replace(/hh/g, hour_str);
  format_str = format_str.replace(/mm/g, minute_str);
  format_str = format_str.replace(/ss/g, second_str);
  
  return format_str;
};

export default DateToString