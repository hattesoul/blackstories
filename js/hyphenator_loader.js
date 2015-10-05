/*
 *  Hyphenator_Loader 5.0.0(devel) - client side hyphenation for webbrowsers
 *  Copyright (C) 2015  Mathias Nater, Zürich (mathiasnater at gmail dot com)
 *  https://github.com/mnater/Hyphenator
 * 
 *  Released under the MIT license
 *  http://mnater.github.io/Hyphenator/LICENSE.txt
 */

var Hyphenator_Loader=(function(window){'use strict';var languages,config,path,createElem=function(tagname){var r;if(window.document.createElementNS){r=window.document.createElementNS('http://www.w3.org/1999/xhtml',tagname);}else if(window.document.createElement){r=window.document.createElement(tagname);}return r;},checkLangSupport=function(){var shadowContainer,shadow,shadows=[],lang,i,r=true,bdy=window.document.getElementsByTagName('body')[0],fakeBdy=false;if(!bdy){fakeBdy=createElem('body');}shadowContainer=createElem('div');shadowContainer.style.MozHyphens='auto';shadowContainer.style['-webkit-hyphens']='auto';shadowContainer.style['-ms-hyphens']='auto';shadowContainer.style.hyphens='auto';shadowContainer.style.fontSize='12px';shadowContainer.style.lineHeight='12px';shadowContainer.style.wordWrap='normal';shadowContainer.style.visibility='hidden';for(lang in languages){if(languages.hasOwnProperty(lang)){shadow=createElem('div');shadow.style.width='5em';shadow.lang=lang;shadow.style['-webkit-locale']="'"+lang+"'";shadow.appendChild(window.document.createTextNode(languages[lang]));shadowContainer.appendChild(shadow);shadows.push(shadow);}}if(fakeBdy){fakeBdy.appendChild(shadowContainer);window.document.documentElement.appendChild(fakeBdy);}else{bdy.appendChild(shadowContainer);}for(i=0;i<shadows.length;i+=1){r=(shadows[i].offsetHeight>12)&&r;}if(fakeBdy){fakeBdy.parentNode.removeChild(fakeBdy);}else{bdy.removeChild(shadowContainer);}return r;},loadNrunHyphenator=function(config){var head,script,done=false;head=window.document.getElementsByTagName('head').item(0);script=createElem('script');script.src=path;script.type='text/javascript';script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){done=true;Hyphenator.config(config);Hyphenator.run();script.onload=script.onreadystatechange=null;if(head&&script.parentNode){head.removeChild(script);}}};head.appendChild(script);},runner=function(){var allLangsSupported=checkLangSupport();if(!allLangsSupported){loadNrunHyphenator(config);}};return{init:function(langs,p,configs){languages=langs;path=p;config=configs||{};runner();}};}(window));Hyphenator_Loader.init({"de":"nachmittags"},"./hyphenator.js",{useCSS3hyphenation:true});