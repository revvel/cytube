/*
 * open chatmodus wanneer de url eindigt met '?'
*/
if (location.href.match(/\?/) && !$('body').hasClass('chatOnly')){ //voorkomt uitvoeren na reloggen op telefoon

  $('#userlist').css('width', '50px')
  $('#chatheader').remove();
  $(`<style type='text/css'> 
    img.channel-emote{ max-width: 50px !important; max-height: 50px !important;} 
    body{ font-size:11px !important;}  
    .timestamp{ font-size:8px !important;} 
    #userlist{ font-size:8px !important;} 
    .username:after{ font-size: 0px !important;} 
    .username{ font-size: 10px !important;} 
    .username::before{ content:none !important;} 
  </style>`).appendTo("head");

	//login/loguit knop
	let knop = $('<button>').addClass('btn btn-sm btn-default').css({'float':'right'})
	//geef knop text, functie en neem login/loguit form mee naar #chatwrap
	$('#logoutform').length === 0 ?
		$('#chatwrap').append(knop.text('echte login').click(function(){
			$('#loginform').css('display') == 'none' ?
				$('#loginform').css({'display':'block','bottom':this.offsetHeight+'px'}) :
				$('#loginform').css({'display':'none'})
		})).append($('#loginform').detach().css({'display':'none','position':'absolute','right':'0','z-index':'9','background-color':'black'}))
	:
		$('#chatwrap').append(knop.text('loguit').click(function(){
			$('#logoutform').submit();
		})).append($('#logoutform').detach().css({'display':'none'}))
	;
	//alle knoppen mogen ook mee
	$('#chatwrap').append($('#leftcontrols').detach().css({'display':'inline-block','padding':'0'}))
	//nieuwe knop voor poll div
	let polknop = $('<button>').text('poll').addClass('btn btn-sm btn-default').css(
		{'display':($("#pollwrap .active").length === 0 ? 'none' : 'inline-block')}
	).click(function(){
		$('#pollwrap').css('display') == 'none' ?
			$('#pollwrap').css({'display':'block','bottom':this.offsetHeight+'px'}) :
			$('#pollwrap').css({'display':'none'});
	}).append($('#pollwrap').detach().css({'display':'none','position':'absolute','right':'0','z-index':'9'})).appendTo($('#leftcontrols'))
	//callback listeners voor poll
	socket.on('newPoll',function(){polknop.css({'display':'inline-block'})}.bind(polknop))
	socket.on('closePoll',function(){polknop.css({'display':'none'})}.bind(polknop))
	//ik wil ook wel zien welke video speelt
	$('#chatwrap').prepend($("#currenttitle").detach().css({'display':'block','font-size':'100%','margin-left':'0'}))
	socket.on('changeMedia',(function(e){
		let timeout;
		return function(e){
			$("#currenttitle").text("maakt nu lawaai: " + e.title)
			clearTimeout(timeout)
			timeout = setTimeout(function(){
				$("#currenttitle").text("lekker stil hier")
			},e.seconds * 1000)
		}
	})())
	//kom maar op met je chatmodus
	chatOnly()
	//schuif es op anders past 't nie
	$(window).resize(function(){
		$('#userlist').height($('#messagebuffer').height(
			$("body").outerHeight() - 87
		).height()
	)}).resize() //nu meteen ajb
	//verander text
	$('.input-group-addon').text('gast lmke login')
	$('#emotelistbtn').text('kikkers')
}

/*
 * test - toon in titelbalk wie jouw naam noemde
 * overschrijft pingMessage, enige toevoeging is var username
*/

