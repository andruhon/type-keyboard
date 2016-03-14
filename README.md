#TypeKeyboard

Simple vanilla TypeScript keyboard

##Usage

###TypeScript
Import [src/TypeKeyboard.ts](src/TypeKeyboard.ts) from your TypeScript project
and build in whatever way you build your project.

###JavaScript
Include [lib/TypeKeyboard.js](lib/TypeKeyboard.js)

`new TypeKeyboard(container, map, [settings]);`

```JavaScript
var onInputCallback = (focused, value) => {
    var event = new Event('input', {bubbles: true});
    focused.dispatchEvent(event);
};
var container = document.getElementById('calibration-keyboard');
var settings = {onInputCallback: onInputCallback};
var keyboard = new TypeKeyboard(container, TypeKeyboard.presets.numeric, settings);
```

**Settings interface**
```TypeScript
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
```

**Default presets**
```JavaScripts
  {
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
  }
```
