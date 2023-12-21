const fs = require('fs');
const https = require('https');
const path = require('path');
const http = require('http');
const url = require('url');
const AdmZip = require("adm-zip");
const zip = new AdmZip();
const axios = require('axios');
const _7z = require('7zip-min');
const downloadsFolder = __dirname + '/download/';
const oplFolder = __dirname + '/opl/'
const { gitToken, secretAccessKey, accessKeyId, region, uploadApi } = require("../config.json");
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
let version = '';

const urls = [
    {
        "url": "https://github.com/ps2homebrew/Open-PS2-Loader/releases/download/latest/OPNPS2LD-LANGS.7z",
        "folder": "langs/",
        "name": "lang.7z",
        "compress": true

    },
    {
        "url" : "https://github.com/ps2homebrew/Open-PS2-Loader/releases/download/latest/OPNPS2LD.7z",
        "folder" :  "opl/",
        "name": "opl.7z",
        "compress": true
    },
    {
        "url" : "https://github.com/ps2homebrew/wLaunchELF/releases/download/latest/BOOT.ELF",
        "folder" : "ule/",
        "name": "BOOT2.ELF",
        "compress": false
    }
]

console.log('pasta atual: ' + __dirname);

// async function checkFolderExists(folder){
//     const newdir = path.join(__dirname + '/' + folder);
//     //console.log('checando se a pasta existe', newdir);
//     if(!fs.existsSync(newdir)){
//         console.log('pasta não existe, criando: ', newdir)
//         fs.mkdir(newdir, (err) => 
//         {
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log('Pasta criada: ' + newdir);
//             }
//         });
//     //} else { console.log("pasta já existe: ", newdir);
//     }
// }

