/**
 * AsyncAPI 스펙 파일 유효성 검증 스크립트
 *
 * 사용법:
 *   npx tsx validate-asyncapi.ts [경로...]
 *
 * 경로를 지정하지 않으면 현재 디렉토리 하위의 모든 .json/.yaml/.yml 파일 중
 * AsyncAPI 스펙만 검증합니다.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Diagnostic } from "@asyncapi/parser";
import { Parser as AsyncApiParser } from "@asyncapi/parser";

// ─── 색상 유틸 ───────────────────────────────────────────────
const color = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
} as const;

const ok = (msg: string): void => console.log(`${color.green}✔${color.reset} ${msg}`);
const warn = (msg: string): void => console.log(`${color.yellow}⚠${color.reset} ${msg}`);
const fail = (msg: string): void => console.log(`${color.red}✖${color.reset} ${msg}`);
const info = (msg: string): void => console.log(`${color.cyan}ℹ${color.reset} ${msg}`);
const heading = (msg: string): void =>
  console.log(`\n${color.bold}${color.cyan}${msg}${color.reset}`);

// ─── 스펙 타입 감지 ──────────────────────────────────────────
const SPEC_EXTENSIONS = new Set([".json", ".yaml", ".yml"]);

function isAsyncApiSpec(content: string): boolean {
  if (content.trimStart().startsWith("{")) {
    try {
      const json = JSON.parse(content);
      return !!json.asyncapi;
    } catch {
      return false;
    }
  }
  return /^\s*asyncapi\s*:/m.test(content);
}

// ─── 디렉토리 재귀 탐색 ──────────────────────────────────────
async function collectSpecFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      files.push(...(await collectSpecFiles(fullPath)));
    } else if (SPEC_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

// ─── AsyncAPI 검증 ───────────────────────────────────────────
async function validateAsyncApi(filePath: string): Promise<boolean> {
  const asyncParser = new AsyncApiParser();

  try {
    const content = await readFile(filePath, "utf-8");
    const diagnostics: Diagnostic[] = await asyncParser.validate(content);

    // severity: 0 = error, 1 = warning, 2 = info, 3 = hint
    const errors = diagnostics.filter((d) => d.severity === 0);
    const warnings = diagnostics.filter((d) => d.severity === 1);

    if (errors.length > 0) {
      fail(`AsyncAPI 검증 실패 — 에러 ${errors.length}건`);
      for (const err of errors) {
        console.log(`  ${color.red}•${color.reset} ${err.message}`);
        if (err.path?.length) {
          console.log(`    ${color.dim}경로: ${err.path.join(" > ")}${color.reset}`);
        }
      }
      if (warnings.length > 0) {
        warn(`  경고 ${warnings.length}건`);
        for (const w of warnings) {
          console.log(`  ${color.yellow}•${color.reset} ${w.message}`);
        }
      }
      return false;
    }

    // 에러 없음
    if (warnings.length > 0) {
      ok(`AsyncAPI 검증 통과 (경고 ${warnings.length}건)`);
      for (const w of warnings) {
        console.log(`  ${color.yellow}•${color.reset} ${w.message}`);
      }
    } else {
      ok("AsyncAPI 검증 통과");
    }
    return true;
  } catch (err) {
    fail("AsyncAPI 검증 실패");
    console.log(`  ${color.dim}${(err as Error).message}${color.reset}`);
    return false;
  }
}

// ─── 메인 ────────────────────────────────────────────────────
async function main(): Promise<void> {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const args = process.argv.slice(2);

  // 대상 파일 수집
  let targetFiles: string[] = [];

  if (args.length > 0) {
    for (const arg of args) {
      const fullPath = resolve(arg);
      const fileStat = await stat(fullPath);
      if (fileStat.isDirectory()) {
        targetFiles.push(...(await collectSpecFiles(fullPath)));
      } else {
        targetFiles.push(fullPath);
      }
    }
  } else {
    targetFiles = await collectSpecFiles(__dirname);
  }

  // AsyncAPI 스펙만 필터링
  const asyncApiFiles: string[] = [];
  for (const filePath of targetFiles) {
    const content = await readFile(filePath, "utf-8");
    if (isAsyncApiSpec(content)) {
      asyncApiFiles.push(filePath);
    }
  }

  if (asyncApiFiles.length === 0) {
    warn("검증할 AsyncAPI 스펙 파일을 찾지 못했습니다.");
    process.exit(0);
  }

  heading(`AsyncAPI 스펙 검증 시작 (${asyncApiFiles.length}개 파일)`);
  console.log("─".repeat(50));

  let passed = 0;
  let failed = 0;

  for (const filePath of asyncApiFiles) {
    const displayPath = relative(__dirname, filePath);
    info(`${color.bold}${displayPath}${color.reset}`);

    const success = await validateAsyncApi(filePath);
    if (success) {
      passed++;
    } else {
      failed++;
    }
    console.log();
  }

  // ─── 요약 ──────────────────────────────────────────────────
  console.log("─".repeat(50));
  heading("AsyncAPI 검증 결과");
  console.log(
    `  ${color.green}통과: ${passed}${color.reset}  ` +
      `${color.red}실패: ${failed}${color.reset}  ` +
      `${color.dim}전체: ${asyncApiFiles.length}${color.reset}`,
  );
  console.log();

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err: Error) => {
  fail(`예상치 못한 오류 발생: ${err.message}`);
  process.exit(1);
});
