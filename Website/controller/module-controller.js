import pgPromise from 'pg-promise';
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

export class ModuleController {
    default(req, res) {
        console.log("default case");
        res.render("module", {info: "Initial Data"});
    }
    module(req, res) {
        console.log(req);

        db.func('get_subjects')
        .then(data => {
            console.log('DATA:', data);
            res.render("module", {modules: data});
        })
        .catch(error => {
            console.log('ERROR:', error);
            res.render("module", {modules: "Datbase Access didn't work: " + error});
        });
    };
}

export const moduleController = new ModuleController();


