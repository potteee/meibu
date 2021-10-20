// function for dynamic sorting
const ObjectSort = (object, order='asc',number=0) => { 
  //number→ソートの基準となる要素を指定。デフォルトは一番左。

  var pairs = Object.entries(object);
  pairs.sort(function(p1, p2){
    var p1Key = p1[number], p2Key = p2[number];
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

//この関数でできること
// ObjectStort(test,"asc",1)

// test = {
//   aaa : 3,
//   bbb : 1,
//   ccc : 2,
// }

// -> 

// test = {
//   bbb : 1,
//   ccc : 2,
//   aaa : 3,
// }
