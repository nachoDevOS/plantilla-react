import { PageHeader } from '@/components/admin/common/page-header';
import { type BadgeTone, ToneBadge } from '@/components/admin/common/tone-badge';
import { UserAvatar } from '@/components/admin/common/user-badges';
import {
    type ExampleTask,
    tasks as initialTasks,
    priorityLabels,
    type TaskColumn,
    taskColumns,
    type TaskPriority,
} from '@/components/admin/examples/data';
import { ExampleNotice } from '@/components/admin/examples/example-parts';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CalendarClock, KanbanSquare, Plus } from 'lucide-react';
import { useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Tareas  (ruta /admin/examples/tasks)
 * Tablero por columnas (Por hacer → En curso → En revisión → Terminado).
 * Cada tarjeta se mueve de columna con las flechas; en un módulo real eso sería un PATCH al servidor.
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/tasks' },
    { title: 'Tareas', href: '/admin/examples/tasks' },
];

const priorityTone: Record<TaskPriority, BadgeTone> = { alta: 'red', media: 'amber', baja: 'slate' };

const order: TaskColumn[] = taskColumns.map((c) => c.id);

export default function ExampleTasks() {
    const [items, setItems] = useState<ExampleTask[]>(initialTasks);

    const move = (task: ExampleTask, step: 1 | -1) => {
        const next = order[order.indexOf(task.column) + step];
        if (!next) return;
        setItems((list) => list.map((t) => (t.id === task.id ? { ...t, column: next, progress: next === 'done' ? 100 : t.progress } : t)));
    };

    const done = items.filter((t) => t.column === 'done').length;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={KanbanSquare}
                    title="Tareas del equipo"
                    description={`${done} de ${items.length} tareas terminadas`}
                    actions={
                        <Button className="btn-brand">
                            <Plus /> Nueva tarea
                        </Button>
                    }
                />

                <ExampleNotice />

                {/* Avance general */}
                <div className="surface flex items-center gap-4 rounded-xl px-5 py-4">
                    <p className="text-[13px] font-medium whitespace-nowrap">Avance de la semana</p>
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                        <div
                            className="bg-primary h-full rounded-full transition-[width] duration-500"
                            style={{ width: `${(done / items.length) * 100}%` }}
                        />
                    </div>
                    <p className="num text-[13px] font-semibold">{Math.round((done / items.length) * 100)} %</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {taskColumns.map((column) => {
                        const columnTasks = items.filter((t) => t.column === column.id);
                        return (
                            <section key={column.id} className="bg-muted/50 flex flex-col rounded-xl border p-3">
                                <header className="mb-3 flex items-center gap-2 px-1">
                                    <span className={cn('size-2 rounded-full', column.dot)} />
                                    <h2 className="text-[13px] font-semibold">{column.title}</h2>
                                    <span className="bg-card text-muted-foreground num ml-auto rounded-full border px-2 text-[11px] font-medium">
                                        {columnTasks.length}
                                    </span>
                                </header>

                                <div className="flex flex-1 flex-col gap-3">
                                    {columnTasks.map((task) => (
                                        <TaskCard key={task.id} task={task} onMove={(step) => move(task, step)} />
                                    ))}
                                    {columnTasks.length === 0 && (
                                        <p className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs">Sin tareas</p>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}

function TaskCard({ task, onMove }: { task: ExampleTask; onMove: (step: 1 | -1) => void }) {
    const index = order.indexOf(task.column);
    const isLate = task.column !== 'done' && task.due < '2026-10-30';

    return (
        <article className="bg-card hover:border-primary/40 rounded-lg border p-3.5 shadow-xs transition-colors">
            <div className="flex items-center gap-2">
                <ToneBadge tone={priorityTone[task.priority]} dot>
                    {priorityLabels[task.priority]}
                </ToneBadge>
                <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">{task.tag}</span>
            </div>

            <h3 className={cn('mt-2.5 text-[13px] font-semibold', task.column === 'done' && 'text-muted-foreground line-through')}>{task.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{task.description}</p>

            {task.progress !== undefined && task.column !== 'done' && (
                <div className="mt-3 flex items-center gap-2">
                    <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                        <div className="h-full rounded-full bg-sky-500" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="num text-muted-foreground text-[11px]">{task.progress} %</span>
                </div>
            )}

            <footer className="mt-3 flex items-center gap-2 border-t pt-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <UserAvatar name={task.assignee} className="size-6 text-[10px]" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{task.assignee}</TooltipContent>
                </Tooltip>
                <span
                    className={cn(
                        'flex items-center gap-1 text-[11px]',
                        isLate ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-muted-foreground',
                    )}
                >
                    <CalendarClock className="size-3.5" />
                    {formatDay(task.due, { day: '2-digit', month: 'short' })}
                </span>
                <div className="ml-auto flex gap-1">
                    <button
                        type="button"
                        className="btn-icon size-7!"
                        disabled={index === 0}
                        onClick={() => onMove(-1)}
                        aria-label="Mover a la columna anterior"
                    >
                        <ArrowLeft />
                    </button>
                    <button
                        type="button"
                        className="btn-icon btn-icon-primary size-7!"
                        disabled={index === order.length - 1}
                        onClick={() => onMove(1)}
                        aria-label="Mover a la columna siguiente"
                    >
                        <ArrowRight />
                    </button>
                </div>
            </footer>
        </article>
    );
}
