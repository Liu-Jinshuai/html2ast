# html2ast

Convert html to ast.

## install

```bash
npm i html2ast
```

## use

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