const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const pty = require('node-pty');

const PORT = 3001;

let serverInstance = null;
let wssInstance = null;
let started = false;

function cleanupServer() {
    try { if (wssInstance) { wssInstance.clients.forEach((c) => { try { c.terminate(); } catch (e) {} }); wssInstance.close(); wssInstance = null; } } catch (e) {}
    try { if (serverInstance) { serverInstance.close(); serverInstance = null; } } catch (e) {}
    started = false;
}

function launchShell(app, req, res) {
    if (process.platform === 'win32') {
        res.status(500).send('<pre>ERROR: node-pty is not supported on Windows.</pre>');
        return;
    }

    if (started) {
        return res.sendFile(path.join(__dirname, '../client/index.html'));
    }

    serverInstance = http.createServer(app);
    wssInstance = new WebSocket.Server({ server: serverInstance });

    app.get('/', (req_, res_) => {
        res_.sendFile(path.join(__dirname, '../client/index.html'));
    });

    wssInstance.on('connection', (ws) => {
        ws.send('[DEBUG] New WebSocket client connected.\n');

        const shell = process.env.SHELL || '/bin/bash';
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-256color',
            cols: 80,
            rows: 24,
            cwd: process.env.HOME || process.cwd(),
            env: process.env,
        });

        ptyProcess.on('data', (data) => {
            if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });

        ws.on('message', (msg) => {
            let parsed = null;
            try { parsed = JSON.parse(msg); } catch {}

            if (parsed && parsed.type === 'resize') {
                ptyProcess.resize(parsed.cols, parsed.rows);
            } else {
                ptyProcess.write(msg);
            }
        });

        ws.on('close', () => {
            try { ptyProcess.kill(); } catch {}
        });

        ptyProcess.on('exit', (code) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`[DEBUG] Shell exited with code ${code}\n`);
                ws.close();
            }
        });

        ptyProcess.on('error', (err) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`[ERROR] PTY error: ${err.message}\n`);
            }
        });
    });

    serverInstance.listen(PORT, () => {
        started = true;
        res.sendFile(path.join(__dirname, '../client/index.html'));
    });

    serverInstance.on('error', (err) => {
        cleanupServer();
        res.status(500).send(`<pre>Server error: ${err.message}</pre>`);
    });

    process.once('exit', cleanupServer);
}

module.exports = launchShell;
