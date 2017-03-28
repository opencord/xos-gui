// const data: IMicrosemiStatsData = {
//   "dm": {
//     "dmId": 1,
//     "dmCfgType": "DMDMM",
//     "version": "Y17312008",
//     "startTime": "immediate",
//     "stopTime": "none",
//     "current": {
//       "startTime": "2017-03-26T21:53:42.304+01:00",
//       "elapsedTime": "PT2M3S",
//       "suspectStatus": "false",
//       "FrameDelayRangeTwoWayMin": "PT0.00005S",
//       "FrameDelayRangeTwoWayMax": "PT0.00006S",
//       "FrameDelayRangeTwoWayAvg": "PT0.00007S",
//       "FrameDelayRangeTwoWayBins": {
//         "bins": [
//           {
//             "lowerLimit": "PT0S", // 0 - 10 ms
//             "count": 10
//           },
//           {
//             "lowerLimit": "PT0.000005S",  // 10 - 20 ms
//             "count": 15
//           },
//           {
//             "lowerLimit": "PT0.00001S", // 20 - 37 ms
//             "count": 10
//           },
//           {
//             "lowerLimit": "PT0.00002S", // > 37 ms
//             "count": 3
//           }
//         ]
//       },
//       "interFrameDelayVariationTwoWayMin": "PT0.000003S",
//       "interFrameDelayVariationTwoWayMax": "PT0.000005S",
//       "interFrameDelayVariationTwoWayAvg": "PT0.000004S",
//       "interFrameDelayVariationTwoWayBins": {
//         "bins": [
//           {
//             "lowerLimit": "PT0S",
//             "count": 10 // 0 - 3 ms
//           },
//           {
//             "lowerLimit": "PT0.000005S",
//             "count": 15 // 3 - 8 ms
//           },
//           {
//             "lowerLimit": "PT0.00001S",
//             "count": 10 // 8 - 100 ms
//           },
//           {
//             "lowerLimit": "PT0.00002S",
//             "count": 3 // > 100 ms
//           }
//         ]
//       },
//       "soamPdusReceived": "25",
//       "soamPdusSent": "25"
//     },
//     "historic": [
//       {
//         "historyId": "1",
//         "endTime": "2017-03-26T21:37:45.304+01:00",
//         "elapsedTime": "PT3M",
//         "suspectStatus": "false",
//         "FrameDelayRangeTwoWayMin": "PT0.00003S",
//         "FrameDelayRangeTwoWayMax": "PT0.00002S",
//         "FrameDelayRangeTwoWayAvg": "PT0.00001S",
//         "FrameDelayRangeTwoWayBins": {
//           "bins": [
//             {
//               "lowerLimit": "PT0S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.000005S",
//               "count": 15
//             },
//             {
//               "lowerLimit": "PT0.00001S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.00002S",
//               "count": 3
//             }
//           ]
//         },
//         "interFrameDelayVariationTwoWayMin": "PT0.000003S",
//         "interFrameDelayVariationTwoWayMax": "PT0.000005S",
//         "interFrameDelayVariationTwoWayAvg": "PT0.000004S",
//         "interFrameDelayVariationTwoWayBins": {
//           "bins": [
//             {
//               "lowerLimit": "PT0S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.000005S",
//               "count": 15
//             },
//             {
//               "lowerLimit": "PT0.00001S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.00002S",
//               "count": 3
//             }
//           ]
//         },
//         "soamPdusReceived": "25",
//         "soamPdusSent": "25"
//       },
//       {
//         "historyId": "2",
//         "endTime": "2017-03-26T21:27:45.304+01:00",
//         "elapsedTime": "PT3M",
//         "suspectStatus": "false",
//         "FrameDelayRangeTwoWayMin": "PT0.00001S",
//         "FrameDelayRangeTwoWayMax": "PT0.00002S",
//         "FrameDelayRangeTwoWayAvg": "PT0.00003S",
//         "FrameDelayRangeTwoWayBins": {
//           "bins": [
//             {
//               "lowerLimit": "PT0S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.000005S",
//               "count": 15
//             },
//             {
//               "lowerLimit": "PT0.00001S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.00002S",
//               "count": 3
//             }
//           ]
//         },
//         "interFrameDelayVariationTwoWayMin": "PT0.000003S",
//         "interFrameDelayVariationTwoWayMax": "PT0.000005S",
//         "interFrameDelayVariationTwoWayAvg": "PT0.000004S",
//         "interFrameDelayVariationTwoWayBins": {
//           "bins": [
//             {
//               "lowerLimit": "PT0S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.000005S",
//               "count": 15
//             },
//             {
//               "lowerLimit": "PT0.00001S",
//               "count": 10
//             },
//             {
//               "lowerLimit": "PT0.00002S",
//               "count": 3
//             }
//           ]
//         },
//         "soamPdusReceived": "25",
//         "soamPdusSent": "25"
//       }
//     ]
//   }
// };

export interface IMicrosemiStatsBinData {
  lowerLimit: string;
  count: number;
}

export interface IMicrosemiStatsBin {
  bins: IMicrosemiStatsBinData[]
}

export interface IMicrosemiStatsFormat {
  interFrameDelayVariationTwoWayAvg: string;
  interFrameDelayVariationTwoWayMax: string;
  interFrameDelayVariationTwoWayMin: string;
  interFrameDelayVariationTwoWayBins: IMicrosemiStatsBin;
  frameDelayTwoWayAvg: string;
  frameDelayTwoWayMax: string;
  frameDelayTwoWayMin: string;
  frameDelayTwoWayBins: IMicrosemiStatsBin;
  [x: string]: any;
}

export interface IMicrosemiStatsData {
  dm: {
    current: IMicrosemiStatsFormat;
    historic: IMicrosemiStatsFormat[];
    [x: string]: any;
  }
}

export interface IMicrosemiChartData {
  labels: string[];
  data: [number[]];
}

export interface IMicrosemiStats {
  get(vlanId: string, deviceName: string, dmId: string): ng.IPromise<IMicrosemiStatsData>;
}

export class MicrosemiStats implements IMicrosemiStats {

  static $inject = [
    '$q',
    '$http',
    '$log'
  ];

  constructor (
    private $q: ng.IQService,
    private $http: ng.IHttpService,
    private $log: ng.ILogService
  ) {

  }

  public get(vlanId, deviceName, dmId) {
    const d = this.$q.defer();

    const mdName = 'Microsemi';
    const maName = `ma-vlan-${vlanId}`;
    const mepId = deviceName;

    this.$http.get(`/onos/onos-app-cfm/md/${mdName}/ma/${maName}/mep/${mepId}/dm/${dmId}`)
      .then((res: IMicrosemiStatsData) => {
        // d.resolve(data);
        d.resolve(res);
      })
      .catch(err => {
        this.$log.error(`[MicrosemiStats] Error in GET: `, err);
      });

    return d.promise;
  }
}