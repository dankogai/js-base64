/*
 * $Id: base64.js,v 0.1 2008/06/18 06:07:01 dankogai Exp dankogai $
 */

(function(){

var b64chars 
    = 'ABCDEFGHIJKLMNOPQRSTUVWZYZabcdefghijklmnopqrstuvwzyz0123456789+/';
var b64tab = function(bin){
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
    return t;
}(b64chars);

var toBase64 = function(bin){
    if (bin.match(/[^\x00-\xFF]/)) throw 'unsupported character found' ;
    var padlen = 0;
    while(bin.length % 3) {
        bin += '\0';
        padlen++;
    };
    var b64 = '';
    for (var i = 0, l = bin.length; i < l; i += 3){
        var n = (bin.charCodeAt(i)  << 16)
              | (bin.charCodeAt(i+1) << 8)
              | (bin.charCodeAt(i+2));
        b64 += b64chars.charAt( n >>> 18)
             + b64chars.charAt((n >>> 12) & 63)
             + b64chars.charAt((n >>>  6) & 63)
             + b64chars.charAt( n         & 63);
    }
    if (!padlen) return b64;
    b64 = b64.substr(0, b64.length - padlen);
    while(padlen--) b64 += '=';
    return b64;
};

var btoa = window.btoa || toBase64;

var fromBase64 = function(b64){
    b64 = b64.replace(/[^A-Za-z0-9\+\/]/g, '');
    var bin = '';
    var padlen = 0;
    while(b64.length % 4){
        b64 += 'A';
        padlen++;
    }
    for (var i = 0, l = b64.length; i < l; i += 4){
        var n = (b64tab[b64.charAt(i  )] << 18)
            |   (b64tab[b64.charAt(i+1)] << 12)
            |   (b64tab[b64.charAt(i+2)] <<  6)
            |   (b64tab[b64.charAt(i+3)]);
        bin += String.fromCharCode(  n >> 16 )
            +  String.fromCharCode( (n >>  8) & 0xff )
            +  String.fromCharCode(  n        & 0xff );
    }
    bin.length -= [0,0,2,1][padlen];
    return bin;
};

var atob = window.atob || fromBase64;

var utob = function(uni){
    var bin = '';
    for (var i = 0, l = uni.length; i < l; i++){
        var n = uni.charCodeAt(i);
        bin += n < 0x80  ? uni.charAt(i)
            :  n < 0x800 ? String.fromCharCode(0xc0 | (n >>>  6))
                         + String.fromCharCode(0x80 | (n & 0x3f))
            :              String.fromCharCode(0xe0 | ((n >>> 12) & 0x0f))
                         + String.fromCharCode(0x80 | ((n >>>  6) & 0x3f))
                         + String.fromCharCode(0x80 |  (n         & 0x3f))
            ;
    }
    return bin;
};

var btou = function(bin){
    var uni = '';
    for (var i = 0, l = bin.length; i < l; i++){
        var c0 = bin.charCodeAt(i);
        if    (c0 < 0x80){
            uni += bin.charAt(i)
        }else{
            var c1 = bin.charCodeAt(++i);
            if(c0 < 0xe0){
                uni += String.fromCharCode(((c0 & 0x1f) << 6) | (c1 & 0x3f));
            }else{
                var c2 = bin.charCodeAt(++i);
                uni += String.fromCharCode(
                       ((c0 & 0x0f) << 12) | ((c1 & 0x3f) <<  6) | (c2 & 0x3f)
                );
            }
        }
    }
    return uni;
}

try{
    eval('Base64')
}catch(e){
    Base64 = {
        fromBase64:fromBase64,
        toBase64:toBase64,
        atob:atob,
        btoa:btoa,
        utob:utob,
        btou:btou,
        encode:function(u){ return btoa(utob(u)) },
        encodeURI:function(u){
            return btoa(utob(u)).replace(/[+\/]/g, function(m0){
                return m0 == '+' ? '-' : '_';
            }).replace(/=+$/, '');
        },
        decode:function(a){ 
            return btou(atob(a.replace(/[-_]/g, function(m0){
                return m0 == '-' ? '+' : '/';
            })));
        }
    };
}

})();
