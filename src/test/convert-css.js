const { transform } = require('react-native-sass-transformer');

const css2rn = require("css-to-react-native-transform").default;
const src = './change.scss';


const sass = require('node-sass');
sass.render({
    file: src,
}, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        // console.log('result', result.css.toString());
        const cssStr = result.css.toString();
        const cssObject = css2rn(cssStr, { parseMediaQueries: true });
        console.log(cssObject);
    }

});