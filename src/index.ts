import * as readline from 'readline';
import { reports, loadReports } from './store';
import { createReport, listReports, deleteReport } from './reports';
import { 
    filterByAuthor, 
    filterByTag, 
    filterByPriority, 
    filterByCategory, 
    applyFilters 
} from './filters';
import { Priority, Category, Report } from './types';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper para no repetir r1.question en cada paso
const preguntar = ( texto: string ): Promise<string> => {
    return new Promise( resolve => rl.question(texto, resolve));
}

// Mostrar reportes
const showReports = ( results: Report[] ): void => {
    if (results.length === 0) console.log('No se encontraron reportes');

    console.table(
        results.map( ({ id, title, author, priority, category, tags, createdAt }) => ({
            ID: id, 
            Título: title, 
            Autor: author,
            Prioridad: Priority[priority],
            Categoría: Category[category],
            Tags: tags.join(', '),
            'Creado en': createdAt
        }))
    );
};

// Preguntar prioridad
const askPriority = async ( type?: string ): Promise<Priority> => {
    const input = await preguntar(`
        \n¿Cuál es la prioridad? (Opcional)
        \n[1] Alta
        \n[2] Media
        \n[3] Baja
    `);

    if (input === '1') return Priority.High;
    if (input === '2' || type === 'crear') return Priority.Medium;
    if (input === '3') return Priority.Low;
    throw new Error('Prioridad inválida');
};

// Preguntar categoría
const askCategory = async ( type?: string ): Promise<Category> => {
    const input = await preguntar(`
        \n¿Cuál es la categoría? (Opcional)
        \n[1] Frontend
        \n[2] Backend
        \n[3] Arquitectura (Architecture)
        \n[4] Herramientas (Tools)
    `);

    if (input === '1') return Category.Frontend;
    if (input === '2') return Category.Backend;
    if (input === '3') return Category.Architecture;
    if (input === '4' || type === 'crear') return Category.Tools;
    throw new Error('Categoría inválida');
};


const askFilters = async (): Promise<void> => {
    console.log(`
        \n[1] Filtrar por autor
        \n[2] Filtrar por tag
        \n[3] Filtrar por prioridad
        \n[4] Filtrar por categoría
        \n[5] Filtrar por autor + prioridad (combinado con applyFilters)
    `);

    const filtro = await preguntar('Selecciona un filtro: ');

    switch ( filtro.trim() ) {
        case '1':
            const autorFiltro = await preguntar('¿Quién es el autor?');
            const report = filterByAuthor(reports, autorFiltro);

            showReports(report);

            break;
        case '2':
            const tagFiltro = await preguntar('¿Cuál es el tag?');
            const reportTag = filterByTag(reports, tagFiltro);

            showReports(reportTag);

            break;
        case '3':
            const priority: Priority = await askPriority();
            const reportPriority = filterByPriority(reports, priority);

            showReports(reportPriority);

            break;
        case '4':
            const category: Category = await askCategory();
            const reportCategory = filterByCategory(reports, category);

            showReports(reportCategory);

            break;
        case '5':
            const autorFiltro2 = await preguntar('¿Quién es el autor?');
            const priority2: Priority = await askPriority();

            const multipleReports = applyFilters(
                reports, 
                r => filterByAuthor(r, autorFiltro2),
                r => filterByPriority(r, priority2)
            );

            showReports(multipleReports);
            break;
        default:
            throw new Error('Opción invalida');
    }
}



const main = async (): Promise<void> => {
    loadReports();

    console.log('\n=== GESTOR DE REPORTES ===\n');
    let continuar: boolean = true;

    while (continuar) {
        console.log(`
            \n[1] Crear reporte
            \n[2] Listar todos
            \n[3] Filtrar reportes
            \n[4] Eliminar reporte
            \n[0] Salir
        `);

        const opcion = await preguntar(`Selecciona una opción: `);

        try {
            switch (opcion.trim()) {
                case '1':
                    const titulo = await preguntar('Título del reporte: ');
                    const author = await preguntar('¿Quién es el autor? (opcional)');
                
                    let priority: Priority = await askPriority('crear');
                    let category: Category = await askCategory('crear');

                    const tagsStr = await preguntar('Tags (separados por comas, opcional): ');
                    const tags: string[] = tagsStr.split(',').map( tag => tag.trim() )

                    createReport(titulo, { author, priority, category }, ...tags);

                    break;
                case '2':
                    listReports();

                    break;
                case '3':
                    await askFilters();

                    break;
                case '4':
                    const id = Number(
                        await preguntar('¿Cuál es el ID del reporte a eliminar?')
                    );

                    if (isNaN(id)) throw new Error('El ID debe ser un número');

                    deleteReport(id);

                    break;
                case '0':
                    continuar = false;
                    rl.close();

                    break;
                default:
                    throw new Error('Opción invalida');
            }
        } catch ( error ) {
            if (error instanceof Error) console.log(`${error.message}`);
        }
    }
};

main();