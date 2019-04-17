# Chrome Tab Switcher (i.e. dashboards?)

## Prerequisites
Google Chrome & Node

## Getting Started

### Start Chrome with remote debugging enabled.

#### MacOS
```sh
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
```

#### Windows
```sh
start chrome.exe --remote-debugging-port=9222
```

### Run the script

Now create a JSON file with a list of all the urls you want to switch between and run the script.

```json
// example
[
    "https://google.com",
    "https://github.com",
    "https://example.com"
]
```

```sh
node cts.js
```

You can also configure the switching with following arguments:
* `--file` is the relative path to your urls json file. Defaults to `./urls.json`
* `--sleep` specifies the time in seconds to wait between tab switches. Defaults to `10` seconds.
