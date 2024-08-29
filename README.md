# html2ast

`html2ast` is a tool that converts HTML into an abstract syntax tree (AST), suitable for scenarios where HTML structure needs to be parsed and processed.

## install

```bash
npm i html2ast
```

## 使用示例

### Node.js

```javascript
import {parse} from 'html2ast'

let tree = parse(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>hello world</h1>
</body>
</html>`)

console.log(tree)
```

## umd

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="https://unpkg.com/html2ast@latest/dist/index.iife.js"></script>
    <script>
        const ast = html2ast.parse('<div><p>hello world</p></div>');
        console.log(ast);
    </script>
</body>
</html>
```