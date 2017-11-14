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

import * as _ from 'lodash';

export interface IXosServiceGraphIcon {
  path: string;
  transform: string; // do we need it??
}

const icons = [
  {
    name: 'service',
    path: 'M.08,15.51V10.7h0L1.5,10.5,3,10.29s0,0,.06,0A10.13,10.13,0,0,1,3.9,8.05a.11.11,0,0,0,0-.12L2.24,5.66s0-.08,0-.12Q3.91,3.91,5.56,2.26a.08.08,0,0,1,.1,0L7.87,3.83a.21.21,0,0,0,.25,0A10,10,0,0,1,10.17,3s0,0,.05-.05l.09-.56c.11-.65.22-1.29.32-1.94a2.57,2.57,0,0,0,.06-.4h4.78a.11.11,0,0,0,0,.08c.15.92.31,1.84.46,2.76a.07.07,0,0,0,.06.06,11.76,11.76,0,0,1,2.11.88.09.09,0,0,0,.12,0l2.34-1.62a.05.05,0,0,1,.08,0l3.28,3.36a.05.05,0,0,1,0,.08L23.66,6c-.47.63-.93,1.27-1.39,1.91,0,0,0,.06,0,.1l.14.25a9.19,9.19,0,0,1,.74,1.88s0,.06.06.06l.8.13,1.76.3a1.17,1.17,0,0,0,.32,0v4.81H26l-1.41.22-1.26.19c-.14,0-.14,0-.18.15v0a10.33,10.33,0,0,1-.84,2,.1.1,0,0,0,0,.12L24,20.56c0,.05,0,.07,0,.11-1.09,1.1-2.18,2.19-3.26,3.29,0,0-.06,0-.09,0L18.3,22.31a.11.11,0,0,0-.16,0,11,11,0,0,1-2.07.86.11.11,0,0,0-.08.09c-.05.33-.11.66-.16,1-.1.59-.2,1.18-.29,1.77,0,.06,0,.07-.09.07H10.83c-.07,0-.09,0-.1-.08-.15-.91-.31-1.82-.46-2.72,0,0,0-.05,0-.06s-.2,0-.3-.09a10.59,10.59,0,0,1-1.87-.79.09.09,0,0,0-.11,0L5.62,24s-.08,0-.12,0L2.24,20.72s0,0,0-.1c.55-.78,1.1-1.56,1.66-2.33a.11.11,0,0,0,0-.12A9.87,9.87,0,0,1,3,16S3,16,3,16l-.72-.12-1.76-.3C.35,15.55.22,15.52.08,15.51Zm13,2.61a5,5,0,1,0-5-5A5,5,0,0,0,13.08,18.12Z',
    transform: 'translate(-0.08 -0.04)'
  }
];

export interface IXosServiceGraphIcons {
  get(icon: string): IXosServiceGraphIcon;
}

export class XosServiceGraphIcons implements IXosServiceGraphIcons {
  public get(icon: string): IXosServiceGraphIcon {
    return _.find(icons, {name: icon});
  }
}
