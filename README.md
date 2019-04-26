# Chrome Tab Switcher

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
start chrome.exe --remote-debugging-port=9222 --user-data-dir=remote-profile
```

### Running the script

Now create a `<whatever>.json` file, listing the urls you want to switch between. Example:

```json
[
    "https://google.com",
    "https://github.com",
    "https://example.com"
]
```

Lastly just run the script. By default the script assumes the configuration file is in the same directory and has the name `urls.json` but this can me configured, see below:

```sh
./bin/cts.js
```

Run `./bin/cts.js --help` for more information on how to run.
