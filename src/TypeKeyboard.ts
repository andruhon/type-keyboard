export interface TypeKeyboardSettings {
    /* inputs selector */
    inputsSelector?: string,
    /* html tags to be used by keyboard elements */
    tag?: {
      button?: string,
      row?: string,
      item?: string
    },
    specialKeyCaption?: {
        space?: string,
        backsp?: string,
        capslock?: string
    },
    /* CSS classes applied to keyboard elements */
    cssClass?: {
        focus?: string,
        keyLine?: string,
        keyItem?: string,
        keyButton?: string,
        specialKey?: string
    }
    /**
     * Callback called when input gained focus
     */
    onFocusCallback?: (e: Event) => any,
    /**
     * Callback called when value of input changes
     */
    onInputCallback?: (focused: HTMLInputElement, value: string) => any
}

export class TypeKeyboard {

    public static presets = {
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

    protected keys: string[][] = [];

    protected settings: TypeKeyboardSettings = {
        inputsSelector: 'textarea, input',
        tag: {
          button: 'button',
          row: 'ul',
          item: 'li'
        },
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

    constructor(protected container: HTMLElement, map: string[], settings?: TypeKeyboardSettings) {
        for(let i = 0; i < map.length; i++){
            this.keys.push(map[i].split(" "));
        }
        Object.assign(this.settings,settings);
        let keyboard = document.createDocumentFragment();
        for (let keyLine of this.keys) {
            let ul = document.createElement(this.settings.tag.row);
            ul.classList.add(this.settings.cssClass.keyLine);
            keyboard.appendChild(ul);
            for (let key of keyLine) {
                let regex = new RegExp('^{([a-z]*)}$');
                let button;
                if(regex.test(key))
                    button = this.createFunctionButton(regex.exec(key)[1]);
                else
                    button = this.createCharacterButton(key);
                let li = document.createElement(this.settings.tag.item);
                button.classList.add(this.settings.cssClass.keyItem);
                li.appendChild(button);
                ul.appendChild(li);
            }
        }
        this.container.appendChild(keyboard);
        this.addListeners();
    }

    protected containerClickListener = () => {
        this.getFocused().focus();
    };

    public addListeners = () => {
        this.container.addEventListener('click', this.containerClickListener);
        let inputs = <HTMLElement[]><any> document.querySelectorAll(this.settings.inputsSelector);
        for(let input of inputs) {
            input.addEventListener('focus', this.focusListener)
        }
    };

    public removeListeners = () => {
        this.container.removeEventListener('click', this.containerClickListener);
        let inputs = <HTMLElement[]><any> document.querySelectorAll(this.settings.inputsSelector);
        for(let input of inputs) {
            input.removeEventListener('focus', this.focusListener);
        }
    };

    public destroy = () => {
        this.removeListeners();
        this.container.innerHTML = '';
    };

    public getFocused = () => {
        return document.getElementsByClassName(this.settings.cssClass.focus).item(0) as HTMLInputElement
    };

    public getAllFocused = () => {
        return Array.from(document.getElementsByClassName(this.settings.cssClass.focus));
    };

    protected focusListener = (e: Event)=> {
        let target = <HTMLInputElement> e.target;
        let settings = this.settings;
        if(target.classList.contains(settings.cssClass.focus)) {
            e.preventDefault();
            return false;
        } else {
            this.getAllFocused().forEach((f)=>f.classList.remove(settings.cssClass.focus));
        }
        target.classList.add(settings.cssClass.focus);
        if (typeof settings.onFocusCallback == 'function') {
            settings.onFocusCallback(e);
        }
    };

    protected addCharacter = (char) => {
        let focused = this.getFocused();
        let value = focused.value + char;
        focused.value = value;
        if (typeof this.settings.onInputCallback == 'function') {
            this.settings.onInputCallback(focused, value);
        }
    };

    protected createCharacterButton (char) {
        let button = document.createElement(this.settings.tag.button);
        let addCharacter = this.addCharacter;
        button.classList.add(this.settings.cssClass.keyButton);
        button.innerHTML = char;
        button.addEventListener('click',function(e){
            addCharacter(this.innerHTML);
            e.preventDefault();
            return false;
        });
        return button;
    }

    protected createFunctionButton (func) {
        let button = document.createElement(this.settings.tag.button);
        button.classList.add(this.settings.cssClass.keyButton);
        button.classList.add(this.settings.cssClass.specialKey);
        button.innerHTML = this.specialKeys[func].innerHTML;
        button.addEventListener('click', this.specialKeys[func].click);
        return button;
    };

    protected spaceClick = (e: Event) => {
        this.addCharacter(' ');
        e.preventDefault();
        return;
    };

    protected backspClick = (e: Event) => {
        let focused = this.getFocused();
        let value = focused.value.substr(0,focused.value.length-1);
        focused.value = value;
        if (typeof this.settings.onInputCallback == 'function') {
            this.settings.onInputCallback(focused, value);
        }
        e.preventDefault();
        return;
    };

    protected capslockClick = (e: Event) => {
        let specialKeys = <HTMLElement[]><any> this.container.getElementsByClassName(this.settings.cssClass.specialKey);
        if(this.specialKeys.capslock.activated){
            for(let specKey of specialKeys) {
                specKey.innerHTML = specKey.innerHTML.toLowerCase();
            }
            this.specialKeys.capslock.activated = false;
        }else if (!this.specialKeys.capslock.activated){
            for(let specKey of specialKeys) {
                specKey.innerHTML = specKey.innerHTML.toUpperCase();
            }
            this.specialKeys.capslock.activated = true;
        }
        e.preventDefault();
        return;
    };

    protected specialKeys = {
        'space' : {
            click : this.spaceClick,
            innerHTML : this.settings.specialKeyCaption.space
        },
        'backsp' : {
            click : this.backspClick,
            innerHTML : this.settings.specialKeyCaption.backsp
        },
        'capslock' : {
            activated : false,
            click : this.capslockClick,
            innerHTML : this.settings.specialKeyCaption.capslock
        }
    };

}
