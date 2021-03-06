import isHotkey from 'is-hotkey';
import { toggleBlock, toggleMark, getElement, toggleTabs } from './utils';

const HOTKEYS_MARK = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

const HOTKEYS_BLOCK = {
    'mod+.': ['type', 'bulleted-list'],
    'mod+/': ['type', 'numbered-list'],
    'mod+l': ['align', 'left'],
    'mod+r': ['align', 'right'],
    'mod+e': ['align', 'center'],
};

const higherOrderKeydownHandler = (editor) => {
    return event => {
        for (const hotkey in HOTKEYS_MARK) {
            if (isHotkey(hotkey, event)) {
                event.preventDefault();
                toggleMark(editor, HOTKEYS_MARK[hotkey]);
                return;
            }
        }
        for (const hotkey in HOTKEYS_BLOCK) {
            if (isHotkey(hotkey, event)) {
                event.preventDefault();
                toggleBlock(editor, ...HOTKEYS_BLOCK[hotkey]);
                return;
            }
        }

        // tab
        if (isHotkey('shift+tab', event)) {
            event.preventDefault();
            toggleTabs(editor,-1);
        }
        if (isHotkey('tab', event)) {
            event.preventDefault();
            toggleTabs(editor,1);
        }
    }
}

export default higherOrderKeydownHandler;