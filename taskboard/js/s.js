/*
 * Modifications de Yannick :
 * https://fluidlog.cloud.xwiki.com/xwiki/bin/view/Main/NettoyageTaskboard10k
 * ====================================================================
 */

(function (document, $, storage) {

var version = "0.7" ;
var COLORS = ['white', 'green', 'blue', 'red', 'orange', 'yellow'];
var R_MOUSEIN = /^mouse(enter|over)/i;

var    ACTIONS = {

		r: function () 
		{
            if (confirm("Are you sure you want to clear all saved data?")) 
            {
                storage.removeItem("board"); // .clear() would be fine too, but I don't want to remove
                                                 // data of other demos on 10k apart domain :)
                location.reload();
            }
        },

        e: function ($card) { $card["dblclick"](); },
        
        c: function ($card) {
            var color = $card.color();
            if (color) {
                $card.removeClass(color); 
                color = COLORS.indexOf(color);
                color = COLORS[++color < 6 ? color : 0]; // 6 is COLORS.length
                $card.addClass(color); // .addClass
                save();
            }
        },
        
        // delete
        d: function ($card) {
                $card.fadeOut(function () 
                	{
                    	$card.remove();
                    	save();
                	}
                );
        },

        b: function () { document.execCommand("bold", false, ""); },
        i: function () { document.execCommand("italic", false, ""); },
        h: function () { block("p", "h2"); },
        p: function () { block("h2", "p"); }

    };

    // list of some more or less useful tips
/*
    TIPS = [
        "Need a new card2? Just grab it from a deck on the left",
        "Move cards around to arrange them in any way you want: todo list? kanban board?",
        "Double-click card to edit",
        "You can use hotkeys when editing text, just check <i>Ctrl+I</i> or <b>Ctrl+B</b>",
        //"Just guess what <i>ESC</i> and <i>Ctrl+S</i> do", -- let them discover it... cause Ctrl+S is not working in IE9
        "Every change is immediately saved in your browser",
        "You've already noticed #tags, didn't you?",
        "<i>Ctrl+H</i> makes a</p><h2>Heading</h2><p>and <i>Ctrl+G</i> turns text into a paragraph",
        0, // pause
        "It's not a tip... I just had some spare bytes below 10k limit ;)"
    ],
*/

// Now, these down there can be finally called variables
// even though some of them don't change much

    // VARIABLES
    // ===========

    // jQuery objects with application elements
    //var $document = $(document);
	//var $body = $(document.body);
        
    var $board;   // <section id=board> -- contains all the cards added by user
	var $deck;    // <aside id=deck>    -- contains set of new cards to take
	var $actions; // <menu>             -- toolbar with card actions
	var $editbar; // <menu class=edit>  -- toolbar with text formatting actions

	var data; // here is were board data is loaded

    //lastTip = -1, // index of last used tip

// http://en.wikipedia.org/wiki/Truecolor ;)
//TIPS[24] = "Oh, I forgot to tell you about HEX color tags #F5A";

// little easter egg ;)
//TIPS[42] = "Answer to life, the universe and everything is <b>42</b>";

// FUNCTIONS
// ===========

// returns tips, one by one
/*
function tip() {
    return TIPS[++lastTip] ? "<p>" + TIPS[lastTip] + " #tip</p>" : "";
}
*/

// Firefox for some reason didn't work well with execCommand("formatblock",...)
// so here is some workaround for that
//   find     - is name of the tag we want to replace
//   replace  - is name of the tag we want to have
// In the case of card text only "p" and "h2" are possible
function block(find, replace) {
    if ($.browser.mozilla) {
        var $node = $(getSelection().anchorNode);
        if ($node.is(".text")) {
            $node = $node.$(find).eq(0);
        } else {
            $node = $node.closest(".text" + " " + find);
        }
        $node.replaceWith(function (i, html) {
            return "<" + replace + ">" + html + "</" + replace + ">";
        });
    } else {
        document.execCommand("formatblock", false, "<" + replace + ">");
    }
}

// returns all the tags with given text
/*
function tags(text) {
    return $board.$(".tag").filter(function () {
        return $(this).text().toLowerCase() == text.toLowerCase();
    });
}
*/

// saves current board state to local storage
function save() {
    var cards = [],
        $card; // used in .each loop, but it saves one 'var' statement
    
    $board.$(".card").each(function () {
        $card = $(this);
        cards.push($.extend($card.offset(), {
            type: $card.color(),
            text: $card.data("value") || ""
        }));
    });
    storage.setItem("board", JSON.stringify(cards));
}

// builds an actions toolbar for given list of actions
//   actions -- is an array of action definitions, where first element of each
//              action definition is a class name (action alias) and the second
//              one is a title to display in tooltip
//              ... just look at line 403 and you will know what I mean ;)
function buildActions(actions) {
    var menu = $("<menu>");
    $.each(actions, function (i, action) {
        menu.append("<a href=# class=" + action[0] + " title='" + action[1] + "'/>");
    });
    return menu
            // on click on action icon
            .delegate("menu a", "click", function (e) 
            		{
            			// launch action based on class name
                		ACTIONS[this.className]($(this).closest(".card"));
                		return false;
            		}
            );
}

// closes edit mode and stores or discards changes
// by default changes are saved
//   cancel - if true, discards the changes
function closeEdit(cancel) {
    var $card = $board.$(".card" + ".edit").eq(0);
    var value;
    
    $editbar.detach();

    $(document.body).add($card.drop()).removeClass("edit"); // .removeClass
    value = cancel ? $card.data("value") : $card.$(".text").html();
    $card.saveText(value)
        .$(".text")
            .attr("contentEditable", false) // cannot remove the attr because Firefox is complaining
            .blur();
    $(document).unbind("keydown");
    save();
}


// key code based action aliases (for hot-keys)
/*
$.extend(ACTIONS, {
    66: ACTIONS.b, // Ctrl + B
    73: ACTIONS.i, // Ctrl + I
    72: ACTIONS.h, // Ctrl + H
    // 80: ACTIONS.p -- using 'G' as a hotkey for paraGraph, as printing on Ctrl+P cannot be canceled in IE9
    71: ACTIONS.p, // Ctrl + G
    83: closeEdit  // Ctrl + S -- not working in IE9 (cannot prevent save dialog)
});
*/

// JQUERY EXTENSIONS
// ===================

// override default easing with easeOutBack
// this is a shortened version of easeOutBack from jQuery UI

//$.easing.swing = function (x, t, b, c, d, s) {
//    return c * ((t = t / d - 1) * t * (((s = 1.70158) + 1) * t + s) + 1) + b;
//};

// jQuery.fn.pick -- visually picks the card(s) (by adding 'pick' class and moving
//                   it a little to top / left
//
// jQuery.fn.drop -- drops the card(s) back
$.each(["pick", "drop"], function (i, name) {
    var pick = name == "pick";
    function offset(i, value) {
        return parseInt(value, 10) + (pick ? -5 : 5);
    }
    
    $.fn[name] = function () {
        return this.each(function ($this) {
            $this = $(this);
            if ($this.hasClass("pick") != pick) { // .hasClass
                $this.toggleClass("pick", pick).css("top", offset).css("left", offset); // .toggleClass
            }
        });
    };
});

$.fn.extend({

    // jQuery.fn.color -- returns a color class of the card
    color: function (color) { // var as param
        r_colorclass = new RegExp('\\b(' + COLORS.join(')|(') + ')\\b');
        color = this[0].className.match(r_colorclass);
        return color ? color[0] : "";
    },

    // jQuery.fn.saveText -- saves and formats card text... and something more ;)
    saveText: function (text) {

        // if HEX color tag found in text, use this color as card background :)
        var colorTag = text.match(/(\s|^|>)(#[a-f0-9]{3}([a-f0-9]{3})?)\b/i);
        colorTag = colorTag ? colorTag[2] : "";

        this.closest(".card")
            .css({ backgroundColor: colorTag, borderColor: colorTag }) // change color to HEX tag found (if any)
            .data("value", text)                                         // store raw text
            .$(".text").html(                                             // format and put card text
                text.replace(/(\s|^|>)(#\w*)(\b)/gi, "$1<span class=tag>$2</span>$3")   // #tags

                    // parsing and making links clickable is done with *VERY* basic regexp
                    // 'cause something more sophisticated would not fit into 10k...
                    // so fingers crossed that it will not cause problems ;)
                    //
                    // one of the problems -- &nbsp; may break link parsing
                    .replace(/&nbsp;/g, " ")
                    .replace(/(\s|^|>)(https?\:\/\/[^\s<>]+)/g, "$1<a href=$2>$2</a>")
            );
        return this;
    },

    // jQuery.fn.move -- a shortcut to the only animation used

    move: function (left) {
        return this.animate({ left: left });
    },

    $: $.fn.find,
});


// And after all these definitions finally something will begin to happen

$(function () 
	{ // $(document).ready() 

/*
*/
	// loading data from storage (or using some dummy cards)
    data = storage.getItem("board");
    data = data ? JSON.parse(data) : [
        { type: COLORS[0], text: "<p><i>Welcome to </i></p><b>Semantic Taskboard !</b>", top: 40, left: 70 },
        { type: COLORS[5], text: "Soyez vaillants !", top: 120, left: 80 },
        { type: COLORS[1], text: "<p><b>Soyez heureux!</b></p>", top: 180, left: 90 }
    ];

    // building the board
    $board = $("<section id=board>").appendTo($(document.body));
/*
*/
    $.each(data, function (i, card) {
        $("<section class=card><div class=text>")
            .addClass(card.type || COLORS[5]) // .addClass
            .css(card) // we are interested in top and left values only, rest will be hopefully ignored ;)
            .saveText(card.text)
            .appendTo($board);
    });
    // preparing toolbars
    $actions = buildActions([ ["e", "Edit"], ["c", "Change color"], ["d", "Delete"]]);

    $editbar = buildActions([["b", "Bold (Ctrl+B)"],
                             ["i", "Italic (Ctrl+I)"],
                             ["h", "Heading (Ctrl+H)"],
                             ["p", "Paragraph (Ctrl+R)"]]).addClass("edit"); // .addClass

    buildActions([["r", "Clear board"]]).appendTo($(document.body));

    // preparing deck with new cards
    $deck = $("<aside id=deck>").appendTo($(document.body))
        // on hover cards in deck are animated to encourage users to take them :)
        .delegate(".card", "hover", function (event) {
        	if (!$(document.body).hasClass("edit") && !$(document.body).hasClass("mark")) { // .hasClass
                $(this).stop().move(R_MOUSEIN.test(event.type) ? 50 : 0);
            }
        })
        // on mousedown new card is added to the board and can be dragged
        .delegate(".card", "mousedown", function (event) {
            // adding new cards from deck
            if (!$(document.body).hasClass("edit") && !$(document.body).hasClass("mark")) { // .hasClass
                var $card = $(this);
                $card.clone()          // clone deck card and add it to the board
                    .pick().addClass("drag")
                    .css($card.offset())
//                    .saveText(tip())
                    .appendTo($board)
                    .trigger(event);   // start dragging new card
                
                $card.hide();             // hide deck card
                setTimeout(function () {  // and show it again after a while
                    $card.css("left", -40).show().move(0);
                }, 1000);
            }
        });
    
    // add a card to the deck for each color
    $.each(COLORS, function (i, color) {
        i = 6 - i; // 6 is COLORS.length
        $("<section class=card><div class=text>")
            .appendTo($deck)
            .addClass(color) // .addClass
            .css("top", i * 30).css("left", -40)
            .delay(i * 100) // animate cards into view one by one
            .move(0);
    });

// And finally the most interesting part - here it what is going on on the board

    $board
        // CARD EVENTS
        // on mousedown init card dragging
        .delegate(".card", "mousedown", function (mouseDownEvent) {
            // don't drag in edit mode or if a tag or action is clicked on a card
            if (!$(document.body).hasClass("edit") && !$(mouseDownEvent.target).is(".tag" + "," + "menu a")) { // .hasClass
                var $card = $(this).appendTo($board),
                    offset = $card.offset();
                
                $(document)
                    .bind("mousemove", function (moveEvent) {
                        // pick a card and move it around
                        $card.pick().addClass("drag") // .addClass
                            .css("left", offset["left"] + moveEvent.pageX - mouseDownEvent.pageX)
                            .css("top",  offset["top"]  + moveEvent.pageY - mouseDownEvent.pageY);
                    });
                
                return false; // and don't select text, please
            }
        })
        // on mouseup finish dragging
        .delegate(".card", "mouseup", function ($card) { // var as param
            $card = $(this);
            $(document).unbind("mousemove");
            if ($card.hasClass("drag")) { // .hasClass
                $card.removeClass("drag");   // .removeClass
                if (!$card.hasClass("mark")) {
                    $card.drop(); // drop a card, but only if it is not selected
                }
                save();
            }
        })
        // on dblclick start editing card text
        .delegate(".card", "dblclick", function (event) {
            // don't start editing if a tag or action was clicked
            if (!$(event.target).is(".tag" + "," + "menu a")) {
                var $card = $(this),
                    $text = $card.$(".text"),
                    value = $card.data("value");
                
                if ($text[0]["contentEditable"] != "true") {
                    $(document)["click"](); // trigger document click to unselect cards
                                        // check line 549 to see what it does
                    $(document.body).add($card.pick().removeClass("mark")).addClass("edit"); // .addClass
                    $editbar.appendTo($card);
                    
                    $text
                        .html(value)
                        .attr("contentEditable", "true")
                        .focus();
                    
                    $(document).bind("keydown", function (keyEvent) 
                    	{ // bind hot-keys listener
                            if (keyEvent.which == 27) 
                            { // ESC pressed - cancel edit
                                closeEdit("true");
                            }
                            if (keyEvent.ctrlKey && ACTIONS[keyEvent.which]) 
                            {
                                ACTIONS[keyEvent.which]();
                                return false;
                            }
                    	}
                    );
                }
            }
        })
        // on hover show action toolbar
        .delegate(".card", "hover", function (event) {
            if (R_MOUSEIN.test(event.type)) {
                $actions.appendTo($(this));
            } else {
                $actions.detach();
            }
        })
/*        
        // TAG EVENTS
        // on hover highlight all tags with same text
        .delegate(".tag", "hover", function (event) {
            // toggle hover class on all tags with same text
            tags($(this).text()).toggleClass("hover", R_MOUSEIN.test(event.type)); // .toggleClass
        })
        // on click select all cards with same tags
        .delegate(".tag", "click", function ($cards) { // var as param
            $cards = tags($(this).text()).toggleClass("mark").closest(".card"); // .toggleClass
            
            if ($(this).hasClass("mark")) { // .hasClass
                // tags were selected, so highlight tagged cards
                $cards.pick()
                    .add($(document.body)).addClass("mark"); // .addClass
            } else {
                // tags were unselected, so drop tagged cards
                $cards.not(':has(.mark)').removeClass("mark").drop();
                $(document.body).not(':has(.mark)').removeClass("mark"); // .removeClass
            }
        });
*/
// We are almost at the end of out journey.
// Last but not least, the event binded to the document itself.

    $(document)
        // when clicked somewhere on the page close edit mode and unselect all cards
        .bind("click", function ($target) 
        		{
            		$target = $($target.target);
            		if ($(document.body).hasClass("edit") && !$target.closest(".card" + ".edit")[0]) 
            		{ // .hasClass
            			// if in edit mode and clicked outside edited card, close edit mode and save
            			closeEdit();
            		} else if ($target.has($(document.body))[0]) 
            		{ // .has($(document.body)) is a short way of checking if element is document root
            			// if clicked somewhere on the page background, unselect all cards
            			$(".mark").removeClass("mark").drop(); // .removeClass
            		}
        });

});

// And that's all folks!

})(document, jQuery, localStorage);

/*
 * I really cannot believe you've done it, all the way down here.
 * You are very brave!
 *
 * But that's really it. There is nothing more.
 *
 * I hope you enjoyed it at least a little bit.
 * Probably you did, if you are still here :)
 *
 * I need to go now, because my wife is going to hate me
 * for all these evenings and nights I did spend here ;)
 */
