import pgPromise from 'pg-promise';
export class ModuleController {
    module(req, res) {
        const pgp = pgPromise({});

        const cn = {
            host: 'database',
            port: 5432,
            database: 'osteams',
            user: 'backend',
            password: 'password',
            max: 30 // use up to 30 connections
        };
        const db = pgp(cn);
        db.func('get_subjects')
        .then(data => {
            console.log('DATA:', data);
            res.render("module", {title: data});
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            res.render("module", {title: error});
        });
    };
}

export const moduleController = new ModuleController();


