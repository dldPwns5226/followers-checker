"use client";

import React, { useRef, useState } from "react";
import { parseInstagramZip } from "../../lib/instagramZip";

export default function ChatZipBar() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const onPick = (f: File | null) => {
    setFile(f);
    setStatus(f ? `선택됨: ${f.name}` : "");
  };

  const onSend = async () => {
    if (!file || busy) {
      setStatus(file ? status : "ZIP 파일을 먼저 선택해주세요.");
      return;
    }

    setBusy(true);
    setStatus("ZIP 분석 중…");

    try {
      const r = await parseInstagramZip(file);
      const followers = r.followers.length;
      const following = r.following.length;

      const followersSet = new Set(r.followers);
      const unfollowers = r.following.filter((u: string) => !followersSet.has(u)).length;

      setStatus(
        `완료 ✅ 팔로워 ${followers}, 팔로잉 ${following}, 언팔로워 ${unfollowers}`
      );
    } catch (e: any) {
      setStatus(e?.message ?? "분석에 실패했어요. ZIP 파일을 확인해주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-3xl px-4 pb-4">
        {/* 상태 표시 */}
        {status && (
          <div className="status mb-2 rounded-xl border px-4 py-2 text-sm shadow-sm">
            {status}
          </div>
        )}

        {/* 채팅창 박스 */}
        <div className="bar flex items-center gap-2 rounded-2xl border p-2 shadow-sm">
          {/* + 버튼 */}
          <button
            type="button"
            aria-label="ZIP 추가"
            onClick={() => inputRef.current?.click()}
            className="iconBtn h-11 w-11 shrink-0 rounded-xl active:scale-[0.98]"
            disabled={busy}
          >
            <span className="text-xl leading-none">+</span>
          </button>

          {/* 가운데(파일명 표시) */}
          <div className="fileBox flex h-11 flex-1 items-center rounded-xl px-4 text-sm">
            {file ? file.name : "ZIP 파일을 선택하세요"}
          </div>

          {/* 보내기 버튼 */}
          <button
            type="button"
            aria-label="업로드"
            onClick={onSend}
            disabled={busy}
            className="sendBtn h-11 w-11 shrink-0 rounded-xl active:scale-[0.98] disabled:opacity-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="mx-auto"
            >
              <path
                d="M22 2 11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22 2 15 22l-4-9-9-4 20-7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 숨겨진 파일 input */}
          <input
            ref={inputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <style jsx>{`
        .status {
          background: var(--card);
          color: var(--muted-fg);
          border-color: var(--card-border);
        }

        .bar {
          background: var(--card);
          color: var(--fg);
          border-color: var(--card-border);
        }

        .iconBtn {
          background: transparent;
          color: var(--fg);
        }
        .iconBtn:hover {
          background: var(--muted);
        }

        .fileBox {
          background: var(--muted);
          color: var(--muted-fg);
        }

        .sendBtn {
          background: var(--btn);
          color: var(--btn-fg);
        }
        .sendBtn:hover {
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  );
}