function pingMessage(e) {
    var username = $("#messagebuffer>div:last-child")[0].className.substr(9).split(' ')[0];
    FOCUSED || (!TITLE_BLINK && ("always" === USEROPTS.blink_title || "onlyping" === USEROPTS.blink_title && e) && (TITLE_BLINK = setInterval(function() {
        "*Chat*" == document.title ? document.title = username : document.title = "*Chat*"
    }, 1e3)),
    ("always" === USEROPTS.boop || "onlyping" === USEROPTS.boop && e) && CHATSOUND.play())
}
/*
 * geef ook jij's op alternatieve vormen van je eigen naam

(function(){
	let jijRegex
	switch (CLIENT.name){
		case "Bourg":
			jijRegex = /bo(e|u)r(\W|$)/i; break
		case "staneke":
			jijRegex = /stan(n(i|k)e)?(\W|$)/i; break
		case "RodeVans":
			jijRegex = /jelmer|ro(de|oie)/i; break
		case "Beir":
			jijRegex = /(\W|^)beer(tje)?(\W|$)/i; break
		case "Freems":
			jijRegex = /friem(el|s)/i; break
		case "EenVerdrinkendeLeeuw":
			jijRegex = /(leeuw|lion)(\W|$)/i; break
		case "lievejongen":
			jijRegex = /(lieve|jongen|dor(i|u)s)(\W|$)/i; break
		case "sinterklaas":
			jijRegex = /sint/i; break
		case "Berteke":
			jijRegex = /bert(\W|$)/i; break
		case "Rova":
			jijRegex = /vos(\W|$)/i; break
		case "Friet":
			jijRegex = /fliet(\W|$)/i; break
		case "PeterPost":
			jijRegex = /peter(\W|$)/i; break
		case "klepelknul":
			jijRegex = /klepel/i; break
		case "voormaligGha":
			jijRegex = /Gha(\W|$)/i; break
		case "Yankee":
			jijRegex = /yank/i; break
		case "chillburg":
			jijRegex = /chill(\W|$)/i; break
		case "Nedergoeroe":
			jijRegex = /(neder|goeroe)(\W|$)/i; break
		case "Ceasium":
			jijRegex = /(\W|^)kaas(\W|$)/i; break
	}
	// doe niks als er geen alternatieve naam voor jou is
	jijRegex === undefined ||
	// indien er wel 1 is, zet deze listener:
	socket.on('chatMsg', function(e){
		e.msg.match(jijRegex) && (pingMessage(1), $("#messagebuffer>div:last-child").addClass('nick-highlight'))
	})
})()
*/

/*
 * open chatmodus wanneer de url eindigt met '#'
*/

location.href.charAt(location.href.length - 1) === '#' && chatOnly();

/*
 * leuke knop om een worp te doen tussen 00 en 99
*/
 
var vorigetijd = 0;
 
$('button:contains("Roll")').remove();
$('<button/>').addClass('btn btn-sm btn-default').text('Roll').click(function(e){
 
  var nieuwetijd = Math.floor( new Date().getTime() /1000);
  var delay = 10;
 
  // als het 30 sec geleden is
  if(vorigetijd <= nieuwetijd - delay) {
   vorigetijd = nieuwetijd;
  } else {
    addChatMessage({
        username : '',
    msg : 'Gij hebt al genoeg geworpen, wacht ' + (delay + (vorigetijd - nieuwetijd)) + ' seconden',
    meta : {addClass : 'server-whisper'},
    time : new Date().getTime()
   })
   return;
  }
 

  var nummertje = Math.floor(Math.random() * 9999);
	
  if(nummertje < 10) {
    nummertje = "0" + nummertje;
  }
 
  /* ik heb hier Chineze tekens gebruikt zodat mensen het niet makkelijk kunnen na-apen */
 
  if((nummertje%100) % 11 === 0) {
	socket.emit("chatMsg", {msg: '/me [运气]wierp een ' + nummertje + '[/运气]',meta: {}});
   
  } else {
    socket.emit("chatMsg", {msg: '/me [骰子]wierp een ' + nummertje + '[/骰子]',meta: {}});
  }
 
}).appendTo($('#leftcontrols'))
 
 
/*
 * melding wanneer iemand joined ook voor niet-mods
*/
 
var addUser_ori;
setTimeout(function(){ // timeout, anders doet ie het voor alle aanwezige mensen wanneer je inlogt
    addUser_ori = addUser_ori || Callbacks.addUser;
    Callbacks.addUser = function(e){
        if (CLIENT.rank < 3 && e.name.toLowerCase().indexOf('bert') == -1 && e.name.toLowerCase().indexOf('dievenjongen') == -1)
            addChatMessage({
                username : '',
                msg : e.name + ' kwam erbij',
                meta : {addClass : 'server-whisper'},
                time : new Date().getTime()
            })
        return addUser_ori.call(this,e)
    }
}, 10000)
 
