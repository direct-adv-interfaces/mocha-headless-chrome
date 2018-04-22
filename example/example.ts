import {runner} from '../lib/runner';

runner({
    file: './example/example-page.html',
    visible: true
}).then(result => {

    result.result.failures.forEach(test => {
        console.log(`${test.fullTitle} (${test.duration}ms)\n${test.err}`);
    });
}, err => {
    console.error(err);
});
