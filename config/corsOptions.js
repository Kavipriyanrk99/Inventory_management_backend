const whitelist = ['http://localhost:3000', 'http://10.1.73.226:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(new Error(`Not allowed by CORS ${origin}`));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = {corsOptions};