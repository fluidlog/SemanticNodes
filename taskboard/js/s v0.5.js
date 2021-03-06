/*
 * Hai!
 *
 * This is a script that makes Taskboard 10k awesome ;)
 * At least it's my very humble opinion.
 *
 * So, you want to know how it was all done?
 * Great! But make sure you are brave enough to go down into dungerons
 * of this script. There is a lot of magic down there.
 *
 * Really. This whole thing had to fit into 10k limit, so not very best
 * JavaScript programming practices were used in some places. And it is
 * very likely that there are pieces of code that will be not easy to 
 * decypher.
 *
 * So you still want to move forward?
 *
 * You were warned ;)
 *
 * ====================================================================
 *
 *
 */

(function (document, $, storage) { // let's pull all of this into context of nice function

// So here we start with very long definition of constants.
// These are strings and other values used a lot in the script.
// Sometimes they may feel as an overhead, but it was all done
// to make this script nicely minify.

    // CONSTANTS
    // ===========

var HTML_CARD = "<section class=card><div class=text>",

    // some class names
    DRAG = "drag",
    EDIT = "edit",
    PICK = "pick",
    MARK = "mark",

    // selectors
    CARD      = ".card",
    TEXT      = ".text",
    TAG       = ".tag",
    ACTION    = "menu a",

    HAS_MARK = ':has(.' + MARK + ')',

    DOT = ".", // :) used to turn class names into selectors

    // events
    CLICK     = "click",
    DBLCLICK  = "dblclick",
    HOVER     = "hover",
    KEYDOWN   = "keydown",
    MOUSEDOWN = "mousedown",
    MOUSEUP   = "mouseup",
    MOUSEMOVE = "mousemove",

    // other strings
    CONTENTEDITABLE = "contentEditable",

    VALUE = "value",

    TOP  = "top",
    LEFT = "left",

    STORAGE_KEY = "board",

    TRUE  = !0 + "", // == "true"  //  little inconsistency, but I use "true" only as a string
    FALSE = !1,      // == false   //  and false more as boolean

    COLORS = ['white', 'green', 'blue', 'red', 'orange', 'yellow'],

    // checks if class name contains one of the colors
    R_COLORCLASS = new RegExp('\\b(' + COLORS.join(')|(') + ')\\b'),

    // checks if event type is mouseenter or mouseover
    R_MOUSEIN = /^mouse(enter|over)/i,

    // namespace object for actions triggered by toolbar icons
    ACTIONS = {

        // clears board by removing saved data & reloads the page
        r: function () {
            if (confirm("Are you sure you want to clear all saved data?")) {
                storage.removeItem(STORAGE_KEY); // .clear() would be fine too, but I don't want to remove
                                                 // data of other demos on 10k apart domain :)
                location.reload();
            }
        },

        // CARD ACTIONS
        
        // edit
        e: function ($card) {
            $card[DBLCLICK](); // hacky way of saying .trigger("dblclick"),
                               // because dblclick launches edit mode
                               // see line 484 where it is handled
        },
        
        // change color, by switching to next color from the list
        // 'cause color pickers are so unusable...
        // and, anyway, there are only six colors, right?
        c: function ($card) {
            var color = $card.color();
            if (color) {
                $card.removeClass(color); // .removeClass -- I guess this is the first place I use my short alias
                                 //                 you will find more about that around line 359 where
                                 //                 they are defined 
                color = COLORS.indexOf(color);
                color = COLORS[++color < 6 ? color : 0]; // 6 is COLORS.length
                $card.addClass(color); // .addClass
                save();
            }
        },
        
        // delete
        d: function ($card) {
            if (confirm("Are you sure you want to delete this card?")) 
            {
                $card.fadeOut(function () {
                    $card.remove();
                    save();
                });
            }
        },

        // TEXT FORMATTING
        
        // bold -- yes, you guesed it right ;)
        b: function () {
            document.execCommand("bold", FALSE, "");
        },
        
        // italic
        i: function () {
            document.execCommand("italic", FALSE, "");
        },
        
        // heading
        h: function () {
            block("p", "h2");
        },
        
        // paragraph
        p: function () {
            block("h2", "p");
        }

    },

    // list of some more or less useful tips
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

// Now, these down there can be finally called variables
// even though some of them don't change much

    // VARIABLES
    // ===========

    // jQuery objects with application elements
    $document = $(document),
    $body = $(document.body),
    
    $board,   // <section id=board> -- contains all the cards added by user
    $deck,    // <aside id=deck>    -- contains set of new cards to take
    $actions, // <menu>             -- toolbar with card actions
    $editbar, // <menu class=edit>  -- toolbar with text formatting actions

    lastTip = -1, // index of last used tip

    data; // here is were board data is loaded

// http://en.wikipedia.org/wiki/Truecolor ;)
TIPS[24] = "Oh, I forgot to tell you about HEX color tags #F5A";

// little easter egg ;)
TIPS[42] = "Answer to life, the universe and everything is <b>42</b>";


// FUNCTIONS
// ===========

// returns tips, one by one
function tip() {
    return TIPS[++lastTip] ? "<p>" + TIPS[lastTip] + " #tip</p>" : "";
}


// Firefox for some reason didn't work well with execCommand("formatblock",...)
// so here is some workaround for that
//   find     - is name of the tag we want to replace
//   replace  - is name of the tag we want to have
// In the case of card text only "p" and "h2" are possible
function block(find, replace) {
    if ($.browser.mozilla) {
        var $node = $(getSelection().anchorNode);
        if ($node.is(TEXT)) {
            $node = $node.$(find).eq(0);
        } else {
            $node = $node.closest(TEXT + " " + find);
        }
        $node.replaceWith(function (i, html) {
            return "<" + replace + ">" + html + "</" + replace + ">";
        });
    } else {
        document.execCommand("formatblock", FALSE, "<" + replace + ">");
    }
}

// returns all the tags with given text
function tags(text) {
    return $board.$(TAG).filter(function () {
        return $(this).text().toLowerCase() == text.toLowerCase();
    });
}

// saves current board state to local storage
function save() {
    var cards = [],
        $card; // used in .each loop, but it saves one 'var' statement
    
    $board.$(CARD).each(function () {
        $card = $(this);
        cards.push($.extend($card.offset(), {
            type: $card.color(),
            text: $card.data(VALUE) || ""
        }));
    });
    storage.setItem(STORAGE_KEY, JSON.stringify(cards));
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
            .delegate(ACTION, CLICK, function (e) {
                ACTIONS[this.className]($(this).closest(CARD)); // launch action based on class name
                return FALSE;
            });
}

// closes edit mode and stores or discards changes
// by default changes are saved
//   cancel - if true, discards the changes
function closeEdit(cancel) {
    var $card = $board.$(CARD + DOT + EDIT).eq(0), value;
    
    $editbar.detach();

    $body.add($card.drop()).removeClass(EDIT); // .removeClass
    value = cancel ? $card.data(VALUE) : $card.$(TEXT).html();
    $card.saveText(value)
        .$(TEXT)
            .attr(CONTENTEDITABLE, FALSE) // cannot remove the attr because Firefox is complaining
            .blur();
    $document.unbind(KEYDOWN);
    save();
}


// key code based action aliases (for hot-keys)
$.extend(ACTIONS, {
    66: ACTIONS.b, // Ctrl + B
    73: ACTIONS.i, // Ctrl + I
    72: ACTIONS.h, // Ctrl + H
    // 80: ACTIONS.p -- using 'G' as a hotkey for paraGraph, as printing on Ctrl+P cannot be canceled in IE9
    71: ACTIONS.p, // Ctrl + G
    83: closeEdit  // Ctrl + S -- not working in IE9 (cannot prevent save dialog)
});


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
$.each([PICK, "drop"], function (i, name) {
    var pick = name == PICK;
    function offset(i, value) {
        return parseInt(value, 10) + (pick ? -5 : 5);
    }
    
    $.fn[name] = function () {
        return this.each(function ($this) {
            $this = $(this);
            if ($this.hasClass(PICK) != pick) { // .hasClass
                $this.toggleClass(PICK, pick).css(TOP, offset).css(LEFT, offset); // .toggleClass
            }
        });
    };
});

$.fn.extend({

    // jQuery.fn.color -- returns a color class of the card
    color: function (color) { // var as param
        color = this[0].className.match(R_COLORCLASS);
        return color ? color[0] : "";
    },

    // jQuery.fn.saveText -- saves and formats card text... and something more ;)
    saveText: function (text) {

        // if HEX color tag found in text, use this color as card background :)
        var colorTag = text.match(/(\s|^|>)(#[a-f0-9]{3}([a-f0-9]{3})?)\b/i);
        colorTag = colorTag ? colorTag[2] : "";

        this.closest(CARD)
            .css({ backgroundColor: colorTag, borderColor: colorTag }) // change color to HEX tag found (if any)
            .data(VALUE, text)                                         // store raw text
            .$(TEXT).html(                                             // format and put card text
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

    // short aliases to commonly used jQuery functions
    // I know, it makes the code a little bit harder to read, but it saves
    // some precious bytes so get used to it ;)

    //dlg: $.fn.delegate,
    $: $.fn.find,

    //up: $.fn.closest,
    //to: $.fn.appendTo,

    //aC: $.fn.addClass,
    //rC: $.fn.removeClass,
    //tC: $.fn.toggleClass,
    //hC: $.fn.hasClass

});


// And after all these definitions finally something will begin to happen

$(function () { // $(document).ready() -- theoretically not needed, as we don't manipulate the document contents
                //                        and this script is loaded in the end anyway

    // loading data from storage (or using some dummy cards)
    data = storage.getItem(STORAGE_KEY);
    data = data ? JSON.parse(data) : [
        { type: COLORS[0], text: "<p><i>Welcome to</i></p><h2>Taskboard 10k</h2>", top: 40, left: 70 },
        { type: COLORS[5], text: "toto", top: 120, left: 80 },
        { type: COLORS[1], text: "<p><b>Soyez heureux!</b></p>", top: 180, left: 90 }
    ];

    // building the board
    $board = $("<section id=board>").appendTo($body);

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
                             ["p", "Paragraph (Ctrl+R)"]]).addClass(EDIT); // .addClass

    buildActions([["r", "Clear board"]]).appendTo($body);

    // preparing deck with new cards
    $deck = $("<aside id=deck>").appendTo($body)
        // on hover cards in deck are animated to encourage users to take them :)
        .delegate(CARD, HOVER, function (event) {
            if (!$body.hasClass(EDIT) && !$body.hasClass(MARK)) { // .hasClass
                $(this).stop().move(R_MOUSEIN.test(event.type) ? 20 : 0);
            }
        })
        // on mousedown new card is added to the board and can be dragged
        .delegate(CARD, MOUSEDOWN, function (event) {
            // adding new cards from deck
            if (!$body.hasClass(EDIT) && !$body.hasClass(MARK)) { // .hasClass
                var $card = $(this);
                $card.clone()          // clone deck card and add it to the board
                    .pick().addClass(DRAG)
                    .css($card.offset())
                    .saveText(tip())
                    .appendTo($board)
                    .trigger(event);   // start dragging new card
                
                $card.hide();             // hide deck card
                setTimeout(function () {  // and show it again after a while
                    $card.css(LEFT, -40).show().move(0);
                }, 1000);
            }
        });
    
    // add a card to the deck for each color
    $.each(COLORS, function (i, color) {
        i = 6 - i; // 6 is COLORS.length
        $("<section class=card><div class=text>")
            .appendTo($deck)
            .addClass(color) // .addClass
            .css(TOP, i * 30).css(LEFT, -40)
            .delay(i * 100) // animate cards into view one by one
            .move(0);
    });

// And finally the most interesting part - here it what is going on on the board

    $board
        // CARD EVENTS
        // on mousedown init card dragging
        .delegate(CARD, MOUSEDOWN, function (mouseDownEvent) {
            // don't drag in edit mode or if a tag or action is clicked on a card
            if (!$body.hasClass(EDIT) && !$(mouseDownEvent.target).is(TAG + "," + ACTION)) { // .hasClass
                var $card = $(this).appendTo($board),
                    offset = $card.offset();
                
                $document
                    .bind(MOUSEMOVE, function (moveEvent) {
                        // pick a card and move it around
                        $card.pick().addClass(DRAG) // .addClass
                            .css(LEFT, offset[LEFT] + moveEvent.pageX - mouseDownEvent.pageX)
                            .css(TOP,  offset[TOP]  + moveEvent.pageY - mouseDownEvent.pageY);
                    });
                
                return FALSE; // and don't select text, please
            }
        })
        // on mouseup finish dragging
        .delegate(CARD, MOUSEUP, function ($card) { // var as param
            $card = $(this);
            $document.unbind(MOUSEMOVE);
            if ($card.hasClass(DRAG)) { // .hasClass
                $card.removeClass(DRAG);   // .removeClass
                if (!$card.hasClass(MARK)) {
                    $card.drop(); // drop a card, but only if it is not selected
                }
                save();
            }
        })
        // on dblclick start editing card text
        .delegate(CARD, DBLCLICK, function (event) {
            // don't start editing if a tag or action was clicked
            if (!$(event.target).is(TAG + "," + ACTION)) {
                var $card = $(this),
                    $text = $card.$(TEXT),
                    value = $card.data(VALUE);
                
                if ($text[0][CONTENTEDITABLE] != TRUE) {
                    $document[CLICK](); // trigger document click to unselect cards
                                        // check line 549 to see what it does
                    $body.add($card.pick().removeClass(MARK)).addClass(EDIT); // .addClass
                    $editbar.appendTo($card);
                    
                    $text
                        .html(value)
                        .attr(CONTENTEDITABLE, TRUE)
                        .focus();
                    
                    $document.bind(KEYDOWN, function (keyEvent) { // bind hot-keys listener
                            if (keyEvent.which == 27) { // ESC pressed - cancel edit
                                closeEdit(TRUE);
                            }
                            if (keyEvent.ctrlKey && ACTIONS[keyEvent.which]) {
                                ACTIONS[keyEvent.which]();
                                return FALSE;
                            }
                    });
                }
            }
        })
        // on hover show action toolbar
        .delegate(CARD, HOVER, function (event) {
            if (R_MOUSEIN.test(event.type)) {
                $actions.appendTo($(this));
            } else {
                $actions.detach();
            }
        })
        
        // TAG EVENTS
        // on hover highlight all tags with same text
        .delegate(TAG, HOVER, function (event) {
            // toggle hover class on all tags with same text
            tags($(this).text()).toggleClass(HOVER, R_MOUSEIN.test(event.type)); // .toggleClass
        })
        // on click select all cards with same tags
        .delegate(TAG, CLICK, function ($cards) { // var as param
            $cards = tags($(this).text()).toggleClass(MARK).closest(CARD); // .toggleClass
            
            if ($(this).hasClass(MARK)) { // .hasClass
                // tags were selected, so highlight tagged cards
                $cards.pick()
                    .add($body).addClass(MARK); // .addClass
            } else {
                // tags were unselected, so drop tagged cards
                $cards.not(HAS_MARK).removeClass(MARK).drop();
                $body.not(HAS_MARK).removeClass(MARK); // .removeClass
            }
        });

// We are almost at the end of out journey.
// Last but not least, the event binded to the document itself.

    $document
        // when clicked somewhere on the page close edit mode and unselect all cards
        .bind(CLICK, function ($target) {
            $target = $($target.target);
            if ($body.hasClass(EDIT) && !$target.closest(CARD + DOT + EDIT)[0]) { // .hasClass
            // if in edit mode and clicked outside edited card, close edit mode and save
                closeEdit();
            } else if ($target.has($body)[0]) { // .has($body) is a short way of checking if element is document root
                // if clicked somewhere on the page background, unselect all cards
                $(DOT + MARK).removeClass(MARK).drop(); // .removeClass
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
