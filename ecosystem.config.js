module.exports = {
  apps : [{
    name   : "HardBot",
    script : "./index.js",
    instances: 1,
    ignore_watch : ["node_modules", "logs", "dados.json","data","database"],
    time: true,
    log_date_format: "“DD-MM-YYYY HH:mm Z”"
  }]
}