/*
 * tabcompletion, emotes and usernames
 * also overwrite native tabcompletion
*/
 
$('#chatline').unbind('keydown',tabSuggestions || function(){});
var tabSuggestions = (function(){
 
    var chatline = document.getElementById('chatline'),
        suggestionsDiv = document.getElementById('suggestionsDiv') || document.createElement('div'),
        lastMatchNum = 0,
        lastMatch;
    suggestionsDiv.id = 'suggestionsDiv',
    suggestionsDiv.style.position = 'absolute',
    suggestionsDiv.style.zIndex = '999',
    suggestionsDiv.style.backgroundColor = '#161a20',
    chatline.parentNode.appendChild(suggestionsDiv)
   
    function emoteImg(emote){
        var i = document.createElement('img')
        i.className = 'channel-emote',
        i.src = emote.image,
        i.title = emote.name,
        i.onclick = function(e){
            clearBorders();
            chatline.value = chatline.value.replace(/\/[a-z0-9?!&]*$/i, emote.name),
            this.style.border = '2px solid white',
            chatline.focus();
            var i = 0, a = this;
            while (a = a.previousSibling) i++;
            lastMatchNum = i
        }
        return i
    }
   
    function clearBorders(){
        for (var i = 0; i < suggestionsDiv.children.length; i++)
            suggestionsDiv.children[i].style.border = 'none'
    }
   
    function levenshtein(a, b) {
      if (a.length === 0) return b.length
      if (b.length === 0) return a.length
      let tmp, i, j, prev, val, row
      // swap to save some memory O(min(a,b)) instead of O(a)
      if (a.length > b.length) {
        tmp = a
        a = b
        b = tmp
      }
 
      row = Array(a.length + 1)
      // init the row
      for (i = 0; i <= a.length; i++) {
        row[i] = i
      }
 
      // fill in the rest
      for (i = 1; i <= b.length; i++) {
        prev = i
        for (j = 1; j <= a.length; j++) {
          if (b[i - 1] === a[j - 1]) {
            val = row[j - 1] // match
          } else {
            val = Math.min(row[j - 1] + 1, // substitution
                  Math.min(prev + 1,     // insertion
                           row[j] + 1))  // deletion
          }
          row[j - 1] = prev
          prev = val
        }
        row[a.length] = prev
      }
      return row[a.length]
    }
   
    return function(e){
        if (e.keyCode != 9 && !e.shiftKey)
            suggestionsDiv.innerHTML = '',
            lastMatch = null
        else if (e.keyCode == 9){
            //emotes
            if (lastMatch) {
                //toggle matches
                if (Object.prototype.toString.call(lastMatch) === '[object Array]')
                    //usernames
                    chatline.value = chatline.value.replace(/[a-z0-9-]+$/i, lastMatch[++lastMatchNum % lastMatch.length])
                else
                    //emotes
                    e.shiftKey ? lastMatchNum = (--lastMatchNum + suggestionsDiv.children.length) % suggestionsDiv.children.length :
                    lastMatchNum = ++lastMatchNum % suggestionsDiv.children.length,
                    clearBorders(),suggestionsDiv.children[lastMatchNum] && suggestionsDiv.children[lastMatchNum].onclick()
            } else {
           
                var emoteStr = chatline.value.match(/\/[a-z0-9?!&]*$/i)
                if (emoteStr){
                    //show emotesuggestions
                    var emoteList = CHANNEL.emotes.slice(),
                        suggestions = []
                    //find matches based on levenshtein distance
                    emoteStr = emoteStr[0].replace(/\?/g,'\\?')
                    for (var i = 0, emoteStr_withoutslash = emoteStr.replace('/',''); i < emoteList.length; i++)
                        if (emoteList[i].name.match(emoteStr_withoutslash) || levenshtein(emoteStr, emoteList[i].name) < 3)
                            suggestions.push(new emoteImg(emoteList[i]))
                    //sort suggestions
                    suggestions.sort(function(a, b){
                        var indexofa = a.title.indexOf(emoteStr),
                            indexofb = b.title.indexOf(emoteStr)
                       
                        if (indexofa === 0 && indexofb !== 0)
                            return -1
                        else if (indexofb === 0 && indexofa !== 0)
                            return 1
                        else {
                            //sort aphabetically with respect for numbers at the end
                            var i = 0;
                            while (a.title.charAt(i) === b.title.charAt(i) && i < a.title.length && i < b.title.length)
                                i++;
                            if (a.title.length !== b.title.length &&
                               (i == a.title.length - 1 || i == b.title.length - 1) &&
                               !isNaN(parseInt(a.title.charAt(i))) && !isNaN(parseInt(b.title.charAt(i))))
                                return a.title.charAt(i) < b.title.charAt(i) ? 1 : -1
                            return a.title.charAt(i) < b.title.charAt(i) ? -1 : 1
                        }
                    })
                    //populate suggestionsDiv
                    suggestionsDiv.innerHTML = ''
                    for (var i=0; i<suggestions.length; i++)
                        suggestionsDiv.appendChild(suggestions[i])
                    lastMatchNum = 0,
                    lastMatch = emoteStr,
                    suggestionsDiv.children[0] && (suggestionsDiv.children[0].style.border = '2px solid white') && suggestionsDiv.children[lastMatchNum].onclick()
                   
                } else {
                    //usernames
                    var userStr = chatline.value.match(/[a-z0-9-]+$/i),
                        userlistElems = $('#userlist .userlist_item');//document.getElementById("userlist").children
                    lastMatch = [],
                    lastMatchNum = 0
                    for (var i = 0; i < userlistElems.length; i++)
                        if (userlistElems[i].children[1].textContent != CLIENT.name &&
                            userlistElems[i].children[1].textContent.match(new RegExp('^' + userStr, 'i')))
                            lastMatch.push(userlistElems[i].children[1].textContent);
                    if (lastMatch.length != 0)
                        chatline.value = chatline.value.replace(/[a-z0-9-]+$/i, lastMatch[0])
                    else
                        lastMatch = null
                }
            }
        }
    }
})()
 
