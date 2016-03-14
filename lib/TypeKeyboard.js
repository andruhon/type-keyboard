"use strict";
var TypeKeyboard = (function () {
    function TypeKeyboard(container, map, settings) {
        var _this = this;
        this.container = container;
        this.keys = [];
        this.settings = {
            specialKeyCaption: {
                'space': '&#160;',
                'backsp': '&#8592;',
                'capslock': '[Aa] CapsLock'
            },
            cssClass: {
                focus: 'vc-kbd--focus',
                keyLine: 'vc-kbd__key-line',
                keyItem: 'vc-kbd__key-item',
                keyButton: 'vc-kbd__key-button',
                specialKey: 'vc-kbd__key-special'
            }
        };
        this.containerClickListener = function () {
            _this.getFocused().focus();
        };
        this.addListeners = function () {
            _this.container.addEventListener('click', _this.containerClickListener);
            var inputs = document.querySelectorAll('textarea, input');
            for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                var input = inputs_1[_i];
                input.addEventListener('focus', _this.focusListener);
            }
        };
        this.removeListeners = function () {
            _this.container.removeEventListener('click', _this.containerClickListener);
            var inputs = document.querySelectorAll('textarea, input');
            for (var _i = 0, inputs_2 = inputs; _i < inputs_2.length; _i++) {
                var input = inputs_2[_i];
                input.removeEventListener('focus', _this.focusListener);
            }
        };
        this.destroy = function () {
            _this.removeListeners();
            _this.container.innerHTML = '';
        };
        this.getFocused = function () {
            return document.getElementsByClassName(_this.settings.cssClass.focus).item(0);
        };
        this.getAllFocused = function () {
            return Array.from(document.getElementsByClassName(_this.settings.cssClass.focus));
        };
        this.focusListener = function (e) {
            var target = e.target;
            var settings = _this.settings;
            if (target.classList.contains(settings.cssClass.focus)) {
                e.preventDefault();
                return false;
            }
            else {
                _this.getAllFocused().forEach(function (f) { return f.classList.remove(settings.cssClass.focus); });
            }
            target.classList.add(settings.cssClass.focus);
            if (typeof settings.onFocusCallback == 'function') {
                settings.onFocusCallback(e);
            }
        };
        this.addCharacter = function (char) {
            var focused = _this.getFocused();
            var value = focused.value + char;
            focused.value = value;
            if (typeof _this.settings.onInputCallback == 'function') {
                _this.settings.onInputCallback(focused, value);
            }
        };
        this.spaceClick = function (e) {
            _this.addCharacter(' ');
            e.preventDefault();
            return;
        };
        this.backspClick = function (e) {
            var focused = _this.getFocused();
            var value = focused.value.substr(0, focused.value.length - 1);
            focused.value = value;
            if (typeof _this.settings.onInputCallback == 'function') {
                _this.settings.onInputCallback(focused, value);
            }
            e.preventDefault();
            return;
        };
        this.capslockClick = function (e) {
            var specialKeys = _this.container.getElementsByClassName(_this.settings.cssClass.specialKey);
            if (_this.specialKeys.capslock.activated) {
                for (var _i = 0, specialKeys_1 = specialKeys; _i < specialKeys_1.length; _i++) {
                    var specKey = specialKeys_1[_i];
                    specKey.innerHTML = specKey.innerHTML.toLowerCase();
                }
                _this.specialKeys.capslock.activated = false;
            }
            else if (!_this.specialKeys.capslock.activated) {
                for (var _a = 0, specialKeys_2 = specialKeys; _a < specialKeys_2.length; _a++) {
                    var specKey = specialKeys_2[_a];
                    specKey.innerHTML = specKey.innerHTML.toUpperCase();
                }
                _this.specialKeys.capslock.activated = true;
            }
            e.preventDefault();
            return;
        };
        this.specialKeys = {
            'space': {
                click: this.spaceClick,
                innerHTML: this.settings.specialKeyCaption.space
            },
            'backsp': {
                click: this.backspClick,
                innerHTML: this.settings.specialKeyCaption.backsp
            },
            'capslock': {
                activated: false,
                click: this.capslockClick,
                innerHTML: this.settings.specialKeyCaption.capslock
            }
        };
        for (var i = 0; i < map.length; i++) {
            this.keys.push(map[i].split(" "));
        }
        Object.assign(this.settings, settings);
        var keyboard = document.createDocumentFragment();
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var keyLine = _a[_i];
            var ul = document.createElement('ul');
            ul.classList.add(this.settings.cssClass.keyLine);
            keyboard.appendChild(ul);
            for (var _b = 0, keyLine_1 = keyLine; _b < keyLine_1.length; _b++) {
                var key = keyLine_1[_b];
                var regex = new RegExp('^{([a-z]*)}$');
                var button = void 0;
                if (regex.test(key))
                    button = this.createFunctionButton(regex.exec(key)[1]);
                else
                    button = this.createCharacterButton(key);
                var li = document.createElement('li');
                button.classList.add(this.settings.cssClass.keyItem);
                li.appendChild(button);
                ul.appendChild(li);
            }
        }
        this.container.appendChild(keyboard);
        this.addListeners();
    }
    TypeKeyboard.prototype.createCharacterButton = function (char) {
        var button = document.createElement('button');
        var addCharacter = this.addCharacter;
        button.classList.add(this.settings.cssClass.keyButton);
        button.innerHTML = char;
        button.addEventListener('click', function (e) {
            addCharacter(this.innerHTML);
            e.preventDefault();
            return false;
        });
        return button;
    };
    TypeKeyboard.prototype.createFunctionButton = function (func) {
        var button = document.createElement('button');
        button.classList.add(this.settings.cssClass.keyButton);
        button.classList.add(this.settings.cssClass.specialKey);
        button.innerHTML = this.specialKeys[func].innerHTML;
        button.addEventListener('click', this.specialKeys[func].click);
        return button;
    };
    ;
    TypeKeyboard.presets = {
        numeric: [
            "7 8 9",
            "4 5 6",
            "1 2 3",
            "0 . {backsp}"
        ],
        querty: [
            '1 2 3 4 5 6 7 8 9 0 - = {backsp}',
            'q w e r t y u i o p [ ] \\',
            '{capslock} a s d f g h j k l ;',
            'z x c v b n m , . /',
            '{space}'
        ]
    };
    return TypeKeyboard;
}());
exports.TypeKeyboard = TypeKeyboard;
