import JSZip from "jszip";

export type ParseResult = {
  followers: string[];
  following: string[];
};

function lower(s: string) {
  return s.toLowerCase();
}

function extractUsernames(anyJson: any): string[] {
  const out: string[] = [];

  const visit = (node: any) => {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }

    if (typeof node === "object") {
      // 흔한 형태: { string_list_data: [{ value: "username" }, ...] }
      const sld = (node as any).string_list_data;
      if (Array.isArray(sld)) {
        for (const it of sld) {
          const v = it?.value;
          if (typeof v === "string" && v.trim()) out.push(v.trim());
        }
      }

      // 혹시 username이 직접 들어오는 케이스
      const u = (node as any).username;
      if (typeof u === "string" && u.trim()) out.push(u.trim());

      for (const k of Object.keys(node)) visit((node as any)[k]);
    }
  };

  visit(anyJson);

  return Array.from(
    new Set(out.map((s) => s.replace(/^@/, "").trim()).filter(Boolean))
  );
}

export async function parseInstagramZip(file: File): Promise<ParseResult> {
  const zip = await JSZip.loadAsync(file);
  const names = Object.keys(zip.files);

  // connections/followers_and_following/*.json 찾기
  const jsons = names.filter(
    (n) =>
      lower(n).includes("connections/") &&
      lower(n).includes("followers_and_following/") &&
      lower(n).endsWith(".json")
  );

  const followerFiles = jsons.filter((n) => lower(n).includes("followers"));
  const followingFiles = jsons.filter((n) => lower(n).includes("following"));

  if (followerFiles.length === 0 || followingFiles.length === 0) {
    throw new Error(
      "ZIP에서 followers/following JSON을 찾지 못했어요. (connections/followers_and_following 경로인지 확인)"
    );
  }

  const followersAll: string[] = [];
  for (const path of followerFiles) {
    const txt = await zip.file(path)?.async("string");
    if (!txt) continue;
    followersAll.push(...extractUsernames(JSON.parse(txt)));
  }

  const followingAll: string[] = [];
  for (const path of followingFiles) {
    const txt = await zip.file(path)?.async("string");
    if (!txt) continue;
    followingAll.push(...extractUsernames(JSON.parse(txt)));
  }

  return {
    followers: Array.from(new Set(followersAll)),
    following: Array.from(new Set(followingAll)),
  };
}
