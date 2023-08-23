#!/usr/bin/env node

const {Command} = require('commander')

const command = new Command()

command.command('serve').option('-re').option('-n <oo>').option('-w').action(() => {
  require('./serve.js')
})

command.parse()