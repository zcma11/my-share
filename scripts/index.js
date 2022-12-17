#!/usr/bin/env node

const {Command} = require('commander')

const command = new Command()

command.command('serve').action(() => {
  require('./serve.js')
})

command.parse()