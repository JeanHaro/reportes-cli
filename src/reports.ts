import { reports, saveReports } from './store';
import { Category, Priority, Report } from './types';

interface ReportOptions {
    author?: string;
    priority?: Priority;
    category?: Category;
}

// Crear reporte
export const createReport = ( 
    title: string, 
    options: ReportOptions = {},
    ...tags: string[] 
): void => {
    const { author, priority = Priority.Medium, category } = options;
    let nombre_author: string = author?.trim() || 'Anónimo';
    let value_priority: Priority = priority || Priority.Medium;
    let value_category: Category = category || Category['Tools'];

    // Math.max() -> Devuelve el número más grande de cero o más números dados como argumentos, es decir, de los IDs existentes, devuelve el más grande. Si no hay reportes, devuelve -Infinity, por lo que se asigna 1 como ID inicial.
    const nextId = reports.length === 0 ? 1 : Math.max(...reports.map( r => r.id )) + 1;

    const report: Report = {
        id: nextId,
        title,
        author: nombre_author,
        priority: value_priority,
        category: value_category,
        tags,
        createdAt: new Date().toLocaleDateString()
    }
    
    console.log('Reporte creado');
    reports.push(report);
    saveReports();
}

// Listar reportes
export const listReports = (): void => {
    ( reports.length === 0 )
        ? console.log('No hay registros registrados')
        : console.table(
            reports.map( ({ id, title, author, priority, category, tags, createdAt}) => ({
                ID: id,
                Título: title,
                Autor: author,
                Prioridad: Priority[priority],
                Categoría: Category[category],
                Tags: tags,
                "Creado en": createdAt
            }))
        );
}

// Eliminar reporte
export const deleteReport = ( id: number ): void => {
    // 1er parámetro es el índice del elemento a eliminar, el 2do es la cantidad de elementos a eliminar desde ese índice
    reports.splice( 
        reports.findIndex( report => report.id === id ), 1
    );

    console.log('Reporte eliminado');
    
    saveReports();
}