import store from '@/store';
import IndexDB from '@/store/indexedDB';
import { v4 as uuid } from 'uuid';

export const fontSizeOptions = [
    8, 9, 9.5, 10, 10.5, 11, 11.5, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
]

export const fontFamilyOptions = [
    '微软雅黑',
    '等线',
    '宋体',
    '等线 Light'
]

export const SLATE_DEFAULTS = new Proxy({}, {
    get(target, key) {
        return target[key];
    },
    set(target, key, value) {
        if (key === 'FONT_FAMILY') {
            target[key] = value;
            // not sure whether there's an case that our <html> not finished rendering yet while we modify its style
            document.documentElement.style.setProperty('--slate-default-font-family', `'${value}'`);
            store.set('settings.slateDefaultFontFamily', value);
        } else if (key === 'FONT_SIZE') {
            target[key] = value;
            document.documentElement.style.setProperty('--slate-default-font-size', value + 'pt');
            store.set('settings.slateDefaultFontSize', value);
        } else
            target[key] = value;
        return true;
    }
});
SLATE_DEFAULTS.FONT_FAMILY = store.get('settings.slateDefaultFontFamily');
SLATE_DEFAULTS.FONT_SIZE = store.get('settings.slateDefaultFontSize');

export let customStyles = [];
IndexDB.customStyle().then(v => customStyles = v).catch(e => console.error(e));
// TODO: prepared for loading
export async function pushCustomStyle(value) {
    customStyles = await IndexDB.customStyle([...customStyles, { ...value, id: uuid() }]);
}
export async function altCustomStyle(value) {
    customStyles = await IndexDB.customStyle(value);
}

export let customTableStyles = [];
IndexDB.customTableStyle().then(v => customTableStyles = v).catch(e => console.error(e));
export async function pushCustomTableStyle(value) {
    customTableStyles = await IndexDB.customTableStyle([...customTableStyles, { ...value, id: uuid() }]);
}

export let customResultTemplates = [];
IndexDB.customResultTemplate().then(v => customResultTemplates = v).catch(e => console.error(e));
export async function pushCustomResultTemplate(value) {
    customResultTemplates = await IndexDB.customResultTemplate([...customResultTemplates, { ...value, id: uuid() }]);
}

export let customTransforms = [];
IndexDB.customTransform().then(v => customTransforms = v).catch(e => console.error(e));
export async function pushCustomTransform(value) {
    customTransforms = await IndexDB.customTransform([...customTransforms, { ...value, id: uuid() }]);
}
