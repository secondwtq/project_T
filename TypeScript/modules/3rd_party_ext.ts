/// <reference path="3rd_party_ext.d.ts" />

// use 'reference' in TypeScript to infer the external
// module declaration files, and just 'require' your module names

import url = require('url');
var my_url = url.parse('https://scuisdc.com');