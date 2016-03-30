'use strict';

import * as path from "path";
import * as fs from "fs";
import * as stream from "stream";

import * as vscode from 'vscode';

interface MarkdownToPDF {
    (opts?: any): stream.Duplex
}

const markdownpdf: MarkdownToPDF = require("markdown-pdf");

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.markdownToPDF', () => {
        
        var editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('no active text editor!');
            return; 
        }

        const file = editor.document.fileName;

        const ext = path.extname(file);

        if (ext === ".md") {
            const reader = fs.createReadStream(file);
            const converter = markdownpdf();
            const writer = fs.createWriteStream(file.replace(ext, '.pdf'));
            
            reader.pipe(converter).pipe(writer);
            
            writer.on('finish', () => {
                vscode.window.showInformationMessage('convert done');
            })
            .on('error', () => {
                vscode.window.showErrorMessage('convert fail');
            })
        } else {
            vscode.window.showWarningMessage('support md file only!');
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}