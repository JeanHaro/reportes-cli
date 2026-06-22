import { Category, Priority, Report } from './types';

export type FilterFn = ( reports: Report[] ) => Report[];

// Filtrado por auto
export const filterByAuthor = ( reports: Report[], author: string ): Report[] => {
    return reports.filter( report => report.author.toLocaleLowerCase() === author.toLocaleLowerCase() );
}

// Filtrado por tag
export const filterByTag = ( reports: Report[], tag: string ): Report[] => {
    // some() - Comprueba si al menos un elemento del array cumple con la condición implementada por la función proporcionada. Devuelve true si encuentra un elemento que cumple la condición, de lo contrario devuelve false.
    return reports.filter( report => report.tags.some( t => t.toLowerCase() === tag.toLocaleLowerCase() ) );
} 

// Filtrado por Prioridad
export const filterByPriority = ( reports: Report[], priority: Priority ): Report[] => {
    return reports.filter( report => report.priority === priority );
}

// Filtrado por Categoría
export const filterByCategory = ( reports: Report[], category: Category ): Report[] => {
    return reports.filter( report => report.category === category );
}

// Múltiples filtros
export const applyFilters = ( reports: Report[], ...filters: FilterFn[] ): Report[] => {
    // reduce() - Aplica una función a un acumulador y a cada valor de un array (de izquierda a derecha) para reducirlo a un único valor.
    // En este caso, el acumulador es filteredReports, que se inicializa con el valor de reports. Luego, para cada filtro en filters, se aplica la función de filtro al acumulador y se actualiza con el resultado. Al final, se devuelve el resultado final después de aplicar todos los filtros.
    // El resultado de cada filtro se pasa como entrada al siguiente filtro, lo que permite encadenar múltiples filtros de manera eficiente.
    // Ejemplo: Si tenemos un array de reportes y queremos filtrar por autor "John" y luego por prioridad "High", podríamos llamar a applyFilters(reports, r => filterByAuthor(r, "John"), r => filterByPriority(r, Priority.High)). Esto aplicaría ambos filtros en secuencia y devolvería los reportes que cumplen con ambos criterios.
    return filters.reduce( ( filteredReports, filter ) => filter( filteredReports ), reports );
}