async function downloadFile(url, folder, name, compress) {
    //const filename = path.basename(url);
    //console.log("PROCESSANDO ARQUIVO: " + filename);
    const filePath = path.join(downloadsFolder, folder);
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });

        // Espera até que a função checkFolderExists seja concluída
        //await checkFolderExists(folder);

        response.data.pipe(fs.createWriteStream(filePath + name));
        
        await new Promise((resolve, reject) => {
            response.data.on('end', () => {
                console.log("Download concluído para: " + filePath);
                checkFolderItems(downloadsFolder)
                resolve();
            });

            response.data.on('error', (error) => {
                console.error("Erro durante o download:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("Erro durante o download:", error);
    }
}

async function decompress7z(file, folder) {
    const dir = path.resolve(folder, file);
    _7z.unpack(dir, folder, err => {
        if(err){console.log("Aviso: ", err);}
        fs.rm(dir, (err) => {
            if(err){
                console.warn(err.message);
                checkFolderItems(folder)
            }
        })
    });
}

async function decompressZip(file, folder){
    const dir = path.resolve(folder, file);
    console.log("ZIP: Descomprimindo arquivo: " + dir);
    //console.log("Nome do arquivo: " + path.basename(file));
    const zip = new AdmZip(dir);
    zip.extractAllTo(path.dirname(folder));
    fs.rm(dir, (err) => {
        if(err){
            console.warn(err.message)
        } else {
            checkFolderItems(folder)
        }
    })
    //checkFolderItems(path.dirname(file));
}

async function checkFolderItems(folder){
    //console.log('checkFolderItems: Checando pasta: ', folder);
    fs.readdir(folder, (err, items) => {
        if (err)
            console.warn(err);
        else {
            items.forEach(item => {
                const dir = path.join(folder + '/' + item);
                //console.log("processando item: ", dir);
                fs.stat(dir, (err, stat) =>{
                    if(stat && stat.isDirectory()){
                        //console.log('é uma pasta: ', dir);
                        checkFolderItems(dir)
                    } else {
                        dealWithFiles(dir)
                    }
                })
            })
        }
    });
}

async function dealWithFiles(item){
    //console.log('item final recebido: ' + path.extname(item))
    //console.log(path.basename(item).includes('OPNPS2LD'))
    if(path.extname(item) == ".7z"){
        //console.log("arquivo 7zip na pasta, extraindo...")
        const file = path.basename(item);
        const folder = path.dirname(item);
        //console.log('arquivo: ', file, ' pasta: ', folder);
        decompress7z(file, folder);
        //decompress7z(item, path.dirname(item))
    }
    if(path.extname(item) == ".zip"){
        //console.log('arquivo zip encontrado na pasta: ' + path.dirname(item) )
        //decompressZip(item, path.dirname(item));
        const file = path.basename(item);
        const folder = path.dirname(item);
        console.log('arquivo: ', file, ' pasta: ', folder);
        decompressZip(file, folder);
    }
    if(path.basename(item) == "font_Portuguese_BR.ttf"){
        const lngFolder = path.resolve(oplFolder, 'LNG/');
        if(!fs.existsSync(lngFolder)){
            fs.mkdirSync(lngFolder)
        }
        fs.copyFile(item, lngFolder + '/' + path.basename(item), err => err?err.message:'');
    }
    if(path.basename(item) == "lang_Portuguese_BR.lng"){
        const lngFolder = path.resolve(oplFolder, 'LNG/');
        if(!fs.existsSync(lngFolder)){
            fs.mkdirSync(lngFolder)
        }
        fs.copyFile(item, lngFolder + '/' + path.basename(item), err => err?err.message:'');
    }
    if(path.basename(item) == 'BOOT2.ELF'){
        const bootFolder = path.resolve(oplFolder, 'BOOT/');
        if(!fs.existsSync(bootFolder)){
            fs.mkdirSync(bootFolder)
        }
        fs.copyFile(item, bootFolder + '/' + path.basename(item), err => err?err.message:'');
    }
    if(path.basename(item).includes('OPNPS2LD') && path.extname(item)=='.ELF'){
        const bootFolder = path.resolve(oplFolder, 'BOOT/');
        if(!fs.existsSync(bootFolder)){
            fs.mkdirSync(bootFolder)
        }
        fs.copyFile(item, bootFolder + '/' + 'BOOT.ELF', err => err?err.message:'');
    }
    if(path.basename(item)=='CREDITS' || path.basename(item)=='DETAILED_CHANGELOG' || path.basename(item)=='LICENSE' || path.basename(item)=='README.md'){
        const infoFolder = path.resolve(oplFolder, 'INFO/');
        if(!fs.existsSync(infoFolder)){
            fs.mkdirSync(infoFolder)
        }
        fs.copyFile(item, infoFolder + '/' + path.basename(item), err => err?err.message:'');
    }
}

async function createZip(cb){
    //console.log('versão recebida: ', version)
    fs.copyFile(__dirname + '/assets/LEIAME.txt', oplFolder + '/LEIAME.txt', err => err?err.message:'');
    fs.copyFile(__dirname + '/assets/conf_apps.cfg', oplFolder + '/conf_apps.cfg', err => err?err.message:'');
    if(!fs.existsSync(path.resolve(oplFolder + "OPL/"))){
        fs.mkdirSync(path.resolve(oplFolder + "OPL/"))
    }
    fs.copyFile(__dirname + '/assets/my.icn', oplFolder + '/OPL/my.icn', err => err?err.message:'');
    fs.copyFile(__dirname + '/assets/icon.sys', oplFolder + '/OPL/icon.sys', err => err?err.message:'');
    fs.copyFile(__dirname + '/assets/my.icn', oplFolder + '/BOOT/my.icn', err => err?err.message:'');
    fs.copyFile(__dirname + '/assets/icon.sys', oplFolder + '/BOOT/icon.sys', err => err?err.message:'');
    var zip = new AdmZip();
    console.log(__dirname);
    const destination = path.resolve(__dirname + "/HLOPL" + version + ".zip");
    const origin = path.resolve(oplFolder);
    const comments = path.resolve(__dirname + "/assets/links.txt");
    fs.readFile(comments, (err, data) => {
        if (err) throw err;
        console.log(data);
        console.log('criando arquivo zip! destino: ', destination, origin, comments);
        zip.addZipComment(data);
        zip.addLocalFolder(origin)
        zip.writeZip(destination);
    });
    await cb(destination);
}

async function setUrls(createZip){
    for(const url of urls){
        await downloadFile(url.url, url.folder, url.name, url.compress);
    }
}

async function moveToSite(destination){
    console.log("movendo: ", destination);
    const today = new Date;
    const mes = parseInt(today.getMonth()) + 1;
    const mesFinal = mes < 10 ? 0 + String(mes) : mes;
    const folder = 'opl/' + path.join(String(today.getFullYear()), mesFinal);

    const size = await getFileSize(destination);
    //console.log('pasta resolvida', folder);
    const s3Client = new S3Client({ 
        region: 'us-east-2', 
        credentials:{
            accessKeyId,
            secretAccessKey
        }
    });
    const command = new PutObjectCommand({
        Bucket: "hardlevel",
        Key: folder + '/' + path.basename(destination),
        Body: fs.createReadStream(destination)
    })
    try {
        //const response = await s3Client.send(command);
        const fileUrl = "https://hardlevel.s3.us-east-2.amazonaws.com/opl/" + folder + path.basename(destination);
        await addFileToSite(fileUrl, version, size)
    } catch (error) {
        console.log(error.message);
    }
}
//console.log(s3client);
async function addFileToSite(file, version, size){
    // const response = await axios.post("https://hardlevel.com.br/wp-json/wpdm/v1/packages", {
    //     title: "OPL 1.2.0 Oficial Beta " + version,
    //     description: "%found_line%",
    //     status: "publish",
    //     files: {"1": file},
    //     tags: ["ps2", "open ps2 loader"],
    //     categories: [1436, 2385],
    //     version: version,
    //     access: ["guest","subscriber","administrator"],
    //     package_size: size 
    // },{
    //     headers: {
    //         Authorization: uploadApi
    //     }
    // })
    return 275655;
    //console.log(response.data.id)
}

async function getFileSize(file) {
    try {
        const stat = await fs.statSync(file);
        //console.log("tamanho: ", stat.size);
        return stat.size / 1024 / 1024;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteFiles(cb){
    fs.rmSync(oplFolder);
    fs.rmSync(downloadsFolder);
    moveTosite()
}

async function createDirs(folder){
    const filePath = path.join(downloadsFolder + folder);
    if(!fs.existsSync(filePath)){
        console.log("pasta não existe: ", filePath);
        fs.mkdir(filePath, {recursive: true}, err => console.log(err));
    } else { console.log("pasta existe: ", filePath);}
    if(!fs.existsSync(oplFolder)){
        fs.mkdir(oplFolder, res => console.log(res));
    }
}

async function checkVersion(){
    const gitData = await getGitData('https://api.github.com/repos/ps2homebrew/Open-PS2-Loader/releases');
    const [foo] = Object.values(gitData);
    //console.log([foo]);
    version = [foo.assets[0].name][0].slice(27, 31);
    //console.log(version);
    if(fs.existsSync(__dirname + '/assets/version.txt')){
        fs.readFile(__dirname + '/assets/version.txt', 'utf8', (err, data) => {
            //console.log(data);
            if(data != version){
                setUrls(createZip);
            }
        });
    }
}

const getGitData = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer " + gitToken
            }
        });
        const { status } = response; 
        const data = response.json();
        return data;
    } catch (err) {
     // handle error
        console.error(err);
    }
}




module.exports = async function start(){
    try {
        await checkVersion();
        await createZip(moveToSite);
    } catch (error) {
        
    }
    //await setUrls(createZip);
    // await checkFolderExists(downloadsFolder).then(
    //     checkFolderExists(oplFolder).then(res => {
    //         setUrls();
    //     })
    // );
    // for(const url of urls){
    //     createDirs(url.folder)
    //         .then(downloadFile(url.url, url.folder, url.name, url.compress, createZip))
    // }
}

// // add file directly
// var content = "inner content of the file";
// zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");
// // add local file
// //zip.addLocalFile("/home/me/some_picture.png");
// // get everything as a buffer
// var willSendthis = zip.toBuffer();
// // or write everything to disk
// zip.addZipComment("pinto mole");
// zip.writeZip(/*target file name*/ "./files.zip");