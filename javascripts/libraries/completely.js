/**
 * complete.ly 1.0.0
 * MIT Licensing
 * Copyright (c) 2013 Lorenzo Puccetti
 *
 * This Software shall be used for doing good things, not bad things.
 *
**/
function completely(container, config) {
    config = config || {};
    config.fontSize =                       config.fontSize   || '16px';
    config.fontFamily =                     config.fontFamily || 'sans-serif';
    config.promptInnerHTML =                config.promptInnerHTML || '';
    config.color =                          config.color || '#333';
    config.hintColor =                      config.hintColor || '#aaa';
    config.backgroundColor =                config.backgroundColor || '#fff';
    config.dropDownBorderColor =            config.dropDownBorderColor || '#aaa';
    config.dropDownZIndex =                 config.dropDownZIndex || '-200'; // to ensure we are in front of everybody
    config.dropDownOnHoverBackgroundColor = config.dropDownOnHoverBackgroundColor || '#ddd';

    var txtInput = document.createElement('input');
    // txtInput.type ='text';
    // txtInput.spellcheck = false;
    // txtInput.style.fontSize =        config.fontSize;
    // txtInput.style.fontFamily =      config.fontFamily;
    // txtInput.style.color =           config.color;
    // txtInput.style.backgroundColor = config.backgroundColor;
    txtInput.style.width = '100%';
    // txtInput.style.outline = '0';
    // txtInput.style.border =  '0';
    // txtInput.style.margin =  '0';
    // txtInput.style.padding = '0';

    txtInput.setAttribute("class", "transcription-input");

    var txtHint = txtInput.cloneNode();
    txtInput.placeholder = "Start transcribing here...";
    txtInput.setAttribute("class", "transcription-input transcription-input-main");
    txtHint.disabled='';
    txtHint.style.position = 'absolute';
    txtHint.style.top =  '0';
    txtHint.style.left = '0';
    txtHint.style.overflow = 'none';
    txtInput.style.border = '2px solid transparent';
    txtInput.style["padding-right"] = '100px';
    // txtInput.style.color = 'transparent';
    // txtHint.style.borderColor = 'transparent';
    // txtHint.style.boxShadow =   'none';
    txtHint.style.color = config.hintColor;

    txtInput.style.backgroundColor ='transparent';
    txtInput.style.verticalAlign = 'top';
    txtInput.style.position = 'relative';

    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    // wrapper.style.outline = '0';
    // wrapper.style.border =  '0';
    // wrapper.style.margin =  '0';
    // wrapper.style.padding = '0';

    var prompt = document.createElement('div');
    prompt.style.position = 'absolute';
    // prompt.style.outline = '0';
    // prompt.style.margin =  '0';
    // prompt.style.padding = '0';
    // prompt.style.border =  '0';
    // prompt.style.fontSize =   config.fontSize;
    // prompt.style.fontFamily = config.fontFamily;
    // prompt.style.color =           config.color;
    // prompt.style.backgroundColor = config.backgroundColor;
    prompt.style.top = '0';
    prompt.style.left = '0';
    prompt.style.overflow = 'hidden';
    prompt.innerHTML = config.promptInnerHTML;
    prompt.style.background = 'transparent';
    if (document.body === undefined) {
        throw 'document.body is undefined. The library was wired up incorrectly.';
    }
    document.body.appendChild(prompt);
    var w = prompt.getBoundingClientRect().right; // works out the width of the prompt.
    wrapper.appendChild(prompt);
    prompt.style.visibility = 'visible';
    prompt.style.left = '-'+w+'px';
    wrapper.style.marginLeft= w+'px';

    wrapper.appendChild(txtHint);
    wrapper.appendChild(txtInput);

    var dropDown = document.createElement('div');
    dropDown.style.position = 'absolute';
    dropDown.style.visibility = 'hidden !important';
    // dropDown.style.outline = '0';
    // dropDown.style.margin =  '0';
    // dropDown.style.padding = '0';
    dropDown.style.textAlign = 'left';
    // dropDown.style.fontSize =   config.fontSize;
    // dropDown.style.fontFamily = config.fontFamily;
    // dropDown.style.backgroundColor = config.backgroundColor;
    dropDown.style.zIndex = config.dropDownZIndex;
    dropDown.style.cursor = 'default';
    // dropDown.style.borderStyle = 'solid';
    // dropDown.style.borderWidth = '1px';
    // dropDown.style.borderColor = config.dropDownBorderColor;
    dropDown.style.overflowX= 'hidden';
    dropDown.style.whiteSpace = 'pre';
    dropDown.style.overflowY = 'scroll';  // note: this might be ugly when the scrollbar is not required. however in this way the width of the dropDown takes into account

    var createDropDownController = function(elem) {
        var onMouseOver =  function() { }
        var onMouseOut =   function() { }
        var onMouseDown =  function() { }

        var p = {
            hide :  function() { elem.style.visibility = 'hidden'; },
            refresh : function(token, array) { },
            highlight : function(index) { },
            move : function(step) {  },
            onmouseselection : function() {} // it will be overwritten.
        };
        return p;
    }

    var dropDownController = createDropDownController(dropDown);

    dropDownController.onmouseselection = function(text) { }

    wrapper.appendChild(dropDown);
    container.appendChild(wrapper);

    var spacer;
    var leftSide; // <-- it will contain the leftSide part of the textfield (the bit that was already autocompleted)


    function calculateWidthForText(text) {
        if (spacer === undefined) { // on first call only.
            spacer = document.createElement('span');
            spacer.style.visibility = 'hidden';
            spacer.style.position = 'fixed';
            // spacer.style.outline = '0';
            // spacer.style.margin =  '0';
            // spacer.style.padding = '0';
            // spacer.style.border =  '0';
            spacer.style.left = '0';
            spacer.style.whiteSpace = 'pre';
            spacer.style.fontSize =   config.fontSize;
            spacer.style.fontFamily = config.fontFamily;
            spacer.style.fontWeight = 'normal';
            document.body.appendChild(spacer);
        }

        // Used to encode an HTML string into a plain text.
        // taken from http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
        spacer.innerHTML = String(text).replace(/&/g, '&amp;')
                                       .replace(/"/g, '&quot;')
                                       .replace(/'/g, '&#39;')
                                       .replace(/</g, '&lt;')
                                       .replace(/>/g, '&gt;');
        return spacer.getBoundingClientRect().right;
    }


    var rs = {
        onArrowDown : function() {},               // defaults to no action.
        onArrowUp :   function() {},               // defaults to no action.
        onEnter :     function() {},               // defaults to no action.
        onTab :       function() {},               // defaults to no action.
        onChange:     function() { rs.repaint() }, // defaults to repainting.
        startFrom:    0,
        options:      [],
        addedWords: Object.create(null),
        wrapper : wrapper,      // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        input :  txtInput,      // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        hint  :  txtHint,       // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        dropDown :  dropDown,         // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        prompt : prompt,
        setText : function(text) {
            txtHint.value = text;
            txtInput.value = text;
        },
        getText : function() {
          return txtInput.value;
        },
        hideDropDown : function() {
          dropDownController.hide();
        },
        initializeOptionsHash : function () {
            var optionsHash = Object.create(null);
            this.options.forEach(function (option) {
                optionsHash[option.substring(0,4)] = (optionsHash[option.substring(0,4)] || []);
                optionsHash[option.substring(0,4)].push(option);
            });
            this.optionsHash = optionsHash;
        },
        addToOptionsHash : function (option) {
            if (!this.addedWords[option]) {
                this.optionsHash[option.substring(0,4)] = (this.optionsHash[option.substring(0,4)] || []);
                this.optionsHash[option.substring(0,4)].push(option);
                this.addedWords[option] = true;
            }
        },
        repaint : function() {
            var text = txtInput.value;
            var startFrom =  rs.startFrom;
            var options =    rs.options;
            var optionsLength = options.length;

            if (!this.optionsHash) {
                this.initializeOptionsHash();
            }

            // breaking text in leftSide and token.
            var token = text.substring(startFrom);
            leftSide =  text.substring(0,startFrom);

            // updating the hint.
            txtHint.value ='';

            if (token.length > 3) {
                options = this.optionsHash[token.substring(0,4)];
                optionsLength = (options || []).length;
                for (var i=0;i<optionsLength;i++) {
                    var opt = options[i];
                    if (this.lastOpt !== opt) {
                        txtHint.style.color = "rgba(0,0,0,0)";
                    }
                    txtHint.value = leftSide + opt + "                             ";
                    setTimeout(function () {
                        $(".transcription-input").eq(0).scrollLeft($(".transcription-input-main").scrollLeft());
                        var counter = 0;
                        while ($(".transcription-input").eq(0).scrollLeft() != $(".transcription-input-main").scrollLeft() && counter < 100000) {counter++;}
                        txtHint.style.color = "#aaa";
                    }, 0);
                    this.lastOpt = opt;
                    break;
                }
            }

            // moving the dropDown and refreshing it.
            dropDown.style.left = calculateWidthForText(leftSide)+'px';
            dropDownController.refresh(token, rs.options);
        }
    };

    var registerOnTextChangeOldValue;

    /**
     * Register a callback function to detect changes to the content of the input-type-text.
     * Those changes are typically followed by user's action: a key-stroke event but sometimes it might be a mouse click.
    **/
    var registerOnTextChange = function(txt, callback) {
        registerOnTextChangeOldValue = txt.value;
        var handler = function() {
            if (txtInput.value === '') {
                txtHint.value = '';
                return;
            }
            var value = txt.value;
            if (registerOnTextChangeOldValue !== value) {
                registerOnTextChangeOldValue = value;
                callback(value);
            }
        };

        //
        // For user's actions, we listen to both input events and key up events
        // It appears that input events are not enough so we defensively listen to key up events too.
        // source: http://help.dottoro.com/ljhxklln.php
        //
        // The cost of listening to three sources should be negligible as the handler will invoke callback function
        // only if the text.value was effectively changed.
        //
        //
        if (txt.addEventListener) {
            txt.addEventListener("input",  handler, false);
            txt.addEventListener('keyup',  handler, false);
            txt.addEventListener('change', handler, false);
        } else { // is this a fair assumption: that attachEvent will exist ?
            txt.attachEvent('oninput', handler); // IE<9
            txt.attachEvent('onkeyup', handler); // IE<9
            txt.attachEvent('onchange',handler); // IE<9
        }
    };


    registerOnTextChange(txtInput,function(text) { // note the function needs to be wrapped as API-users will define their onChange
        rs.onChange(text);
    });


    var keyDownHandler = function(e) {
        if (txtInput.value === '') {
            txtHint.value = '';
            return;
        }

        e = e || window.event;
        var keyCode = e.keyCode;

        if (keyCode == 33) { return; } // page up (do nothing)
        if (keyCode == 34) { return; } // page down (do nothing);

        if (keyCode == 27) { //escape
            dropDownController.hide();
            txtHint.value = txtInput.value; // ensure that no hint is left.
            txtInput.focus();
            return;
        }

        if (keyCode == 39 || keyCode == 35 || keyCode == 9) { // right,  end, tab  (autocomplete triggered)
          if (keyCode == 9) { // for tabs we need to ensure that we override the default behaviour: move to the next focusable HTML-element
                e.preventDefault();
                e.stopPropagation();
                if (txtHint.value.length == 0) {
                  rs.onTab(); // tab was called with no action.
                              // users might want to re-enable its default behaviour or handle the call somehow.
                }
            }
            if (txtHint.value.length > 0) { // if there is a hint
                dropDownController.hide();
                txtInput.value = txtHint.value.replace(/^\s+|\s+$/g, '');
                $(".transcription-input-main").scrollLeft(Infinity);
                var hasTextChanged = registerOnTextChangeOldValue != txtInput.value;
                registerOnTextChangeOldValue = txtInput.value; // <-- to avoid dropDown to appear again.
                                                          // for example imagine the array contains the following words: bee, beef, beetroot
                                                          // user has hit enter to get 'bee' it would be prompted with the dropDown again (as beef and beetroot also match)
                if (hasTextChanged) {
                    rs.onChange(txtInput.value); // <-- forcing it.
                }
            }
            return;
        }

        if (keyCode == 13 && false) {       // enter  (autocomplete triggered)
            if (txtHint.value.length == 0) { // if there is a hint
                rs.onEnter();
            } else {
                var wasDropDownHidden = (dropDown.style.visibility == 'hidden');
                dropDownController.hide();

                if (wasDropDownHidden) {
                    txtHint.value = txtInput.value; // ensure that no hint is left.
                    txtInput.focus();
                    rs.onEnter();
                    return;
                }

                txtInput.value = txtHint.value;
                var hasTextChanged = registerOnTextChangeOldValue != txtInput.value
                registerOnTextChangeOldValue = txtInput.value; // <-- to avoid dropDown to appear again.
                                                          // for example imagine the array contains the following words: bee, beef, beetroot
                                                          // user has hit enter to get 'bee' it would be prompted with the dropDown again (as beef and beetroot also match)
                if (hasTextChanged) {
                    rs.onChange(txtInput.value); // <-- forcing it.
                }

            }
            return;
        }

        if (keyCode == 40) {     // down
            var m = dropDownController.move(+1);
            if (m == '') { rs.onArrowDown(); }
            txtHint.value = leftSide+m;
            return;
        }

        if (keyCode == 38 ) {    // up
            var m = dropDownController.move(-1);
            if (m == '') { rs.onArrowUp(); }
            txtHint.value = leftSide+m;
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // it's important to reset the txtHint on key down.
        // think: user presses a letter (e.g. 'x') and never releases... you get (xxxxxxxxxxxxxxxxx)
        // and you would see still the hint
        txtHint.value =''; // resets the txtHint. (it might be updated onKeyUp)

    };

    if (txtInput.addEventListener) {
        txtInput.addEventListener("keydown",  keyDownHandler, false);
    } else { // is this a fair assumption: that attachEvent will exist ?
        txtInput.attachEvent('onkeydown', keyDownHandler); // IE<9
    }
    return rs;
}