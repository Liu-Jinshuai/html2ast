// root node
let ast = {
};
let options = {
};
function reset() {
    ast = {
        type: 'Program',
        children: [],
        content: '',
    };
    options = {
        state: 1,
        currentOpenTag: null,
        currentProp: null,
        currentInput: '',
        currentAttrValueQuote: '',
        sectionStart: 0,
        currentIndex: 0,
        stack: [],
        selfClosingTags: new Set([
            'meta', 'img', 'br', 'hr', 'input', 'link', 'base', 'source',
            'track', 'area', 'col', 'wbr', 'embed', 'param', 'keygen', 'command'
        ])
    };
}
function parse(input, optiones) {
    reset();
    let len = input.length;
    options = Object.assign(options, { currentInput: input }, optiones);
    while (options.currentIndex < len) {
        let char = input[options.currentIndex].charCodeAt();
        switch (options.state) {
            case 1:
                stateText(char);
                break;
            case 5:
                stateBeforeTagName(char);
                break;
            case 6:
                stateInTagName(char);
                break;
            case 7:
                stateInSelfClosingTag(char);
                break;
            case 8:
                stateBeforeClosingTagName(char);
                break;
            case 9:
                stateInClosingTagName(char);
                break;
            case 10:
                stateAfterClosingTagName(char);
                break
            case 11:
                stateBeforeAttrName(char);
                break;
            case 12:
                stateInAttrName(char);
                break;
            case 17:
                stateAfterAttrName(char);
                break;
            case 18:
                stateBeforeAttrValue(char);
                break;
            case 19:
                stateInAttrValueDoubleQuotes(char);
                break;
            case 22:
                stateBeforeDeclaration(char);
                break;
            case 23:
                stateInDeclaration(char);
                break;
            case 25:
                stateBeforeComment(char);
                break;
            case 28:
                stateInCommentLike(char);
                break;

        }
        options.currentIndex++;
    }
    return ast;
}
function stateInCommentLike(char) {
    if (char === 45) {
        addNode({
            type: 3,
            content: getSlice(options.sectionStart, options.currentIndex)
        });
        options.state = 23;
    }
}
function stateBeforeComment(char) {
    if (char === 45) {
        options.state = 28;
        while (++options.currentIndex < options.currentInput.length) {
            if (options.currentInput.charCodeAt(options.currentIndex) !== 45) {
                options.sectionStart = options.currentIndex;
                break;
            }
        }
    } else {
        options.state = 23;
    }
}
function stateInDeclaration(char) {
    if (char === 62 || fastForwardTo(62)) {
        options.state = 1;
        options.sectionStart = options.currentIndex + 1;
    }
}
function fastForwardTo(c) {
    while (++options.currentIndex < options.currentInput.length) {
        if (options.currentInput.charCodeAt(options.currentIndex) === c) {
            return true;
        }
    }
    options.currentIndex = options.currentInput.length - 1;
    return false;
}
function stateBeforeDeclaration(char) {
    // -
    options.state = char === 45 ? 25 : 23;
}
function stateInAttrValueDoubleQuotes(char) {
    if (char === options.currentAttrValueQuote) {
        options.currentProp.value = getSlice(options.sectionStart, options.currentIndex);
        options.currentOpenTag.props.push(options.currentProp);
        options.sectionStart = -1;
        options.state = 11;
    }
}
function stateBeforeAttrValue(char) {
    // "
    if (char === 34 || char === 39) {
        options.currentAttrValueQuote = char;
        options.state = 19;
        options.sectionStart = options.currentIndex + 1;
    }
}
function stateInAttrName(char) {
    if (char === 61 || isEndOfTagSection(char)) {
        onattribname(options.sectionStart, options.currentIndex);
        handleAttrNameEnd(char);
    }
}
function handleAttrNameEnd(char) {
    options.state = 17;
    options.sectionStart = options.currentIndex;
    stateAfterAttrName(char);
}
function stateAfterAttrName(char) {
    if (char === 61) {
        options.state = 18;
    } else if (char === 62 || char === 47 || isWhitespace(char)) {
        onattribend();
        options.state = 11;
        options.sectionStart = -1;
        stateBeforeAttrName(char);
    }
}
function onattribend() {
    options.currentOpenTag.props.push(options.currentProp);
    options.currentProp = null;
}
function onattribname(start, end) {
    options.currentProp = {
        type: 6,
        value: void 0,
        name: getSlice(start, end),
    };
}
function stateText(char) {
    // <
    if (char === 60) {
        if (options.currentIndex > options.sectionStart) {
            onText(getSlice(options.sectionStart, options.currentIndex));
        }
        options.sectionStart = options.currentIndex;
        options.state = 5;
    }
}
function stateInClosingTagName(char) {
    if (char === 62 || isWhitespace(char)) {
        onCloseTag();
        options.state = 10;
        stateAfterClosingTagName(char);
    }
}
function stateAfterClosingTagName(char) {
    if (char === 62) {
        options.state = 1;
        options.sectionStart = options.currentIndex + 1;
    }
}
function stateBeforeClosingTagName(char) {
    if (isWhitespace(char));
    else {
        options.state = isTagStartChar(char) ? 9 : 27;
        options.sectionStart = options.currentIndex;
    }
}
function onText(content) {
    let parent = options.stack[0] || ast;
    let lastNode = parent.children[parent.children.length - 1];
    if (lastNode && lastNode.type === 2) {
        lastNode.content += content;
    } else {
        parent.children.push({
            type: 2,
            content,
        });
    }
}
function stateBeforeTagName(char) {
    // !
    if (char === 33) {
        options.state = 22;
        options.sectionStart = options.currentIndex + 1;
    } else if (char === 63) {
        // ?
        options.state = 23;
    } else if (isTagStartChar(char)) {
        options.sectionStart = options.currentIndex;
        options.state = 6;
    } else if (char === 47) {
        // /
        options.state = 8;
    } else {
        options.state = 1;
        stateText(char);
    }
}
function isTagStartChar(c) {
    return c >= 97 && c <= 122 || c >= 65 && c <= 90;
}
function stateInTagName(char) {
    if (isEndOfTagSection(char)) {
        handleTagName(char);
    }
}
function isWhitespace(c) {
    return c === 32 || c === 10 || c === 9 || c === 12 || c === 13;
}
function isEndOfTagSection(c) {
    return c === 47 || c === 62 || isWhitespace(c);
}
function handleTagName(c) {
    onopentagname(options.sectionStart, options.currentIndex);
    options.state = 11;
    options.sectionStart = -1;
    stateBeforeAttrName(c);
}
function onopentagname(start, end) {
    let tagName = options.currentInput.slice(start, end);
    options.currentOpenTag = {
        type: 1,
        tag: tagName,
        props: [],
        children: [],
        content: '',
    };
}
function stateBeforeAttrName(c) {
    // >
    if (c == 62) {
        if (options.selfClosingTags.has(options.currentOpenTag.tag)) {
            onselfclosingtag(options.currentOpenTag);
        } else {
            onopentagend(options.currentOpenTag);
        }
        options.state = 1;
        options.sectionStart = options.currentIndex + 1;

    } else if (c == 47) {
        // /
        options.state = 7;
    } else if (!isWhitespace(c)) {
        // not whitespace
        handleAttrStart();
    }
}
function handleAttrStart(char) {
    options.sectionStart = options.currentIndex;
    options.state = 12;
}
function endOpenTag(currentOpenTag) {
    addNode(currentOpenTag);
    options.stack.unshift(currentOpenTag);
    options.currentOpenTag = null;
}
function addNode(currentOpenTag) {
    (options.stack[0] || ast).children.push(currentOpenTag);
}
function onCloseTag() {
    let tag = getSlice(options.sectionStart, options.currentIndex);
    let stack = options.stack;
    let last = stack[0];
    if (last && last.tag === tag) {
        stack.shift();
    }
}
function getSlice(strt, end) {
    return options.currentInput.slice(strt, end);
}
function onopentagend(currentOpenTag) {
    endOpenTag(currentOpenTag);
}
function stateInSelfClosingTag(char) {
    if (char === 62) {
        onselfclosingtag(options.currentOpenTag);
        options.state = 1;
    } else if (!isWhitespace(char)) {
        options.state = 11;
        stateBeforeAttrName(char);
    }
}
function onselfclosingtag(char) {
    const name = options.currentOpenTag.tag;
    endOpenTag(char);
    if (options.stack[0] && options.stack[0].tag === name) {
        onCloseTag(options.stack.shift());
    }
}

export { parse };
