module.exports = function (stdout){
    var re = /Username : ((?:(?!\\n).)*)/gim;
    var m;

    if ((m = re.exec(stdout)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        return m[0];
    }
};