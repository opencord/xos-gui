export default function XosLogDecorator($provide: ng.auto.IProvideService) {
  $provide.decorator('$log', function($delegate: any) {
    const isLogEnabled = () => {
      return window.location.href.indexOf('debug=true') >= 0;
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
        if (!isLogEnabled()) {
          return;
        }

        let args    = [].slice.call(arguments);
        let now     = new Date();

        // Prepend timestamp
        args[0] = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${args[0]}`;

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
