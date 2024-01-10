module.exports = {
  apps : [{
    name   : "HardBot",
    script : "./index.js",
    instances: 1,
    ignore_watch : ["node_modules", "logs", "dados.json","data","database"],
  }]
}
