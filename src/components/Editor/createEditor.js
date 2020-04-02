import React, { useCallback, useMemo, useState } from 'react';
import { withReact, useSelected, useFocused, useSlate, ReactEditor } from 'slate-react';
import { createEditor as _createEditor, Range, Editor, Point, Transforms } from 'slate';
import { withHistory } from 'slate-history';

import { TinyEmitter } from '@/utils/index';
import { DropdownButtonSelect } from '@/components/DropdownButton';
import Button from '@/components/MkButton';

export const createEditor = () => withPlaceholders(withTables(withHistory(withReact(_createEditor()))));

const withTables = editor => {
    const { deleteBackward, deleteForward, insertBreak } = editor;

    editor.deleteBackward = unit => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: n => n.type === 'table-cell',
            });

            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);
                const end = Editor.end(editor, cellPath);
                if (Point.equals(selection.anchor, start)) {
                    //cursor was positioned in both start and end, means no text inside, move to prev cell
                    if (Point.equals(selection.anchor, end)) {
                        Transforms.move(editor, { reverse: true });
                        return;
                    }
                    return;
                }
            }
        }

        deleteBackward(unit)
    }

    editor.deleteForward = unit => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: n => n.type === 'table-cell',
            })

            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);
                const end = Editor.end(editor, cellPath);
                if (Point.equals(selection.anchor, end)) {
                    if (Point.equals(selection.anchor, start)) {
                        Transforms.move(editor);
                        return;
                    }
                    return;
                }
            }
        }

        deleteForward(unit)
    }

    // editor.insertBreak = () => {
    //     const { selection } = editor

    //     if (selection) {
    //         const [table] = Editor.nodes(editor, { match: n => n.type === 'table' })

    //         if (table) {
    //             return
    //         }
    //     }

    //     insertBreak()
    // }

    return editor
}

const withPlaceholders = editor => {
    const { isInline, isVoid } = editor

    editor.isInline = element => {
        return (
            element.type === 'bling-placeholder' ||
            element.type === 'transform-placeholder'
        ) ? true : isInline(element)
    }

    editor.isVoid = element => {
        return (
            element.type === 'bling-placeholder' ||
            element.type === 'transform-placeholder'
        ) ? true : isVoid(element)
    }

    return editor
}

//Transform Placeholder Element (TPE)
const TransformPlaceholderElement = ({ attributes, children, element }) => {
    const editor = useSlate();
    const selected = useSelected();
    const focused = useFocused();

    const [active, setActive] = useState(false);

    const handleChange = value => {
        let [[node, path]] = Editor.nodes(editor, {
            match: n => n.type === "transform-placeholder",
            mode: 'all',
        });
        if (value === 'CLOSE') {
            Transforms.removeNodes(editor, { at: path });
        } else {
            TinyEmitter.emit("TPEclick", [node, path]);
        }
    };

    let style = {};

    if (element.meta.style) {
        style = computeLeafStyle(element.meta.style);
    }

    return (
        <div
            className={`transform-placeholder ${selected && focused ? 'focused' : ''}`}
            {...attributes}
        >
            <DropdownButtonSelect
                value="HAPPY"
                active={active}
                setActive={setActive}
                options={[
                    { label: '样式', value: 'STYLE' },
                    { label: '✘', value: 'CLOSE' },
                ]}
                onChange={handleChange}

                renderButton={ref => (
                    <Button
                        className={active ? '__dropdown dropdown-button' : "dropdown-button"}
                        ref={ref}
                        onMouseDown={event => {
                            event.preventDefault(); // slate.js
                            setActive(!active);
                        }}

                    >
                        <span style={style}> {"HAPPY"} </span>
                    </Button>
                )}
            />
            {children}
        </div>
    )
}

export const renderLeaf = props => <Leaf {...props} />;
const Leaf = ({ attributes, children, leaf }) => {
    let style = computeLeafStyle(leaf);
    let className = '';

    //matched text
    if (leaf.bling) {
        className += ' bling';
        leaf.bling % 2 && (className += ' odd')
    }

    return <span {...attributes} style={style} className={className ? className : null}>{children}</span>;
};

export const computeLeafStyle = (leaf) => {
    let style = {};
    if (leaf.bold) {
        style = { ...style, fontWeight: 'bold' };
    }
    if (leaf.italic) {
        style = { ...style, fontStyle: 'italic' };
    }
    if (leaf.underline) {
        style = { ...style, textDecorationLine: 'underline' };
    }
    if (leaf.strike) {
        style = { ...style, textDecorationLine: style.textDecorationLine ? style.textDecorationLine + ' line-through' : 'line-through' };
    }

    if (leaf.fontColor) {
        style = { ...style, color: leaf.fontColor };
    }
    if (leaf.bgColor) {
        style = { ...style, backgroundColor: leaf.bgColor };
    }
    if (leaf.fontFamily) {
        style = { ...style, fontFamily: leaf.fontFamily };
    }
    if (leaf.fontSize) {
        style = { ...style, fontSize: leaf.fontSize + 'pt' };
    }

    return style;
}

export const renderElement = props => <Element {...props} />;
const Element = (props) => {
    let { attributes, children, element } = props;

    let style = {};
    style = { ...style, textAlign: element.align ? element.align : null };

    attributes = { ...attributes, style }

    switch (element.type) {
        //richtext
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        //table
        case 'table':
            return (
                <table>
                    <tbody {...attributes}>{children}</tbody>
                </table>
            )
        case 'table-row':
            return <tr {...attributes}>{children}</tr>
        case 'table-cell':
            return <td {...attributes}>{children}</td>

        //placeholder
        case 'bling-placeholder':
            return (
                <div
                    className="bling-placeholder"
                    {...attributes}
                >
                    {children}
                </div>
            )
        case 'transform-placeholder':
            return <TransformPlaceholderElement {...props} />

        default:
            return <pre {...attributes}>{children}</pre>;
    }
};
