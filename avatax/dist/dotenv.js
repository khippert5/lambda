"use strict";

// 
const dotenv = require('dotenv');

dotenv.config();
if (!process || process && !process.env) throw new Error('No env file found. Can not continue.');