/* tslint:disable */

const shedType = 'Round Robin';
const schedTypeOpts = ['Round Robin', 'Proportional Fair', 'MAX C/I'];

export const topoData = {
  "nodes": [
    {"id": 1, "name": "vRouter", "type": "upstream", "model_id": 1, "plane": "data"},



    // slice 1
    {"id": 21, "name": "rru-1", "type": "ran-ru", "model_id": 1, "plane": "data"},
    {"id": 22, "name": "bbu-1", "type": "ran-cu", "model_id": 1, "plane": "data"},
    {"id": 23, "name": "sgw-1", "type": "sgw", "model_id": 1, "plane": "data"},
    {"id": 24, "name": "pgw-1", "type": "pgw", "model_id": 1, "plane": "data"},

    {"id": 25, "name": "rru-1", "type": "ran-ru", "model_id": 1, "plane": "control", "model": {"DlSchedType": shedType, "DlSchedType_opt": schedTypeOpts, "DlAllocRBRate": 30, "UlSchedType": shedType, "UlSchedType_opt": schedTypeOpts, "UlAllocRBRate": 30}},
    {"id": 26, "name": "bbu-1", "type": "ran-cu", "model_id": 1, "plane": "control", "model": {"AdmissionControl": 0,"HandHover": 10}},
    {"id": 27, "name": "sgw-1", "type": "sgw", "model_id": 1, "plane": "control"},
    {"id": 28, "name": "pgw-1", "type": "pgw", "model_id": 1, "plane": "control", "model": {"brand": "Quortus"}},
    {"id": 29, "name": "mme-1", "type": "mme", "model_id": 1, "plane": "control"},

    {"id": 210, "name": "ran-1", "type": "profile", "model_id": 1, "plane": "data", "model": {"start": "2016-01-01T08:00:00.000Z", "end": "2016-12-01T08:00:00.000Z"}},

    {"id": 211, "name": "Murat", "type": "ue", "model_id": 1, "plane": "data", "model": {"id": 123}},




    // slice 2
    {"id": 31, "name": "rru-2", "type": "ran-ru", "model_id": 1, "plane": "data"},
    {"id": 32, "name": "bbu-2", "type": "ran-cu", "model_id": 1, "plane": "data"},
    {"id": 33, "name": "sgw-2", "type": "sgw", "model_id": 1, "plane": "data"},
    {"id": 34, "name": "pgw-2", "type": "pgw", "model_id": 1, "plane": "data"},

    {"id": 35, "name": "rru-2", "type": "ran-ru", "model_id": 1, "plane": "control", "model": {"DlSchedType": shedType, "DlSchedType_opt": schedTypeOpts, "DlAllocRBRate": 30, "UlSchedType": shedType, "UlSchedType_opt": schedTypeOpts, "UlAllocRBRate": 30}},
    {"id": 36, "name": "bbu-2", "type": "ran-cu", "model_id": 1, "plane": "control", "model": {"AdmissionControl": 0,"HandHover": 10}},
    {"id": 37, "name": "sgw-2", "type": "sgw", "model_id": 1, "plane": "control"},
    {"id": 38, "name": "pgw-2", "type": "pgw", "model_id": 1, "plane": "control", "model": {"brand": "Quortus"}},
    {"id": 39, "name": "mme-2", "type": "mme", "model_id": 1, "plane": "control"},

    {"id": 310, "name": "ran-2", "type": "profile", "model_id": 1, "plane": "data", "model": {"start": "2016-01-01T08:00:00.000Z", "end": "2016-12-01T08:00:00.000Z"}},





    // slice 3
    {"id": 41, "name": "rru-3", "type": "ran-ru", "model_id": 1, "plane": "data"},
    {"id": 42, "name": "bbu-3", "type": "ran-cu", "model_id": 1, "plane": "data"},
    {"id": 43, "name": "sgw-3", "type": "sgw", "model_id": 1, "plane": "data"},
    {"id": 44, "name": "pgw-3", "type": "pgw", "model_id": 1, "plane": "data"},
    {"id": 50, "name": "cookie", "type": "cookie", "model_id": 1, "plane": "data", model: {service: "Public Safety", service_opt: ['Public Safety', 'IoT', 'Application'], active: true}},

    {"id": 45, "name": "rru-3", "type": "ran-ru", "model_id": 1, "plane": "control", "model": {"DlSchedType": shedType, "DlSchedType_opt": schedTypeOpts, "DlAllocRBRate": 30, "UlSchedType": shedType, "UlSchedType_opt": schedTypeOpts, "UlAllocRBRate": 30}},
    {"id": 46, "name": "bbu-3", "type": "ran-cu", "model_id": 1, "plane": "control", "model": {"AdmissionControl": 0,"HandHover": 10}},
    {"id": 47, "name": "sgw-3", "type": "sgw", "model_id": 1, "plane": "control"},
    {"id": 48, "name": "pgw-3", "type": "pgw", "model_id": 1, "plane": "control", "model": {"brand": "Quortus"}},
    {"id": 49, "name": "mme-3", "type": "mme", "model_id": 1, "plane": "control"},

    {"id": 410, "name": "ran-3", "type": "profile", "model_id": 1, "plane": "data", "model": {"start": "2016-01-01T08:00:00.000Z", "end": "2016-12-01T08:00:00.000Z"}},

    {"id": 411, "name": "Yannis", "type": "ue", "model_id": 1, "plane": "data", "model": {"id": 123}},




    // slice 4
    {"id": 51, "name": "rru-4", "type": "ran-ru", "model_id": 1, "plane": "data"},
    {"id": 52, "name": "bbu-4", "type": "ran-cu", "model_id": 1, "plane": "data"},
    {"id": 53, "name": "sgw-4", "type": "sgw", "model_id": 1, "plane": "data"},
    {"id": 54, "name": "pgw-4", "type": "pgw", "model_id": 1, "plane": "data"},

    {"id": 55, "name": "rru-4", "type": "ran-ru", "model_id": 1, "plane": "control", "model": {"DlSchedType": shedType, "DlSchedType_opt": schedTypeOpts, "DlAllocRBRate": 30, "UlSchedType": shedType, "UlSchedType_opt": schedTypeOpts, "UlAllocRBRate": 30}},
    {"id": 56, "name": "bbu-4", "type": "ran-cu", "model_id": 1, "plane": "control", "model": {"AdmissionControl": 0,"HandHover": 10}},
    {"id": 57, "name": "sgw-4", "type": "sgw", "model_id": 1, "plane": "control"},
    {"id": 58, "name": "pgw-4", "type": "pgw", "model_id": 1, "plane": "control", "model": {"brand": "Quortus"}},
    {"id": 59, "name": "mme-4", "type": "mme", "model_id": 1, "plane": "control"},

    {"id": 510, "name": "ran-4", "type": "profile", "model_id": 1, "plane": "data", "model": {"start": "2016-01-01T08:00:00.000Z", "end": "2016-12-01T08:00:00.000Z"}},

    {"id": 511, "name": "Joseph", "type": "ue", "model_id": 1, "plane": "data", "model": {"id": 123}},
    {"id": 512, "name": "Girish", "type": "ue", "model_id": 1, "plane": "data", "model": {"id": 123}},

  ],
  "links": [
    {"id": 1, "source": 24, "target": 1, "plane": "data"},

    {"id": 2, "source": 21, "target": 22, "plane": "data"},
    {"id": 3, "source": 22, "target": 23, "plane": "data"},
    {"id": 4, "source": 23, "target": 24, "plane": "data"},

    {"id": 5, "source": 21, "target": 25, "plane": "control"},
    {"id": 6, "source": 22, "target": 26, "plane": "control"},
    {"id": 7, "source": 23, "target": 27, "plane": "control"},
    {"id": 8, "source": 24, "target": 28, "plane": "control"},
    {"id": 9, "source": 25, "target": 26, "plane": "control"},
    {"id": 10, "source": 26, "target": 29, "plane": "control"},
    {"id": 11, "source": 27, "target": 28, "plane": "control"},
    {"id": 12, "source": 27, "target": 29, "plane": "control"},

    {"id": 13, "source": 210, "target": 21, "plane": "data"},

    {"id": 14, "source": 211, "target": 210, "plane": "data"},


    // slice 2
    {"id": 15, "source": 34, "target": 1, "plane": "data"},

    {"id": 16, "source": 31, "target": 32, "plane": "data"},
    {"id": 17, "source": 32, "target": 33, "plane": "data"},
    {"id": 18, "source": 33, "target": 34, "plane": "data"},

    {"id": 19, "source": 31, "target": 35, "plane": "control"},
    {"id": 20, "source": 32, "target": 36, "plane": "control"},
    {"id": 21, "source": 33, "target": 37, "plane": "control"},
    {"id": 22, "source": 34, "target": 38, "plane": "control"},
    {"id": 23, "source": 35, "target": 36, "plane": "control"},
    {"id": 24, "source": 36, "target": 39, "plane": "control"},
    {"id": 25, "source": 37, "target": 38, "plane": "control"},
    {"id": 26, "source": 37, "target": 39, "plane": "control"},

    {"id": 27, "source": 310, "target": 31, "plane": "data"},

    // {"id": 28, "source": 311, "target": 310, "plane": "data"},

    // slice 3
    {"id": 30, "source": 50, "target": 1, "plane": "data"},

    {"id": 31, "source": 41, "target": 42, "plane": "data"},
    {"id": 32, "source": 42, "target": 43, "plane": "data"},
    {"id": 33, "source": 43, "target": 44, "plane": "data"},
    {"id": 44, "source": 44, "target": 50, "plane": "data"},

    {"id": 34, "source": 41, "target": 45, "plane": "control"},
    {"id": 35, "source": 42, "target": 46, "plane": "control"},
    {"id": 36, "source": 43, "target": 47, "plane": "control"},
    {"id": 37, "source": 44, "target": 48, "plane": "control"},
    {"id": 38, "source": 45, "target": 46, "plane": "control"},
    {"id": 39, "source": 46, "target": 49, "plane": "control"},
    {"id": 40, "source": 47, "target": 48, "plane": "control"},
    {"id": 41, "source": 47, "target": 49, "plane": "control"},

    {"id": 42, "source": 410, "target": 41, "plane": "data"},

    {"id": 43, "source": 411, "target": 410, "plane": "data"},

    // slice 4
    {"id": 50, "source": 54, "target": 1, "plane": "data"},

    {"id": 51, "source": 51, "target": 52, "plane": "data"},
    {"id": 52, "source": 52, "target": 53, "plane": "data"},
    {"id": 53, "source": 53, "target": 54, "plane": "data"},

    {"id": 54, "source": 51, "target": 55, "plane": "control"},
    {"id": 55, "source": 52, "target": 56, "plane": "control"},
    {"id": 56, "source": 53, "target": 57, "plane": "control"},
    {"id": 57, "source": 54, "target": 58, "plane": "control"},
    {"id": 58, "source": 55, "target": 56, "plane": "control"},
    {"id": 59, "source": 56, "target": 59, "plane": "control"},
    {"id": 60, "source": 57, "target": 58, "plane": "control"},
    {"id": 61, "source": 57, "target": 59, "plane": "control"},

    {"id": 62, "source": 510, "target": 51, "plane": "data"},

    {"id": 63, "source": 511, "target": 510, "plane": "data"},
    {"id": 64, "source": 512, "target": 510, "plane": "data"},
  ]
};
/* tslint:enable */
