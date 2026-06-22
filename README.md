# Gestor de Reportes CLI

CLI interactivo para gestión de reportes técnicos con filtros combinables y persistencia en disco.  
Proyecto de práctica de **enums, interfaces, funciones de orden superior y reduce**.

---

## Estructura del proyecto

```
src/
├── types.ts      ← Enums Priority y Category, interface Report
├── store.ts      ← Array de reportes + lectura/escritura JSON
├── reports.ts    ← CRUD de reportes (crear, listar, eliminar)
├── filters.ts    ← Funciones de filtrado + applyFilters combinable
├── index.ts      ← CLI interactivo con readline
└── reports.json  ← Base de datos en disco
```

---

## Cómo ejecutar

```bash
pnpm start
```

---

## Conceptos TypeScript practicados

| Concepto | Dónde se usa |
|---|---|
| `enum` numérico | `Priority` (High=1, Medium, Low) y `Category` (Frontend=1, Backend, Architecture, Tools) |
| `interface` | `Report` con campos tipados, `ReportOptions` con opcionales |
| `type` para funciones | `FilterFn = (reports: Report[]) => Report[]` |
| Propiedades opcionales (`?`) | `author?`, `priority?`, `category?` en `ReportOptions` |
| `reduce` para encadenar filtros | `applyFilters()` — aplica N filtros en secuencia |
| `some()` | `filterByTag` — busca si al menos un tag coincide |
| `Math.max` con spread | Generación de IDs sin colisión |
| `async/await` + readline | Flujo del CLI |

---

## Opciones del menú

```
[1] Crear reporte    → título, autor (opcional), prioridad, categoría, tags (separados por coma)
[2] Listar todos     → tabla con todos los reportes
[3] Filtrar reportes → submenú de filtros (ver abajo)
[4] Eliminar reporte → por ID
[0] Salir
```

### Submenú de filtros:
```
[1] Por autor              → búsqueda exacta (case insensitive)
[2] Por tag                → busca reportes que contengan ese tag
[3] Por prioridad          → High / Medium / Low
[4] Por categoría          → Frontend / Backend / Architecture / Tools
[5] Autor + Prioridad      → filtros combinados con applyFilters()
```

---

## Cómo funciona `applyFilters`

La función recibe el array de reportes y N funciones de filtro. Las aplica en secuencia usando `reduce` — el resultado de cada filtro es la entrada del siguiente:

```typescript
applyFilters(
    reports,
    r => filterByAuthor(r, 'Juan'),
    r => filterByPriority(r, Priority.High)
)
// → reportes de Juan con prioridad Alta
```

---

## Modelo de datos

```typescript
enum Priority  { High = 1, Medium, Low }
enum Category  { Frontend = 1, Backend, Architecture, Tools }

interface Report {
    id:        number;
    title:     string;
    author:    string;      // default: 'Anónimo'
    priority:  Priority;   // default: Medium
    category:  Category;   // default: Tools
    tags:      string[];
    createdAt: string;     // toLocaleDateString()
}
```

---

## Notas técnicas

- **Persistencia en disco** — `reports.json` sobrevive al reinicio
- **Valores por defecto** — autor → `'Anónimo'`, prioridad → `Medium`, categoría → `Tools`
- **IDs sin colisión** — generados con `Math.max` sobre ids existentes
- **Filtros combinables** — `applyFilters` permite encadenar cualquier combinación de filtros sin modificar las funciones originales