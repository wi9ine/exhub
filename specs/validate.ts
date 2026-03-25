#!/usr/bin/env bun

/**
 * OpenAPI / AsyncAPI 스펙 파일 유효성 검증 스크립트
 *
 * 사용법:
 *   npx tsx validate.ts [경로...]
 *
 * 경로를 지정하지 않으면 specs 디렉토리 하위의 모든 .json/.yaml/.yml 파일을 검증합니다.
 * 파일 내용에서 "openapi" 또는 "asyncapi" 키를 감지하여 적절한 파서를 자동 선택합니다.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import SwaggerParser from "@apidevtools/swagger-parser";
import type { Diagnostic } from "@asyncapi/parser";
import { Parser as AsyncApiParser } from "@asyncapi/parser";

// ─── 타입 정의 ───────────────────────────────────────────────
type SpecType = "openapi" | "asyncapi";

interface ValidationSummary {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
}

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

function detectSpecType(content: string): SpecType | null {
  // JSON인 경우
  if (content.trimStart().startsWith("{")) {
    try {
      const json = JSON.parse(content);
      if (json.openapi) return "openapi";
      if (json.asyncapi) return "asyncapi";
    } catch {
      // JSON 파싱 실패 시 무시
    }
    return null;
  }

  // YAML인 경우 — 간단한 패턴 매칭
  if (/^\s*openapi\s*:/m.test(content)) return "openapi";
  if (/^\s*asyncapi\s*:/m.test(content)) return "asyncapi";

  return null;
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

// ─── OpenAPI 검증 ────────────────────────────────────────────
async function validateOpenApi(filePath: string): Promise<boolean> {
  try {
    const api = await SwaggerParser.validate(filePath);
    const version =
      (api as Record<string, unknown>).openapi ?? (api as Record<string, unknown>).swagger;
    ok(`OpenAPI ${version ? `v${version}` : ""} — ${api.info?.title ?? "제목 없음"}`);
    return true;
  } catch (err) {
    fail("OpenAPI 검증 실패");
    console.log(`  ${color.dim}${(err as Error).message}${color.reset}`);
    return false;
  }
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

  if (targetFiles.length === 0) {
    warn("검증할 스펙 파일을 찾지 못했습니다.");
    process.exit(0);
  }

  heading(`스펙 파일 검증 시작 (${targetFiles.length}개 파일)`);
  console.log("─".repeat(50));

  const summary: ValidationSummary = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: targetFiles.length,
  };

  for (const filePath of targetFiles) {
    const displayPath = relative(__dirname, filePath);
    info(`${color.bold}${displayPath}${color.reset}`);

    const content = await readFile(filePath, "utf-8");
    const specType = detectSpecType(content);

    if (!specType) {
      warn("스펙 타입을 감지할 수 없습니다 — 건너뜁니다.");
      summary.skipped++;
      console.log();
      continue;
    }

    const success =
      specType === "openapi" ? await validateOpenApi(filePath) : await validateAsyncApi(filePath);

    if (success) {
      summary.passed++;
    } else {
      summary.failed++;
    }
    console.log();
  }

  // ─── 요약 ──────────────────────────────────────────────────
  console.log("─".repeat(50));
  heading("검증 결과 요약");
  console.log(
    `  ${color.green}통과: ${summary.passed}${color.reset}  ` +
      `${color.red}실패: ${summary.failed}${color.reset}  ` +
      `${color.yellow}건너뜀: ${summary.skipped}${color.reset}  ` +
      `${color.dim}전체: ${summary.total}${color.reset}`,
  );
  console.log();

  process.exit(summary.failed > 0 ? 1 : 0);
}

main().catch((err: Error) => {
  fail(`예상치 못한 오류 발생: ${err.message}`);
  process.exit(1);
});
