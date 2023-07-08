
function hashData( data, algo ) {

    if (algo === 'MD5')  {
        return MD5(data) ;
    }

    if (algo === 'SHA1')  {
        return SHA1(data) ;
    }

    if (algo === 'SHA2')    {
        return SHA256(data) ;
    }
    return data ;
}

function hash(  login              ,
                password           ,
                algoSignature      ,
                loginSignature     ,
                passwordSignature  ,
                timeStampSignature ,
                timestamp          )                          {

    // var timestamp = ~~(+new Date() / 1000);
    var _login     = hashData(login, loginSignature)          ;
    
    if ( loginSignature != 'PLAIN' )       {
         _login  = _login.replace(/^0+/, '')                  ;
    }
    
    var _password  = hashData(password, passwordSignature)    ;
    
    if ( passwordSignature != 'PLAIN' )          {
         _password  = _password.replace(/^0+/, '')            ;
    }
        
    var _timestamp = hashData(timestamp, timeStampSignature)  ;
    
    var Plaintoken = _login.concat(_password, _timestamp )    ;

    var sign       = hashData(Plaintoken, algoSignature )     ;
    
    if ( algoSignature != 'PLAIN' )          {
         sign       = sign.replace(/^0+/, '' )                ;
    }

    return         login + " " +  _timestamp + " " + sign     ;
}

