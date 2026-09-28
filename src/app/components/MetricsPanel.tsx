import type { Metrics } from "../types/chat";

type MetricsPanelProps = {
  metrics: Metrics;
  onClear: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-200 py-2 last:border-b-0 dark:border-zinc-800">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 break-all text-right">
        {value}
      </span>
    </div>
  );
}

export default function MetricsPanel({ metrics, onClear }: MetricsPanelProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 lg:w-72">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        Métricas de la sesión
      </h2>

      <div className="flex flex-col">
        <Row label="Prompt tokens" value={String(metrics.promptTokens)} />
        <Row label="Completion tokens" value={String(metrics.completionTokens)} />
        <Row label="Total tokens" value={String(metrics.totalTokens)} />
        <Row label="Respuestas" value={String(metrics.requests)} />
        <Row
          label="Tiempo acumulado"
          value={`${metrics.totalTime.toFixed(3)} s`}
        />
        <Row
          label="Último total_time"
          value={
            metrics.lastTotalTime === null
              ? "—"
              : `${metrics.lastTotalTime.toFixed(3)} s`
          }
        />
        <Row label="Modelo" value={metrics.lastModel ?? "—"} />
      </div>

      <button
        type="button"
        onClick={onClear}
        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-400"
      >
        Borrar conversación
      </button>
    </aside>
  );
}