chatTabComplete = function(){return false},
$("#chatline").keydown(tabSuggestions)
 
/*
 * show number of chatlines in title when tab has no focus
*/
 
var addChatMessage_ori = addChatMessage_ori || addChatMessage;
var addChatMessage = (function(e){
    var hasfocus = 1,
        missedchats = 0,
        cytuicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAABHNCSVQICAgIfAhkiAAAAR1JREFUKJGlkr1KxE\
			AUhU9CClvb4CtMpxBSpkmTwsJGIWAZsNFCUuYJJJA2VilGyQuk2cY/LAUDohAEQbSwEIJLCrMcC7NLNmyCu164xZw59+POYUASJE+EEB8Aatd\
			1n0g6jQ4p5UjTtErTtEpKOZrq0wbJCAC7TXLDsqzXrm6a5tscQNf1z0UAwzAeF+kNfHcGAPDdY/waABzNAGEYXveYjgcAcxnAtu2XtiHP8/PG\
			sANg0rqbkNxrA1QA277vPwgh3gHUnufdl2W5nqbpVZZlB0mSXAIYAxjHcXwDYBOdqvpWHXjCfrOBoQJY6xL/UFtRFF0oinKrNNSVS/3P8MqAI\
			Aju2uelAsRviIckURTFGeq6Pl1m2HGc5/Y/+AHWdA+ZKGYKWwAAAABJRU5ErkJggg==",
        cytuicon2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAkFBMVEVHcEz///////////////8EBAT+/v4AAAD///////+QkJD///////+np6dEREQ6Ojr///////////////////////////+bm5t/f38AAABMTEzc3Ny+vr4BAQH///9dXV21tbU0NDQAAACxsbH///84ODh9fX3////U1NTQ0NDAwMAtLS3///8bGxsAAAAzzP/2yaEVAAAALnRSTlMAIHEJBPid/QEFw1SSvePmFAc6WoZZE8LO996nuPVM2ePu9OZ12PMcrOfe643wUP8+wAAAAHlJREFUeF5ti8cOAyEMBR+7gGFLeu+9x/z/30WYA1GUOdijkQ28nrTdAK0xbU95oOHItRNn1wF4SzizMAZAYocUCgCV2CkFROL3TdfETEPnNerVni733eNo1tNGTUrM+YtRfwCREIJsW3EOif8hM/u9KMolLGcW2rsP+DsekAyk7jQAAAAASUVORK5CYII=",
        icon = $('<link/>').attr('rel','shortcut icon').attr('href',cytuicon).appendTo($("head"))[0]; /* '[0]' because this returns an array for some reason */
    window.onfocus=function(){
        hasfocus=1,
        missedchats=0,
        document.title=window.PAGETITLE,
        icon.href=cytuicon
    };
    window.onblur=function(){
        hasfocus=0
    };
    return function(e){
 
        if (!hasfocus){
            document.title='('+(++missedchats)+') ' + window.PAGETITLE;
            icon.href=cytuicon2
        }
       
        return addChatMessage_ori.call(this,e), (function(){ /* voor dat worp gebeuren */
            var el = $('.worp:not(.action)')[$('.worp:not(.action)').length-1];
            el && (el.parentNode.className = 'action ' + el.className, el.className = '');
        })()
    }
})();
 
