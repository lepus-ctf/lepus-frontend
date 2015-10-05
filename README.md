# Lepus-CTF frontend application

CTF frontent application

*web browser support __Beta__*

## Usage

### Install dependened modules

```
$ npm install
```

### Build

```
$ npm run compile
```

### Demo

Start demo server on http://127.0.0.1:3000 and proxy REST API server to localhost:8000(default).

```
$ npm run demo
```

> NOTE: If you want to proxy to a specific local score-server, you can set the port number
> with `--port=` option like `npm run demo -- --port=8080`

## License
MIT
