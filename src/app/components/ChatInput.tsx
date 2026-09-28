"use client";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function ChatInput({
  input,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const isDisabled = isLoading || input.trim().length === 0;

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (isDisabled) return;
        onSubmit();
      }}
    >
      <label htmlFor="chat-input" className="sr-only">
        Mensaje
      </label>
      <input
        id="chat-input"
        type="text"
        value={input}
        onChange={(event) => onChange(event.target.value)}
        disabled={isLoading}
        placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu mensaje"}
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
