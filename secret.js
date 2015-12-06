{
  "apps" : [{
    // Application #1
    "name"        : "test-shitit",
    "script"      : "server.js",
    "args"        : [],
    "watch"       : true,
    "cwd"         : "dist",
    "env": {
        "NODE_ENV": "development",
        "AWESOME_SERVICE_API_TOKEN": "xxx"
    }
  }]
}
