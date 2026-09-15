import {
    App,
    applyDocumentTheme,
    applyHostFonts,
    applyHostStyleVariables,
    type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/client";
import "./mcp-app.css";

const mainEl = document.querySelector(".main") as HTMLElement;
const aInput = document.getElementById("a") as HTMLInputElement;
const bInput = document.getElementById("b") as HTMLInputElement;
const sumBtn = document.getElementById("sum-btn") as HTMLButtonElement;
const resultEl = document.getElementById("result")!;

function extractSum(result: CallToolResult): string {
    const { sum } = (result.structuredContent as { sum?: number }) ?? {};
    if (typeof sum === "number") return String(sum);
    const text = result.content?.find((c) => c.type === "text")?.text;
    return text ?? "[ERROR]";
}

function handleHostContextChanged(ctx: McpUiHostContext) {
    if (ctx.theme) applyDocumentTheme(ctx.theme);
    if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
    if (ctx.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
    if (ctx.safeAreaInsets) {
        mainEl.style.paddingTop = `${ctx.safeAreaInsets.top}px`;
        mainEl.style.paddingRight = `${ctx.safeAreaInsets.right}px`;
        mainEl.style.paddingBottom = `${ctx.safeAreaInsets.bottom}px`;
        mainEl.style.paddingLeft = `${ctx.safeAreaInsets.left}px`;
    }
}

const app = new App({ name: "Sum App", version: "1.0.0" });

app.ontoolinput = (params) => {
    const args = params.arguments as { a?: number; b?: number } | undefined;
    if (typeof args?.a === "number") aInput.value = String(args.a);
    if (typeof args?.b === "number") bInput.value = String(args.b);
};

app.ontoolresult = (result) => {
    resultEl.textContent = extractSum(result);
};

app.onerror = console.error;

app.onhostcontextchanged = handleHostContextChanged;

sumBtn.addEventListener("click", async () => {
    try {
        const result = await app.callServerTool({
            name: "add",
            arguments: { a: Number(aInput.value), b: Number(bInput.value) },
        });
        resultEl.textContent = extractSum(result);
    } catch (e) {
        console.error(e);
        resultEl.textContent = "[ERROR]";
    }
});

app.connect().then(() => {
    const ctx = app.getHostContext();
    if (ctx) handleHostContextChanged(ctx);
});
