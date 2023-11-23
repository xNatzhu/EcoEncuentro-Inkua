"use strict";

const { google } = require('googleapis');
const { authenticate } = require('./auth');
require('dotenv').config();

const driveFolder = process.env.DRIVE_FOLDER;

async function logGenerator(req, res, next) {
    const requestStart = Date.now();
    let logged = false;

    /*if (req.method === 'OPTIONS') {
        return next();
    };*/

    res.on('close', async () => {
        if (logged) return; 

        const logEntry = {
            ip: req.ip || req.connection.remoteAddress,
            endpoint: req.originalUrl,
            url: `${req.rawHeaders[9]}${req.originalUrl}`,
            method: req.method,
            //header: req.rawHeaders,
            timestamp: new Date(),
            processingTime: `${Date.now() - requestStart} ms`,
            resStatus: res.statusCode
        };

        try {
            // Log entry is created when the connection closes
            await uploadLogEntryToDrive(logEntry);
            logged = true;

            return logEntry;
        } catch (err) {
            console.error('Error writing to request log or uploading to Google Drive:', err)
            return err.message
        };
    });

    next();
};


async function uploadLogEntryToDrive(logEntry) {
    try {
        const auth = await authenticate();
        const drive = google.drive({ version: 'v3', auth });

        const existingFile = await drive.files.list({
            q: `'${driveFolder}' in parents and name='inkuaLogs.txt' and trashed=false`,
            fields: 'files(id)',
        });

        let fileId = null;

        if (existingFile.data.files.length > 0) {
            fileId = existingFile.data.files[0].id;

            const currentContent = await drive.files.get({
                fileId: fileId,
                alt: 'media',
            });

            const newContent = currentContent.data + JSON.stringify(logEntry) + "," +  '\n';

            // Actualizar el contenido del archivo en Google Drive
            await drive.files.update({
                fileId: fileId,
                media: {
                    mimeType: 'text/plain',
                    body: newContent,
                },
            });

            console.log('Log entry updated on Google Drive successfully in new file.');
        } else {
            // Crear un nuevo archivo si no existe
            await drive.files.create({
                resource: {
                    name: 'inkuaLogs.txt',
                    parents: [driveFolder],
                },
                media: {
                    mimeType: 'text/plain',
                    body: JSON.stringify(logEntry) + '\n',
                },
                fields: 'id',
            });

            console.log('Log entry uploaded to Google Drive successfully, just update file.');
        };
    } catch (error) {
        console.error('Error uploading log entry to Google Drive:', error);
        throw error;
    };
};


module.exports = { logGenerator };
