export function textToNumber(str) {

    //str　→ 現在の入力値（１文字以上）
    console.log(str+"+first str")

    //全角数字を半角数字に変換
    const shortNumberStr = str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    //半角数字以外を除去
    const numberRe = /[0-9]+/;

    const onlyNumberStr = numberRe.exec(shortNumberStr) ? Number(numberRe.exec(shortNumberStr)) : ""
    
    console.log(onlyNumberStr+"+onlyNumberStr")

    return onlyNumberStr;

}