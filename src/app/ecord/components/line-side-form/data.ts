export const md = {
  "md": {
    "mdName": "Microsemi",
    "mdNameType": "CHARACTERSTRING",
    "mdLevel": "LEVEL3"
  }
};

export const maJson = {
  "ma": {
    "maName": "ma-vlan-2",
    "maNameType": "CHARACTERSTRING",
    "ccm-interval": "INTERVAL_1S",
    "component-list": [
      { "component": {
        "component-id":"1",
        "tag-type": "VLAN_STAG",
        "vid-list": [
          {"vid":2}
        ]
      }
      }
    ],
    "rmep-list": [
      { "rmep":10 },
      { "rmep":20 }
    ]
  }
};

export const mep1 = {
  "mep": {
    "mepId": 10,
    "deviceId": "netconf:192.168.1.201:830",
    "port": 0,
    "direction": "DOWN_MEP",
    "mdName": "Microsemi",
    "maName": "ma-vlan-2",
    "primary-vid": 2,
    "administrative-state": true,
    "ccm-ltm-priority": 4,
    "cci-enabled" :true
  }
};

export const mep2 = {
  "mep": {
    "mepId": 20,
    "deviceId": "netconf:192.168.1.202:830",
    "port": 0,
    "direction": "DOWN_MEP",
    "mdName": "Microsemi",
    "maName": "ma-vlan-2",
    "primary-vid": 2,
    "administrative-state": true,
    "ccm-ltm-priority": 4,
    "cci-enabled" :true
  }
};

export const dm1 = {
  "dm": {
    "dmId": 2,
    "mdName":"Microsemi",
    "maName":"ma-vlan-2",
    "mepId":10,
    "remoteMepId":20,
    "dmCfgType": "DMDMM",
    "version": "Y17312008",
    "startTime": "immediate",
    "stopTime": "none",
    "frame-size": 64,
    "priority": 2,
    "measurement-interval":1
  }
};

export const dm2 = {
  "dm": {
    "dmId": 1,
    "mdName":"Microsemi",
    "maName":"ma-vlan-2",
    "mepId":10,
    "remoteMepId":20,
    "dmCfgType": "DMDMM",
    "version": "Y17312008",
    "startTime": "immediate",
    "stopTime": "none",
    "frame-size": 1500,
    "priority": 6,
    "measurement-interval": 1
  }
};

export const flows = {
  "flows" : [
    {
      "priority" : 50000,
      "timeout" : 0,
      "isPermanent" : true,
      "tableId" : 6,
      "deviceId" : "netconf:192.168.1.203:830",
      "treatment" : {
        "instructions" : [
          {
            "type" : "L2MODIFICATION",
            "subtype" : "VLAN_PUSH",
            "ethernetType" : "0x88a8"
          },
          {
            "type" : "L2MODIFICATION",
            "subtype" : "VLAN_ID",
            "vlanId": "200"
          }
        ],
        "deferred" : [],
        "transition" : "TABLE:0"
      },
      "selector" : {
        "criteria" : [
          {
            "type" : "VLAN_VID",
            "vlanId" : "1000"
          },
          {
            "type" : "IN_PORT",
            "port" : "1"
          }
        ]
      }
    },
    {
      "priority" : 50000,
      "timeout" : 0,
      "isPermanent" : true,
      "tableId" : 6,
      "deviceId" : "netconf:192.168.1.203:830",
      "treatment" : {
        "instructions" : [
          {
            "type" : "L2MODIFICATION",
            "subtype" : "VLAN_POP"
          }
        ],
        "deferred" : []
      },
      "selector" : {
        "criteria" : [
          {
            "type" : "VLAN_VID",
            "vlanId" : "200"
          },
          {
            "type" : "IN_PORT",
            "port" : "0"
          }
        ]
      }
    }
  ]
};