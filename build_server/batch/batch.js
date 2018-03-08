require('../global.js');

var scheduler = require('./scheduler');

// month, date, hour, minute
scheduler.register('*', '*', '1', '5', 'UpdatePrice', require('./job/UpdatePrice'));
// scheduler.register('*', '*/2', '5', '5', 'UpdateAll', load('batch.job.UpdateAll'));

if (process.argv[2] === 'debug' && process.argv[3] !== undefined) {
	scheduler.execNow(process.argv[3]);
} else {
	scheduler.run();
}