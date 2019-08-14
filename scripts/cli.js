#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
let path = require("path");
const config = require('./config');
let { getAppObjectList } = require('./structures/app-structure');
let { compileFolderComponents } = require('./builders/build');

const mainDefinitions = [
  { name: 'action', defaultOption: true }
]

const mainCommand = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
let argv = mainCommand._unknown || []

if (mainCommand.action === 'help') {
  /* eslint-disable-next-line no-console */
  console.log(
    commandLineUsage([
      {
        header: 'Raftaar',
        content: `
          A PWA site generator using HTML, CSS and JavaScript.
          Usage: \`raftaar [action] [options...]\`
        `.trim(),
      },
      {
        header: 'Actions',
        optionList: [
          { name: 'help', summary: 'Display help information about Git.' },
          { name: 'eject', summary: 'ejects a component or shell' },
          { name: 'build', summary: '' },
          { name: 'version', summary: 'Print the version.' },
          { name: 'etc', summary: 'Etc.' }
        ]
      },
    ]),
  );
  process.exit();
}


if (mainCommand.action === 'eject') {
  const actionDefinitions = [
    { name: 'component', alias: 'c', type: String },
    { name: 'shell', alias: 's', type: Boolean },
    { name: 'help', alias: 'h', type: Boolean },
  ];

  const actionOptions = commandLineArgs(actionDefinitions, { argv, stopAtFirstUnknown: true })
  argv = actionOptions._unknown || []

  if (actionOptions.component) {
    let appObjectList = getAppObjectList(config);

    for (appObjectKey in appObjectList) {
      let appObject = appObjectList[appObjectKey];
      if (appObject.type === 'folder' && appObject.tagName === actionOptions.component.trim()) {
        const filePath = path.join(config.componentsDir, `${appObject.tagName}.js`);
        compileFolderComponents(appObject, filePath);
        console.log('Ejecting Component ' + actionOptions.component);
        process.exit();
      }
    }
    console.log('Component ' + actionOptions.component + ' not found');
  }

  if (actionOptions.shell) {
    console.log('Ejecting shell');
  }

  if (actionOptions.help) {
    /* eslint-disable-next-line no-console */
    console.log(
      commandLineUsage([
        {
          header: 'Raftaar',
          content: `
            A PWA site generator using HTML, CSS and JavaScript.
            Usage: \`raftaar ${mainCommand.action} [options...]\`
          `.trim(),
        },
        {
          header: 'Global Options',
          optionList: actionDefinitions,
        },
      ]),
    );
    process.exit();
  }
}