/*
goodbye msg - names are case-sensitive
*/
 
var userLeave_ori = userLeave_ori || Callbacks.userLeave;
Callbacks.userLeave = function(e) {
 
    var bericht;
    switch (e.name){
        case "RodeVans":
            bericht = "gaat op zoek naar touw en krukje"; break;
        case "sinterklaas":
            bericht = "gaat het pentagon hekken, maar dokst daarbij per ongeluk zichzelf"; break;
        case "chillburg":
            bericht = "gaat naar buiten in straattaal spreken die niemand kan begrijpen"; break;
        case "Zaag":
            bericht = "gaat conciërge spelen op /int/"; break; /* "gaat dromen over welke nederdrader hij morgen een fanfictie gaat schrijven"; break; */
        case "staneke":
            bericht = "gaat naar de winkel om daar een paar blikken te wisselen met zijn Fatima-eenitus"; break;
        case "Bertmarck":
            bericht = "gaat weer in en uitloggen"; break;
        case "Berteke":
            bericht = "gaat werk zoeken"; break;
        case "Bourg":
            bericht = "gaat zijn 5 honden uitlaten"; break;
        case "friet":
            bericht = "从来没有见过一个阴道"; break;
        case "Gaart_":
            bericht = "gaat zijn zakmonster knuffelen"; break;
        case "EenVerdrinkendeLeeuw":
            bericht = "gaat land zoeken"; break;
        case "Henkie":
            bericht = "gaat maar eens een dutje doen"; break;
        case "lievejongen":
            bericht = " gaat omlaag knikken"; break;
        case "Baarn":
            bericht = "gaat zijn kippen knuffelen"; break;
        case "klepelknul":
            bericht = "wil ook een speciaal weggaansbericht"; break;
        case "Beir":
            bericht = "gaat zichzelf volvreten met frut"; break;
        case "dumbape":
            bericht = "is onthoofd door de Braziliaanse maffia"; break;
        case "Jansen":
            bericht = "gaat haha lol kek lel"; break;
        case "Marginaalst":
            bericht = "is flauwgevallen"; break;
        case "Freems":
            bericht = "is going to visit Karen-chan"; break;
        case "belgske":
            bericht = "gaat zijn wormen voeren"; break;
        case "Blabant":
            bericht = "gaat weer een andere nutteloze taal leren"; break;
        default:
            bericht = "vertrekt";
    }
    if (e.name.toLowerCase().indexOf('bert') == -1 && e.name.toLowerCase().indexOf('lievejongen') == -1)
        addChatMessage({
            username : '',
            msg : e.name + ' ' + bericht,
            meta : {addClass : 'server-whisper'},
            time : new Date().getTime()
        });
    return userLeave_ori.call(this,e)
}
 
