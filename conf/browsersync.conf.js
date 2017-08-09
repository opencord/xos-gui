
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const conf = require('./gulp.conf');
const proxy = require('./proxy').proxy;
const extensionsProxy = require('./proxy').extensionsProxy;
const socketProxy = require('./proxy').socketProxy;

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      middleware: function(req, res, next){
        if (req.url.indexOf('xosapi') !== -1) {
          proxy.web(req, res);
        }
        else if (req.url.indexOf('socket.io') !== -1) {
          socketProxy.web(req, res);
        }
        else if (req.url.indexOf('extensions') !== -1) {
          extensionsProxy.web(req, res);
        }
        else{
          next();
        }
      }
    },
    open: true
  };
};
