function md5(str) {
  // Minimal MD5 implementation
  function rotateLeft(x, n) { return (x << n) | (x >>> (32 - n)) }
  function addUnsigned(x, y) { const x4 = (x & 0x40000000), y4 = (y & 0x40000000); const x8 = (x & 0x80000000), y8 = (y & 0x80000000); const r = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF); if (x4 & y4) return r ^ 0x80000000 ^ x8 ^ y8; if (x4 | y4) { if (r & 0x40000000) return r ^ 0xC0000000 ^ x8 ^ y8; return r ^ 0x40000000 ^ x8 ^ y8 } return r ^ x8 ^ y8 }
  function f(x,y,z){return (x&y)|(~x&z)}
  function g(x,y,z){return (x&z)|(y&~z)}
  function h(x,y,z){return x^y^z}
  function i(x,y,z){return y^(x|~z)}
  function ff(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(f(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function gg(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(g(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function hh(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(h(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function ii(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(i(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  const utf8 = unescape(encodeURIComponent(str))
  const msg = new Array(Math.ceil((utf8.length+9)/64)*16).fill(0)
  for (let k=0;k<utf8.length;k++) msg[k>>2] |= utf8.charCodeAt(k) << ((k%4)*8)
  msg[utf8.length>>2] |= 0x80 << ((utf8.length%4)*8)
  msg[msg.length-2] = (utf8.length*8) & 0xFFFFFFFF
  msg[msg.length-1] = Math.floor((utf8.length*8)/0x100000000)
  let a=0x67452301,b=0xEFCDAB89,c=0x98BADCFE,d=0x10325476
  for (let k=0;k<msg.length;k+=16){
    let A=a,B=b,C=c,D=d
    // round 1
    A=ff(A,B,C,D,msg[k+0],7,0xD76AA478);D=ff(D,A,B,C,msg[k+1],12,0xE8C7B756);C=ff(C,D,A,B,msg[k+2],17,0x242070DB);B=ff(B,C,D,A,msg[k+3],22,0xC1BDCEEE)
    A=ff(A,B,C,D,msg[k+4],7,0xF57C0FAF);D=ff(D,A,B,C,msg[k+5],12,0x4787C62A);C=ff(C,D,A,B,msg[k+6],17,0xA8304613);B=ff(B,C,D,A,msg[k+7],22,0xFD469501)
    A=ff(A,B,C,D,msg[k+8],7,0x698098D8);D=ff(D,A,B,C,msg[k+9],12,0x8B44F7AF);C=ff(C,D,A,B,msg[k+10],17,0xFFFF5BB1);B=ff(B,C,D,A,msg[k+11],22,0x895CD7BE)
    A=ff(A,B,C,D,msg[k+12],7,0x6B901122);D=ff(D,A,B,C,msg[k+13],12,0xFD987193);C=ff(C,D,A,B,msg[k+14],17,0xA679438E);B=ff(B,C,D,A,msg[k+15],22,0x49B40821)
    // round 2
    A=gg(A,B,C,D,msg[k+1],5,0xF61E2562);D=gg(D,A,B,C,msg[k+6],9,0xC040B340);C=gg(C,D,A,B,msg[k+11],14,0x265E5A51);B=gg(B,C,D,A,msg[k+0],20,0xE9B6C7AA)
    A=gg(A,B,C,D,msg[k+5],5,0xD62F105D);D=gg(D,A,B,C,msg[k+10],9,0x02441453);C=gg(C,D,A,B,msg[k+15],14,0xD8A1E681);B=gg(B,C,D,A,msg[k+4],20,0xE7D3FBC8)
    A=gg(A,B,C,D,msg[k+9],5,0x21E1CDE6);D=gg(D,A,B,C,msg[k+14],9,0xC33707D6);C=gg(C,D,A,B,msg[k+3],14,0xF4D50D87);B=gg(B,C,D,A,msg[k+8],20,0x455A14ED)
    A=gg(A,B,C,D,msg[k+13],5,0xA9E3E905);D=gg(D,A,B,C,msg[k+2],9,0xFCEFA3F8);C=gg(C,D,A,B,msg[k+7],14,0x676F02D9);B=gg(B,C,D,A,msg[k+12],20,0x8D2A4C8A)
    // round 3
    A=hh(A,B,C,D,msg[k+5],4,0xFFFA3942);D=hh(D,A,B,C,msg[k+8],11,0x8771F681);C=hh(C,D,A,B,msg[k+11],16,0x6D9D6122);B=hh(B,C,D,A,msg[k+14],23,0xFDE5380C)
    A=hh(A,B,C,D,msg[k+1],4,0xA4BEEA44);D=hh(D,A,B,C,msg[k+4],11,0x4BDECFA9);C=hh(C,D,A,B,msg[k+7],16,0xF6BB4B60);B=hh(B,C,D,A,msg[k+10],23,0xBEBFBC70)
    A=hh(A,B,C,D,msg[k+13],4,0x289B7EC6);D=hh(D,A,B,C,msg[k+0],11,0xEAA127FA);C=hh(C,D,A,B,msg[k+3],16,0xD4EF3085);B=hh(B,C,D,A,msg[k+6],23,0x04881D05)
    A=hh(A,B,C,D,msg[k+9],4,0xD9D4D039);D=hh(D,A,B,C,msg[k+12],11,0xE6DB99E5);C=hh(C,D,A,B,msg[k+15],16,0x1FA27CF8);B=hh(B,C,D,A,msg[k+2],23,0xC4AC5665)
    // round 4
    A=ii(A,B,C,D,msg[k+0],6,0xF4292244);D=ii(D,A,B,C,msg[k+7],10,0x432AFF97);C=ii(C,D,A,B,msg[k+14],15,0xAB9423A7);B=ii(B,C,D,A,msg[k+5],21,0xFC93A039)
    A=ii(A,B,C,D,msg[k+12],6,0x655B59C3);D=ii(D,A,B,C,msg[k+3],10,0x8F0CCC92);C=ii(C,D,A,B,msg[k+10],15,0xFFEFF47D);B=ii(B,C,D,A,msg[k+1],21,0x85845DD1)
    A=ii(A,B,C,D,msg[k+8],6,0x6FA87E4F);D=ii(D,A,B,C,msg[k+15],10,0xFE2CE6E0);C=ii(C,D,A,B,msg[k+6],15,0xA3014314);B=ii(B,C,D,A,msg[k+13],21,0x4E0811A1)
    A=ii(A,B,C,D,msg[k+4],6,0xF7537E82);D=ii(D,A,B,C,msg[k+11],10,0xBD3AF235);C=ii(C,D,A,B,msg[k+2],15,0x2AD7D2BB);B=ii(B,C,D,A,msg[k+9],21,0xEB86D391)
    a=addUnsigned(a,A);b=addUnsigned(b,B);c=addUnsigned(c,C);d=addUnsigned(d,D)
  }
  const toHex = (n) => {
    let s=''
    for (let k=0;k<4;k++) s += ('0'+((n>>>(k*8))&0xFF).toString(16)).slice(-2)
    return s
  }
  return toHex(a)+toHex(b)+toHex(c)+toHex(d)
}

export function gravatarUrl(email) {
  const hash = md5((email||'').trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=80`
}