function SHA256(s) {

	var chrsz = 8;
	var hexcase = 0;

	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	function S(X, n) {
		return (X >>> n) | (X << (32 - n));
	}

	function R(X, n) {
		return (X >>> n);
	}

	function Ch(x, y, z) {
		return ((x & y) ^ ((~x) & z));
	}

	function Maj(x, y, z) {
		return ((x & y) ^ (x & z) ^ (y & z));
	}

	function Sigma0256(x) {
		return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	}

	function Sigma1256(x) {
		return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	}

	function Gamma0256(x) {
		return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	}

	function Gamma1256(x) {
		return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	}

	function core_sha256(m, l) {
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
		for (var i = 0; i < m.length; i += 16) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];

			for (var j = 0; j < 64; j++) {

				if (j < 16) W[j] = m[j + i];

				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);

				T2 = safe_add(Sigma0256(a), Maj(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
	function str2binb(str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for (var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
		}
		return bin;
	}

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}

	function binb2hex(binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for (var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
				hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
		}
		return str;
	}
	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

function SHA1(str) {

    function hex(value) {
        var s = (value >>> 0).toString(16)
        while (s.length < 8)
            s = '0' + s
        return s
    }

    function limit(n) {
        return n & 0xffffffff
    }

    function rotateLeft(n, s) {
        return (n << s) | (n >>> (32 - s))
    }

    var H0 = 0x67452301
    var H1 = 0xefcdab89
    var H2 = 0x98badcfe
    var H3 = 0x10325476
    var H4 = 0xc3d2e1f0

    var i, j
    var blockstart
    var W = new Array(80)
    var A, B, C, D, E
    var temp

    str = unescape(encodeURIComponent(str))
    str = str.split(/.*?/).map(function (s) {
        return s.charCodeAt(0)
    })

    var length = str.length

    var words = []
    for (i = 0; i < length - 3; i += 4) {
        j = str[i] << 24 | str[i + 1] << 16 | str[i + 2] << 8 | str[i + 3]
        words.push(j)
    }

    switch (length % 4) {
        case 0:
            i = 0x80000000
            break
        case 1:
            i = str[length - 1] << 24 | 0x800000
            break
        case 2:
            i = str[length - 2] << 24 | str[length - 1] << 16 | 0x8000
            break
        case 3:
            i = str[length - 3] << 24 | str[length - 2] << 16 | str[length - 1] << 8 | 0x80
            break
    }

    words.push(i)

    while ((words.length % 16) != 14) {
        words.push(0)
    }

    words.push(length >>> 29)
    words.push(limit(length << 3))

    for (blockstart = 0; blockstart < words.length; blockstart += 16) {

        for (i = 0; i < 16; i++) {
            W[i] = words[blockstart + i]
        }
        for (i = 16; i < 80; i++) {
            W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
        }

        A = H0
        B = H1
        C = H2
        D = H3
        E = H4

        for (i = 0; i <= 19; i++) {
            temp = limit(rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999)
            E = D
            D = C
            C = rotateLeft(B, 30)
            B = A
            A = temp
        }

        for (i = 20; i <= 39; i++) {
            temp = limit(rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1)
            E = D
            D = C
            C = rotateLeft(B, 30)
            B = A
            A = temp
        }

        for (i = 40; i <= 59; i++) {
            temp = limit(rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc)
            E = D
            D = C
            C = rotateLeft(B, 30)
            B = A
            A = temp
        }

        for (i = 60; i <= 79; i++) {
            temp = limit(rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6)
            E = D
            D = C
            C = rotateLeft(B, 30)
            B = A
            A = temp
        }

        H0 = limit(H0 + A)
        H1 = limit(H1 + B)
        H2 = limit(H2 + C)
        H3 = limit(H3 + D)
        H4 = limit(H4 + E)

    }

    return hex(H0) + hex(H1) + hex(H2) + hex(H3) + hex(H4)

}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

function MD5(str) {
  function rotateLeft(value, shift) {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >>> 16) + (y >>> 16) + (lsw >>> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function md5HexDigest(input) {
    const hexChars = '0123456789abcdef';

    let str = '';
    for (let i = 0; i < input.length * 4; i++) {
      str +=
        hexChars.charAt((input[i >>> 2] >>> ((i % 4) * 8 + 4)) & 0x0F) +
        hexChars.charAt((input[i >>> 2] >>> ((i % 4) * 8)) & 0x0F);
    }

    return str;
  }

  const utf8Encode = function (input) {
    input = input.replace(/\r\n/g, '\n');
    let utfText = '';
    for (let n = 0; n < input.length; n++) {
      const c = input.charCodeAt(n);
      if (c < 128) {
        utfText += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utfText += String.fromCharCode((c >>> 6) | 192);
        utfText += String.fromCharCode((c & 63) | 128);
      } else {
        utfText += String.fromCharCode((c >>> 12) | 224);
        utfText += String.fromCharCode(((c >>> 6) & 63) | 128);
        utfText += String.fromCharCode((c & 63) | 128);
      }
    }
    return utfText;
  };

  const input = utf8Encode(str);
  const blockCount = Math.ceil((input.length + 9) / 64);
  const blocks = new Array(blockCount * 16);

  for (let i = 0; i < blockCount * 16; i++) {
    blocks[i] = 0;
  }

  for (let i = 0; i < input.length; i++) {
    blocks[i >>> 2] |= input.charCodeAt(i) << ((i % 4) * 8);
  }

  blocks[input.length >>> 2] |= 0x80 << ((input.length % 4) * 8);
  blocks[blockCount * 16 - 2] = input.length * 8;

  const state = [1732584193, -271733879, -1732584194, 271733878];

  const md5S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const md5T = new Array(64);
  for (let i = 0; i < 64; i++) {
    md5T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  for (let i = 0; i < blocks.length; i += 16) {
    let a = state[0];
    let b = state[1];
    let c = state[2];
    let d = state[3];

    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      b = addUnsigned(b, rotateLeft(addUnsigned(a, addUnsigned(f, addUnsigned(blocks[i + g], md5T[j]))), md5S[j]));
      a = temp;
    }

    state[0] = addUnsigned(state[0], a);
    state[1] = addUnsigned(state[1], b);
    state[2] = addUnsigned(state[2], c);
    state[3] = addUnsigned(state[3], d);
  }

  const result = md5HexDigest(state);

  return result;
}

function copyText(id) {
   try {
         copyStringToClipboard (document.getElementById(id).value) ;
       } catch (err) {
          console.log('Oops, unable to copy') ;
       }
}

function copy(_id_1, _id_2, _id_3 ) {

    processTab( _id_1 ) ;
    processTab( _id_2 ) ;
    processTab( _id_3 ) ;
    
}

function processTab( idTab ) {
    
    if( document.getElementById(idTab) === null ) return        ;
    id = idTab.split(':')[0].replace("input_", "") + "_pane"    ;
    var ElementCssClass = document.getElementById(id).className ;
    
    if ( ElementCssClass.indexOf("tab-pane") !== -1 && 
         ElementCssClass.indexOf("active") !== -1)   {
         copyText( idTab ) ;
    }
}


function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea') ;
   // Set value (string to be copied)
   el.value = str ;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '') ;
   el.style = {position: 'absolute', left: '-9999px'} ;
   document.body.appendChild(el) ;
   // Select text inside element
   el.select() ;
   // Copy text to clipboard
   document.execCommand('copy') ;
   // Remove temporary element
   document.body.removeChild(el);
}


function timeOut (id) {
    setTimeout(function() { $('#'+id).delay(200)
                                     .fadeOut( 2500 , 
                                        function() { $(this).html(''); } 
                                     ) ;
                          }, 900) ;
}
    
function sso( login     ,
              password  ,
              clientId  ,
              secretId  ) {

    checkAuth ( login, password, clientId, secretId ) ;
}


function login( login , password  ) {

    var timestamp  = Math.round(+new Date() / 1000)                                    ;
    var hashedLoginPassword    = hashData( login.concat(password, timestamp) , 'SHA2') ;
    
    loginChecker ( hashedLoginPassword , timestamp  )                                  ;
    
}

function openPage(link)                   {
   var win = window.open(link, '_blank')  ;
   win.focus()                            ;
} 

function openOnSamePage( idTab, fileName )  {
  
    if( document.getElementById(idTab) === null ) return        ;
    id = idTab.split(':')[0].replace("input_", "") + "_pane"    ;
    var ElementCssClass = document.getElementById(id).className ;
    
    if ( ElementCssClass.indexOf("tab-pane") !== -1 && 
         ElementCssClass.indexOf("active") !== -1)   {
     
         download( document.getElementById( idTab).value ,
                                            fileName     , 
                                            "text/plain" ) ;
    }
} 

//download.js v3.0, by dandavis; 2008-2014. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support

// data can be a string, Blob, File, or dataURL

						 
function download(data, strFileName, strMimeType) {
	
	var self = window, // this script is only for browsers anyway...
		u = "application/octet-stream", // this default mime also triggers iframe downloads
		m = strMimeType || u, 
		x = data,
		D = document,
		a = D.createElement("a"),
		z = function(a){return String(a);},
		
		
		B = self.Blob || self.MozBlob || self.WebKitBlob || z,
		BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
		fn = strFileName || "download",
		blob, 
		b,
		ua,
		fr;

	if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
		x=[x, m] ;
		m=x[0]   ;
		x=x[1]   ; 
	}
	
	//go ahead and download dataURLs right away
	if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
			navigator.msSaveBlob(d2b(x), fn) : 
			saver(x) ; // everyone else can save dataURLs un-processed
	}//end if dataURL passed?
	
	try{
	
		blob = x instanceof B ? 
			x : 
			new B([x], {type: m}) ;
	}catch(y){
		if(BB){
			b = new BB();
			b.append([x]);
			blob = b.getBlob(m); // the blob
		}
		
	}
	
	function d2b(u) {
		var p= u.split(/[:;,]/),
		t= p[1],
		dec= p[2] == "base64" ? atob : decodeURIComponent,
		bin= dec(p.pop()),
		mx= bin.length,
		i= 0,
		uia= new Uint8Array(mx);

		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

		return new B([uia], {type: t});
	 }
	  
	function saver(url, winMode) {
		
		if ('download' in a) { //html5 A[download] 			
			a.href = url;
			a.setAttribute("download", fn) ;
			a.innerHTML = "downloading..." ;
			D.body.appendChild(a) ;
			setTimeout(function() {
				a.click() ;
				D.body.removeChild(a) ;
				if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 ) ; }
			}, 66);
			return true;
		}
		
		//do iframe dataURL download (old ch+FF):
		var f = D.createElement("iframe") ;
		D.body.appendChild(f) ;
		if(!winMode){ // force a mime that will download:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u) ;
		}
		 
	
		f.src = url;
		setTimeout(function(){ D.body.removeChild(f); }, 333);
		
	}//end saver 
		
	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		return navigator.msSaveBlob(blob, fn);
	} 	
	
	if(self.URL) { // simple fast and modern way using Blob and URL:
		saver(self.URL.createObjectURL(blob), true) ;
	}else {
		// handle non-Blob()+non-URL browsers:
		if(typeof blob === "string" || blob.constructor===z ) {
			try {
			      return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob) ) ; 
			}catch(y){
			      return saver( "data:" +  m   + "," + encodeURIComponent(blob) ) ; 
			}
		}
		
		// Blob but not URL:
		fr=new FileReader()    ;
                
		fr.onload=function(e)  {
		    saver(this.result) ; 
		} ;
		
                fr.readAsDataURL(blob) ;
	}	
	return true;
} /* end download() */


