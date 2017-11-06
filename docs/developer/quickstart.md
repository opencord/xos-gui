# GUI Quickstart

_We assume that you already have the CORD source downloaded with `repo`_

## Setting up a podconfig

For front-end development, using a podconfig with your choice of CORD flavors and  the `mock` or `local` scenario is sufficient.
`mock` will create a vagrant VM running all the necessary containers, while `local` directly creates the containers on your machine, 
so we recommend using `mock` when developing on your own laptop/desktop.

Assuming you have already downloaded and ran the `cord-bootstrap.sh` script, setup is easy:

```bash
cd ~/cord/build/
make PODCONFIG={CORD_FLAVOR}-mock.yml config
make build |& tee ~/build.out
```  

Further details on the mock configuration and its setup can be found at [Mock Configuration Workflow](/xos/dev/workflow_mock_single.md)

### Login credentials
After the mock profile finishes building, you can find the credentials necessary to login into XOS by running the following:

```
cat ~/cord/build/platform-install/credentials/xosadmin@opencord.org
// save the output somewhere
```

## Serving the GUI in development mode

Once your basic CORD config is up and running you should be able to access the GUI at `http://192.168.46.100/xos/`.

NOTE: This is not your development copy, it is the one deployed inside a container in XOS and will not change until
the container is torn down and redeployed.

To launch a development copy:
```
// back to your local system
cd cord/orchestration/xos-gui
npm install
npm start
```

It will open your default browser at `localhost:3000`, proxy your API request to the local environment and watch for file changes.

**Now you're ready to start working on it!**

To get start, login using username `xosadmin@opencord.org` and the password you previously saved,
then pick any file and make a change, and you'll see the GUI reload.

## Configuring the `dev` GUI

There are two configuration file available in the application, and they depend on the environment. You can find the various possibilities in `conf/app`, and they regard application constants, such as `apiEndpoint`, or branding elements, such as `projectName`.

To load a different configuration file you can use two environment variables:
- `PROXY`: you can use this variable to send request to an arbitrary XOS installation (eg: `clnode022.clemson.cloudlab.us:8080`)
- `BRAND`: to configure style constants (eg: `cord`, `opencloud`)

## Working with an existing XOS installation

You can also specify a different installation of XOS as backend by using the `PROXY` environment variable.
For example, you can connect to a remote CORD-in-a-box installation for debugging purposes with:
`PROXY=ms1106.utah.cloudlab.us:8080 npm start`