/*
 * kick AFK
*/
 
var KickOnAFKForXTime = KickOnAFKForXTime || {};
KickOnAFKForXTime.set = (function(){
    var interval,timeAFK,kickAfterMinutes = 60,
        msg = (function(){
            switch (CLIENT.name){
                case "RodeVans":
                    return "/me is eindelijk bezweken aan zijn leverfalen"
                case "Beir":
                    return "/me is door zijn stoel gezakt"
                default:
                    return "/me is in slaap gevallen"
            }
        })(),
        intervalFunc = function(){
            timeAFK++;
            // after reconnect user is not afk anymore
            if (!findUserlistItem(CLIENT.name).data("afk"))
                clearInterval(interval);
            else if (timeAFK >= kickAfterMinutes && CLIENT.name != 'Bourg'){
            //  socket.emit("chatMsg", {msg:msg,meta:{}});
                setTimeout(function(){
                    $("<div/>").addClass("server-msg-disconnect").text("you snooze you lose").appendTo($("#messagebuffer"));
                    scrollChat();
                    window.socket.destroy();
                    clearInterval(interval)
                },2000);
            }
        },
        afk = function(){
            timeAFK = 0;
            interval = setInterval(intervalFunc,60000)
        }
   
    return function(e){
        e.afk?afk():clearInterval(interval)
        /*
        if (e.afk) afk()
        else clearInterval(interval)
        */
    }
})();
//overwrite setAFK callback
if (!KickOnAFKForXTime.oriCallback) KickOnAFKForXTime.oriCallback = Callbacks.setAFK;
Callbacks.setAFK = function(e) {
    if (CLIENT.name == e.name) KickOnAFKForXTime.set(e);
    return KickOnAFKForXTime.oriCallback(e);
}
 
/*
toggle video visability & remove until next video
taken from /v4c/ and hardly modified
*/
$('nav.navbar a[href="#"][onclick]').attr("href", "javascript:void(0)");
if (!$('a[onclick*="removeUntilNext"]').length) {
    $('a[onclick*="removeVideo"]').parent().parent().append($("<li>").append($("<a>").attr("href", "javascript:void(0)").attr("onclick", "javascript:removeUntilNext()").text("Remove Video Until Next")))
}
function removeUntilNext() {
    socket.once("changeMedia", unremoveVideo);
    return removeVideo()
}
function removeVideo(event) {
 
    //socket.emit("voteskip");
   
    try {
        PLAYER.setVolume(0);
        if (PLAYER.type === "rv") {
            killVideoUntilItIsDead($(PLAYER.player))
        }
    } catch (e) {
        console.log(e)
    }
    CLIENT.removedOnGDrive = PLAYER.mediaType == "gd" ? true : false;
    $("#videowrap").hide().attr("id", "videowrap_disabled");
    $("#ytapiplayer").attr("id", "ytapiplayer_disabled");
    $("#chatwrap").removeClass("col-lg-5 col-md-5").addClass("col-md-12");
    $('a[onclick*="removeVideo"]').attr("onclick", "javascript:unremoveVideo(event)").text("Show video");
    if (event)
        event.preventDefault()
}
function unremoveVideo(event) {
    setTimeout(function() {
        PLAYER.setVolume(.33)
    }, 250);
    socket.emit("playerReady");
    $("#chatwrap").addClass("col-lg-5 col-md-5").removeClass("col-md-12");
    $("#videowrap_disabled").attr("id", "videowrap").show();
    $("#ytapiplayer_disabled").attr("id", "ytapiplayer");
    $('a[onclick*="removeVideo"]').attr("onclick", "javascript:removeVideo(event)").text("Remove video");
    if (event)
        event.preventDefault();
//    if (CLIENT.removedOnGDrive) {
//        CLIENT.removedOnGDrive = false;
        setTimeout(function() {
            $("#mediarefresh").click()
        }, 1e3)
//    }
} 
