// Tipos
import { Report } from './types';

import * as fs from 'fs';
import * as path from 'path';

// El array que acumula nuestros reportes
export const reports: Report[] = [];

const reportJson = path.join(
    __dirname,
    '../reports.json'
);

export const saveReports = (): void => {
    fs.writeFileSync(
        reportJson,
        JSON.stringify(reports, null, 2),
        'utf-8'
    );
}

export const loadReports = (): Report[] => {
    // Si existe la carpeta
    if ( fs.existsSync(reportJson) ) {
        const data = fs.readFileSync(reportJson, 'utf-8');

        // Si el archivo no está vacío
        if ( data.trim().length !== 0 ) {
            const reportsObj: Report[] = JSON.parse(data);

            reportsObj.forEach( report => reports.push(report) );
        }

        return reports;
    }

    return reports;
}


