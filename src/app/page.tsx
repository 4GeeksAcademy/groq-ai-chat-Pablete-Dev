import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex h-[100dvh] w-full max-w-5xl flex-col gap-4 p-4 sm:p-6">
        <header>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Groq AI Chat
          </h1>
          <p className="text-sm text-zinc-500">
            Conversación con métricas de uso en tiempo real.
          </p>
        </header>

        <Chat />
      </main>
    </div>
  );
}
