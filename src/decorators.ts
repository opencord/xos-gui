
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

export default function XosLogDecorator($provide: ng.auto.IProvideService) {
  $provide.decorator('$log', function($delegate: any) {
    const isLogEnabled = () => {
      // NOTE to enable debug, in the browser console set: localStorage.debug = 'true'
      // NOTE to disable debug, in the browser console set: localStorage.debug = 'false'
      return window.localStorage.getItem('debug-global') === 'true';
    };

    const isEventLogEnabled = () => {
      return window.localStorage.getItem('debug-events') === 'true';
    };

    // Save the original $log.debug()
    let logFn = $delegate.log;
    let infoFn = $delegate.info;
    let warnFn = $delegate.warn;
    // let errorFn = $delegate.error;
    let debugFn = $delegate.debug;

    // create the replacement function
    const replacement = (fn) => {
      return function(){
        // TODO
        // Provide more structure a way to group log message and hide/show them
        // eg: the first parameter is the group name

        const msg = arguments[0];

        if (!isLogEnabled() && msg.indexOf('WebSocket') === -1) {
          return;
        }

        if (!isEventLogEnabled() && msg.indexOf('WebSocket') > -1) {
          return;
        }

        let args    = [].slice.call(arguments);
        let now     = new Date();

        // Prepend timestamp
        args.unshift(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`);

        // Call the original with the output prepended with formatted timestamp
        fn.apply(null, args);
      };
    };

    $delegate.info = replacement(infoFn);
    $delegate.log = replacement(logFn);
    $delegate.warn = replacement(warnFn);
    // $delegate.error = replacement(errorFn); // note this will prevent errors to be printed
    $delegate.debug = replacement(debugFn);

    return $delegate;
  });
}
