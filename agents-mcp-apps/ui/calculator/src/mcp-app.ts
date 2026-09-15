import {
    App,
    applyDocumentTheme,
    applyHostFonts,
    applyHostStyleVariables,
    type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/client";
import "./mcp-app.css";

type Operation = "add" | "subtract" | "multiply" | "divide";

const mainEl = document.querySelector(".main") as HTMLElement;
const aInput = document.getElementById("a") as HTMLInputElement;
const bInput = document.getElementById("b") as HTMLInputElement;
const opSelect = document.getElementById("op") as HTMLSelectElement;
const calculateBtn = document.getElementById("calculate-btn") as HTMLButtonElement;
const resultEl = document.getElementById("result")!;

function renderResult(result: CallToolResult) {
    const { result: value } = (result.structuredContent as { result?: number }) ?? {};
    if (typeof value === "number") {
        resultEl.classList.remove("error");
        resultEl.textContent = String(value);
        return;
    }
    const text = result.content?.find((c) => c.type === "text")?.text;
    resultEl.classList.toggle("error", Boolean(result.isError) || text?.startsWith("Error") === true);
    resultEl.textContent = text ?? "[ERROR]";
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

const app = new App({ name: "Calculator App", version: "1.0.0" });

app.ontoolinput = (params) => {
    const args = params.arguments as { a?: number; b?: number; operation?: Operation } | undefined;
    if (typeof args?.a === "number") aInput.value = String(args.a);
    if (typeof args?.b === "number") bInput.value = String(args.b);
    if (args?.operation) opSelect.value = args.operation;
};

app.ontoolresult = (result) => {
    renderResult(result);
};

app.onerror = console.error;

app.onhostcontextchanged = handleHostContextChanged;

calculateBtn.addEventListener("click", async () => {
    try {
        const result = await app.callServerTool({
            name: "calculate",
            arguments: {
                operation: opSelect.value as Operation,
                a: Number(aInput.value),
                b: Number(bInput.value),
            },
        });
        renderResult(result);
    } catch (e) {
        console.error(e);
        resultEl.classList.add("error");
        resultEl.textContent = "[ERROR]";
    }
});

app.connect().then(() => {
    const ctx = app.getHostContext();
    if (ctx) handleHostContextChanged(ctx);
});
