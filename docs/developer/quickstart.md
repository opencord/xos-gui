# GUI Quickstart

> NOTE: We assume that you already have CORD running. You can refer to the
[Installation Guide](../../README.md) to get started.

### Operating the GUI

For this, please refer to the [Operation Guide](../../operating_cord/gui.md)

## Serving the GUI in development mode

To launch a development copy:

```shell
// back to your local system
cd cord/orchestration/xos-gui
npm install
PROXY=<cluster-ip>:30006 npm start
```

It will open your default browser at `localhost:3000`, proxy your API request
to the target environment and watch for file changes.

Now you're ready to start working on it!

To get start, login using the appropriate credentials,
then pick any file and make a change, and you'll see the GUI reload.

## Configuring the `dev` GUI

There are two configuration file available in the application, and they depend
on the environment. You can find the various possibilities in `conf/app`, and
they regard application constants, such as `apiEndpoint`, or branding elements,
such as `projectName`.

To load a different configuration file you can use two environment variables:

* `PROXY`: you can use this variable to send request to an arbitrary XOS
  installation (eg: `192.168.99.100:30006`)

* `BRAND`: to configure style constants (eg: `cord`, `mcord`)
