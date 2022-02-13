# Chess.com Voice Commentary

## Development

To run the extension locally,

1. Check if your Node.js version is >= 6.
2. Clone the repository.
3. Install [yarn](https://yarnpkg.com/lang/en/docs/install/).
4. Run `yarn`.
7. Run `npm run start`
8. Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder.

This workflow uses the [webpack server](https://webpack.github.io/docs/webpack-dev-server.html) with auto reload feature that reloads the browser automatically every time that you save some file o your editor.

You can run the dev mode on other port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 npm run start
```

## Publishing (Chess.com team only)

After the development of your extension run the command

```
$ NODE_ENV=production npm run build
```
Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store.

## Credits

- Samuel Simões for [Chrome Extension Webpack Boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate)
