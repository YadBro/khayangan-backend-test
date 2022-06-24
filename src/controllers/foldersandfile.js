const { spawn }    = require("child_process");
const { MongoClient }    = require("mongodb");


exports.addFolderAndFile = (req, res) => {
    try {
        const createFoldersAndFile = [];
        const datas         = Object.values(req.body);
        datas.forEach(item => {
            createFoldersAndFile.push({
                folder  : item.folder,
                file   : item.files});
        });
        let child;
        createFoldersAndFile.map((item) => {
            child = spawn(`cd folders && mkdir ${item.folder} && cd ${item.folder} && touch ${item.file.join(' ')}`, {shell: true});
        });

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('error', (error) => console.log(`error: ${error}`));
        
        child.on('exit', (code, signal) => {
            code && console.log(`child process exited with code ${code}`); 
            signal && console.log(`child process killed with code ${signal}`); 
            console.log("Done");
        });

        res.status(200).send({
            status: "oke"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed"
        });
        
    }
}
let finalresults;
exports.getAllFoldersandFiles = (req, res) => {
    try {
        const body      = req.body;
        const client    = new MongoClient("mongodb://127.0.0.1:27017/");

        // SYNCHRONOUS
        client.connect((error, client) => {
            if (error) {
                return console.log('Koneksi Gagal');
            }

            const db             = client.db("khayangan");
            const collection     = db.collection("attechments");
            collection.find().toArray((error, results) =>{
                finalresults = results;
                collection.find(body[0]
                    // folder: {$regex: body[0].folder},
                    // files: {$regex: new RegExp(body[0].files, 'i')}
                ).toArray((error, result) =>{
                    if(result.length === 0) {
                        const child = spawn(`cd folders && ls`, {shell: true});
                        child.stderr.on("data", (data) =>{
                            console.log(`stderr : ${data}`);
                        });
                        child.stdout.on("data", (data) =>{
                            console.log(`stdout : ${data}`);
                        });
                        child.on("error", (error) => {
                            console.log(`error: ${error.message}`)
                        });

                        child.on("exit", (code, signal) => {
                            code && console.log(`child process exited with code ${code}`);
                            signal && console.log(`child process killed with code ${signal}`);
                        });
                        collection.insertOne(body[0]);
                    }
                    finalresults = result;
                });


                res.status(200).send({
                    attechments: finalresults
                });
            });


        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed"
        });
    }
}