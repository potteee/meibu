// function for dynamic sorting
const ObjectSort = (object, order='asc') => {
  var pairs = Object.entries(object);
  pairs.sort(function(p1, p2){
    var p1Key = p1[0], p2Key = p2[0];
    if(order == "asc"){
      if(p1Key < p2Key){ return -1; }
      if(p1Key > p2Key){ return 1; }
    } else if (order == "desc"){
      if(p1Key < p2Key){ return 1; }
      if(p1Key > p2Key){ return -1; }
    }
    return 0;
  })
  object = Object.fromEntries(pairs);
  console.log(object+"+object")
  return object 
}

export default ObjectSort
