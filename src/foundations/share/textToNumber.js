export function textToNumber(str) {

    //全角数字を半角数字に変換
    const shortNumberStr = str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    
    //半角数字以外を除去
    const numberRe = /[0-9]+/;
    
    const onlyNumberStr = numberRe.exec(shortNumberStr) ? Number(numberRe.exec(shortNumberStr)) : ""

    console.log(onlyNumberStr+"+first str")
    let onlyNumberStrFinal = onlyNumberStr
    
    if(onlyNumberStr > 100 && onlyNumberStr != 1000){
        onlyNumberStrFinal = onlyNumberStrFinal - (Math.floor(onlyNumberStr/100) * 100)
        if(onlyNumberStr == 10100){
            onlyNumberStrFinal = 100
        }
    } else if(onlyNumberStr == 1000){
        onlyNumberStrFinal = 100
    }

    console.log(onlyNumberStrFinal+"onlyNumberStrFinal")

    return onlyNumberStrFinal;

}