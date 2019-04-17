# Automatic Chrome Tab switching (i.e. dashboards?)

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

Now create a `urls.text` file and write all urls (one line each) you want to switch between and run the script.

```sh
yarn start
```