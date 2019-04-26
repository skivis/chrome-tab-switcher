const menus = {
  main: `
  Usage: cts [command] <options>

  Simple CLI to automatically switch tabs in chrome

  run         Open chrome and starts switching tabs
  version     Show package version
  help        Show help menu for a command`,

  run: `
  cts run <options>

  --file, -f        the path to json file (list of urls)
  --delay, -d       delay in seconds between tab switches`
};

module.exports = args => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
