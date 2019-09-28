const Realm = require('realm');


const createTable = () => {

};

const openTable = () => {
    Realm.open({
        schema: Car,
    }).then((result) => {

    }).catch((err) => {

    });
};