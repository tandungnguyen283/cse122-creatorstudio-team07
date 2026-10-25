(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let pid = CS.ui.getProjectId(user);
  let boardId = null;
  let suggestion = null; // { keywords, selected:Set }

  if (!pid) { CS.ui.state($("boardArea"), "empty", { icon: "📁", msg: "Bạn chưa được giao dự án nào." }); $("newBoard").disabled = true; return; }
  CS.ui.projectPicker(user, $("projectSelect"), (id) => { pid = id; boardId = null; load(); });

  const boardsOf = () => CS.store.list("moodboards").filter((m) => m.projectId === pid);

  function load() {
    CS.ui.state($("boardArea"), "loading"); $("boardTabs").innerHTML = "";
    CS.api.list("moodboards", (m) => m.projectId === pid).then(() => {
      const list = boardsOf();
      if (!list.length) {
        CS.ui.state($("boardArea"), "empty", { icon: "🎨", msg: "Dự án này chưa có moodboard.", action: '<button class="btn primary" id="emptyNew">Tạo moodboard</button>' });
        $("emptyNew").onclick = openNew; return;
      }
      if (!boardId || !list.find((m) => m.id === boardId)) boardId = list[0].id;
      renderTabs(list); renderBoard();
    }).catch((e) => CS.ui.state($("boardArea"), "error", { msg: e.message, onRetry: load }));
  }

  function renderTabs(list) {
    $("boardTabs").innerHTML = list.map((m) => `<button class="tab" role="tab" aria-selected="${m.id === boardId}" data-id="${m.id}">${esc(m.title)}</button>`).join("");
  }
  $("boardTabs").addEventListener("click", (e) => {
    const t = e.target.closest(".tab"); if (!t) return;
    boardId = t.dataset.id; suggestion = null; renderTabs(boardsOf()); renderBoard();
  });

  function renderBoard() {
    const m = CS.store.get("moodboards", boardId);
    $("boardArea").innerHTML = `
      <div class="grid cols-2">
        <div>
          <section class="card">
            <header style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap;align-items:center">
              <h2>${esc(m.title)}</h2>${CS.ui.statusBadge(m.status)}
            </header>
            <h3>Từ khóa phong cách</h3>
            <ul class="chips" id="kwList">${m.keywords.length ? m.keywords.map((k, i) => `<li class="chip">${esc(k)} <button class="btn sm" style="border:0;padding:0 .2rem;background:none" data-rmkw="${i}" aria-label="Xóa từ khóa ${esc(k)}">✕</button></li>`).join("") : '<li style="color:var(--muted)">Chưa có từ khóa.</li>'}</ul>
            <form id="kwForm" class="toolbar" style="margin-top:.6rem" novalidate>
              <div class="field" style="margin:0;flex:1"><label for="kwInput" class="sr-only">Thêm từ khóa</label><input id="kwInput" type="text" placeholder="Thêm từ khóa…" required minlength="2"><small class="field-error"></small></div>
              <button class="btn sm" type="submit">Thêm</button>
            </form>

            <h3 style="margin-top:1rem">Bảng màu</h3>
            <ul class="swatches" id="palette">${m.palette.map((c, i) => `<li><button class="swatch" style="background:${esc(c)};cursor:pointer" data-rmcolor="${i}" title="${esc(c)} – bấm để xóa" aria-label="Màu ${esc(c)}, bấm để xóa"></button></li>`).join("")}</ul>
            <div class="toolbar" style="margin-top:.6rem"><label for="colorInput" class="sr-only">Chọn màu</label><input type="color" id="colorInput" value="#d9a5b3" style="width:60px;height:36px;padding:2px"><button class="btn sm" id="addColor">Thêm màu</button></div>

            <div class="actions" style="margin-top:1rem">
              <button class="btn primary" id="publishBtn">${m.status === "published" ? "Chuyển về nháp" : "Đăng cho nhóm"}</button>
              <button class="btn danger" id="delBoard">Xóa moodboard</button>
            </div>
          </section>

          <section class="card">
            <header style="display:flex;justify-content:space-between;align-items:center"><h3>Ô tham chiếu</h3><button class="btn sm" id="addTile">+ Thêm ô</button></header>
            <div id="tiles"></div>
          </section>
        </div>

        <section class="ai-panel" aria-labelledby="aiTitle">
          <h3 id="aiTitle"><span aria-hidden="true">✨</span> Mood Keyword Assistant (AI)</h3>
          <div class="field">
            <label for="aiInput">Mô tả chủ đề dự án</label>
            <input id="aiInput" type="text" placeholder="Ví dụ: quán cà phê cho sinh viên, phong cách ấm áp" required minlength="3">
            <small class="field-error" id="aiErr" aria-live="polite"></small>
          </div>
          <button class="btn primary" id="runAI">Gợi ý từ khóa</button>
          <div id="aiOut" aria-live="polite"></div>
        </section>
      </div>`;
    renderTiles(m);
    wire(m);
  }

  function renderTiles(m) {
    const host = $("tiles");
    if (!m.items.length) { CS.ui.state(host, "empty", { icon: "🖼️", msg: "Chưa có ô tham chiếu nào." }); return; }
    host.innerHTML = '<div class="grid auto" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr));margin-top:.6rem">' + m.items.map((t) => `
      <figure style="margin:0"><figcaption class="mood-tile" style="background:${esc(t.color)}">${esc(t.label)}</figcaption>
      <button class="btn sm danger" style="margin-top:.3rem" data-rmtile="${t.id}">Xóa</button></figure>`).join("") + "</div>";
  }

  function wire(m) {
    const save = (patch, msg) => { CS.store.update("moodboards", m.id, patch); if (msg) CS.ui.toast(msg, "ok"); renderTabs(boardsOf()); renderBoard(); };
    $("kwForm").onsubmit = (e) => {
      e.preventDefault();
      if (!CS.ui.validate($("kwForm"))) return;
      const k = $("kwInput").value.trim().toLowerCase();
      if (m.keywords.includes(k)) { $("kwForm").querySelector(".field-error").textContent = "Từ khóa đã tồn tại."; return; }
      save({ keywords: m.keywords.concat(k) });
    };
    document.querySelectorAll("[data-rmkw]").forEach((b) => (b.onclick = () => save({ keywords: m.keywords.filter((_, i) => i !== +b.dataset.rmkw) })));
    $("addColor").onclick = () => {
      const c = $("colorInput").value;
      if (m.palette.includes(c)) { CS.ui.toast("Màu này đã có trong bảng màu.", "err"); return; }
      if (m.palette.length >= 8) { CS.ui.toast("Tối đa 8 màu.", "err"); return; }
      save({ palette: m.palette.concat(c) });
    };
    document.querySelectorAll("[data-rmcolor]").forEach((b) => (b.onclick = () => save({ palette: m.palette.filter((_, i) => i !== +b.dataset.rmcolor) })));
    document.querySelectorAll("[data-rmtile]").forEach((b) => (b.onclick = () => save({ items: m.items.filter((t) => t.id !== b.dataset.rmtile) })));
    $("addTile").onclick = () => { $("tileForm").reset(); $("tileForm").querySelector(".field-error").textContent = ""; CS.ui.openModal("tileModal"); };
    $("publishBtn").onclick = () => save({ status: m.status === "published" ? "draft" : "published" }, m.status === "published" ? "Đã chuyển về nháp." : "Đã đăng moodboard cho nhóm.");
    $("delBoard").onclick = () => { if (CS.ui.confirm("Xóa moodboard này?")) { CS.store.remove("moodboards", m.id); boardId = null; CS.ui.toast("Đã xóa moodboard."); load(); } };
    $("runAI").onclick = runAI;
  }

  /* ---------- AI-3 ---------- */
  function runAI() {
    const m = CS.store.get("moodboards", boardId);
    const inp = $("aiInput"); const out = $("aiOut");
    $("aiErr").textContent = "";
    if (inp.value.trim().length < 3) { inp.setAttribute("aria-invalid", "true"); $("aiErr").textContent = "Hãy nhập ít nhất 3 ký tự mô tả chủ đề."; inp.focus(); return; }
    inp.setAttribute("aria-invalid", "false");
    $("runAI").disabled = true;
    CS.AI.ui.processing(out);
    CS.AI.suggestKeywords(inp.value, m.keywords).then((r) => {
      suggestion = { keywords: r.keywords, selected: new Set(r.keywords.slice(0, 3)) };
      renderSuggestion(r);
    }).catch((e) => {
      CS.AI.ui.failure(out, e);
      out.querySelector("[data-ai-retry]").onclick = runAI;
      out.querySelector("[data-ai-manual]").onclick = () => { out.innerHTML = ""; $("kwInput").focus(); };
      out.querySelector("[data-ai-report]").onclick = CS.AI.ui.report;
    }).finally(() => { const b = $("runAI"); if (b) b.disabled = false; });
  }

  function renderSuggestion(r) {
    const out = $("aiOut");
    const chips = () => suggestion.keywords.map((k) => `<li><button class="chip" aria-pressed="${suggestion.selected.has(k)}" data-kw="${esc(k)}">${esc(k)}</button></li>`).join("");
    out.innerHTML = `<section class="ai-result">
      <p><strong>Chọn các từ khóa phù hợp:</strong></p>
      <ul class="chips" id="sugChips">${chips()}</ul>
      ${CS.AI.ui.why(r.why, r.confidence, r.low)}
      <div class="actions" style="margin-top:.8rem">
        <button class="btn ok sm" id="aiAccept">Chấp nhận đã chọn</button>
        <button class="btn sm" id="aiRegen">Tạo lại</button>
        <button class="btn danger sm" id="aiReject">Từ chối</button>
      </div></section>`;
    $("sugChips").onclick = (e) => {
      const c = e.target.closest("[data-kw]"); if (!c) return;
      const k = c.dataset.kw; suggestion.selected.has(k) ? suggestion.selected.delete(k) : suggestion.selected.add(k);
      $("sugChips").innerHTML = chips();
    };
    $("aiAccept").onclick = () => {
      if (!suggestion.selected.size) { CS.ui.toast("Hãy chọn ít nhất một từ khóa.", "err"); return; }
      const m = CS.store.get("moodboards", boardId);
      CS.store.update("moodboards", m.id, { keywords: m.keywords.concat(Array.from(suggestion.selected)) });
      CS.ui.toast("Đã thêm " + suggestion.selected.size + " từ khóa vào moodboard.", "ok"); suggestion = null; renderBoard();
    };
    $("aiRegen").onclick = runAI;
    $("aiReject").onclick = () => { suggestion = null; out.innerHTML = '<p style="color:var(--muted)">Đã bỏ gợi ý. Bạn có thể thêm từ khóa thủ công.</p>'; };
  }

  /* ---------- Modal ---------- */
  $("tileForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("tileForm"))) return;
    const m = CS.store.get("moodboards", boardId);
    CS.store.update("moodboards", m.id, { items: m.items.concat({ id: CS.uid("i"), label: $("tLabel").value.trim(), color: $("tColor").value }) });
    CS.ui.closeModal("tileModal"); CS.ui.toast("Đã thêm ô tham chiếu.", "ok"); renderBoard();
  };
  function openNew() { $("boardForm").reset(); $("boardForm").querySelector(".field-error").textContent = ""; CS.ui.openModal("boardModal"); }
  $("newBoard").onclick = openNew;
  $("boardForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("boardForm"))) return;
    const rec = CS.store.add("moodboards", { projectId: pid, title: $("bTitle").value.trim(), keywords: [], palette: [], items: [], status: "draft" });
    boardId = rec.id; CS.ui.closeModal("boardModal"); CS.ui.toast("Đã tạo moodboard.", "ok"); load();
  };

  load();
})();
