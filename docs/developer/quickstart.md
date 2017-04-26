# GUI Quickstart

_We assume that you already have the code downloaded with `repo`_

## Setting up the `frontend` configuration

The easiest to work on the XOS GUI is to create a local deployment of the `frontend` configuration of CORD.

You can find detailed instructions in the `platform-install` documentation, but for all that we need you can: 

```
cd opencord/build/platform-install
vagrant up head-node
vagrant ssh
// you're now inside the vagrant VM
cd cord/buid/platform-install
ansible-playbook -i inventory/frontend deploy-xos-playbook.yml
```


> This commands will spin up a local vm and deploy the minimal configuration of CORD in it. <br/>
> _NOTE the first you'll execute this commands they may take a long time (~20 min)_

#### Retrieve the password to access XOS
```
cat ~/cord/buid/platform-install/credentials/xosadmin@opencord.org
// save the output somewhere
```

## Serving the GUI in development mode

Once your basic CORD config is up and running you should be able to access the GUI at `http://192.168.46.100/xos/`
but that's not your development copy, it is the one deployed inside a container in XOS.

To launch a development copy:
```
// back to your local system
cd opencord/orchestration/xos-gui
npm install
npm start
```

It will open your default browser at `localhost:3000`, proxy your API request to the local environment and watch for file changes.

**Now you're ready to start working on it!**

To get start, login using username `xosadmin@opencord.org` and the password you previously saved,
then pick any file and make a change, you'll see the GUI reload.