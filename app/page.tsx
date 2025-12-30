import Header from "../components/Header";
import Guide from "../components/guide/Guide";
import ChatZipBar from "../components/upload/ChatZipBar";

export default function Page() {
  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6">
        <Guide totalSteps={10} />
      </main>

      {/* 중앙 하단 고정 업로드 바 */}
      <ChatZipBar />
    </div>
  );
}

