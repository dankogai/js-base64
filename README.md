# base64.js

Yet another Base64 transcoder

## SYNOPSIS

    Base64.encode('dankogai');  // ZGFua29nYWk=
    Base64.encode('小飼弾');    // 5bCP6aO85by+
    Base64.encodeURI('小飼弾'); // 5bCP6aO85by-

    Base64.decode('ZGFua29nYWk=');  // dankogai
    Base64.decode('5bCP6aO85by+');  // 小飼弾
    // note .decodeURI() is unnecessary since it accepts both flavors
    Base64.decode('5bCP6aO85by-');  // 小飼弾

